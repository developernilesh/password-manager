"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlus, FiGlobe, FiLock } from "react-icons/fi";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { PasswordsTable } from "@/components/core/passwords-page/PasswordsTable";
import { verifyMasterPassword, getMasterPasswordHash } from "@/actions/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  decryptDataWithCryptoJS,
  encryptDataWithCryptoJS,
} from "@/lib/encryption-client";
import { apiClient } from "@/lib/api-client";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "../layout/LoadingSpinner";

interface encryptionParams {
  iv: string;
  salt: string;
  algorithm: string;
  hmac: string;
  version: string;
}

interface Password {
  _id: string;
  title: string;
  username: string;
  encryptedData: string;
  encryptionParams: encryptionParams;
  decryptedPassword: string;
  url: string;
  category: string;
  createdAt: string;
}

export function PasswordsPage() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [visibleById, setVisibleById] = useState<Record<string, boolean>>({});
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMasterPassword, setHasMasterPassword] = useState<boolean | null>(
    null
  );
  const router = useRouter();
  const { user } = useUser();

  type PendingAction =
    | { type: "toggle-visibility"; id: string }
    | { type: "copy-password"; value: Password };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const pendingResolveRef = useRef<((ok: boolean) => void) | null>(null);

  const categories = ["all", "social", "work", "finance", "shopping", "other"];

  useEffect(() => {
    // Check if master password is set
    async function checkMasterPassword() {
      setIsLoading(true);
      try {
        const hash = await getMasterPasswordHash();
        setHasMasterPassword(!!hash);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    checkMasterPassword();
    handleGetPasswords();
  }, []);

  const filteredPasswords = useMemo(() => {
    return passwords.filter((password) => {
      const matchesCategory =
        selectedCategory === "all" || password.category === selectedCategory;
      return matchesCategory;
    });
  }, [passwords, selectedCategory]);

  const searchedPasswords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredPasswords;
    return filteredPasswords.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [filteredPasswords, searchQuery]);

  const totalItems = searchedPasswords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, totalItems);
  const paginatedPasswords = useMemo(
    () => searchedPasswords.slice(pageStartIndex, pageEndIndex),
    [searchedPasswords, pageStartIndex, pageEndIndex]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const requestUnlock = (action: PendingAction): Promise<boolean> => {
    if (isUnlocked) {
      if (action.type === "toggle-visibility") {
        setVisibleById((prev) => ({ ...prev, [action.id]: !prev[action.id] }));
      } else if (action.type === "copy-password") {
        const valueToCopy = action.value.decryptedPassword;
        copyToClipboard(valueToCopy as string);
      }
      return Promise.resolve(true);
    }
    setUnlockError(null);
    setIsUnlockOpen(true);
    setPendingAction(action);
    return new Promise<boolean>((resolve) => {
      pendingResolveRef.current = resolve;
    });
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockInput) {
      setUnlockError("Please enter the master password");
      return;
    }
    setIsUnlocking(true);
    try {
      const isMatched = await verifyMasterPassword(unlockInput);
      if (isMatched) {
        setIsUnlocked(true);
        setIsUnlockOpen(false);
        // setUnlockInput("");
        setUnlockError(null);
        if (pendingAction) {
          if (pendingAction.type === "toggle-visibility") {
            setVisibleById((prev) => ({
              ...prev,
              [pendingAction.id]: !prev[pendingAction.id],
            }));
          } else if (pendingAction.type === "copy-password") {
            const valueToCopy = pendingAction.value.decryptedPassword;
            copyToClipboard(valueToCopy as string);
          }
          pendingResolveRef.current?.(true);
          pendingResolveRef.current = null;
          setPendingAction(null);
        }
      } else {
        setUnlockError("Incorrect master password");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleUnlockCancel = () => {
    setIsUnlockOpen(false);
    if (!isUnlocked) setUnlockInput("");
    setUnlockError(null);
    pendingResolveRef.current?.(false);
    pendingResolveRef.current = null;
    setPendingAction(null);
  };

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const passwordSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    username: z.string().min(2, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    url: z
      .string()
      .trim()
      .min(1, "URL is required")
      .refine((v) => isValidUrl(v), { message: "Must be a valid URL" }),
    category: z.enum([
      "social",
      "work",
      "finance",
      "shopping",
      "other",
    ] as const),
  });

  type PasswordFormInput = z.input<typeof passwordSchema>;
  type PasswordFormOutput = z.output<typeof passwordSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInput, unknown, PasswordFormOutput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      url: "",
      category: undefined as unknown as PasswordFormInput["category"],
    },
  });

  // Modified openAddModal to check master password
  const openAddModal = () => {
    if (!hasMasterPassword) {
      toast.error(
        "You must set up your master password before adding any password."
      );
      return;
    }
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    setEditingPassword(null);
    reset({
      title: "",
      username: "",
      password: "",
      url: "",
      category: undefined as unknown as PasswordFormInput["category"],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pwd: Password) => {
    setEditingPassword(pwd);
    reset({
      title: pwd.title,
      username: pwd.username,
      password: pwd.decryptedPassword,
      url: pwd.url,
      category: pwd.category as PasswordFormInput["category"],
    });
    setIsModalOpen(true);
  };

  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<PasswordFormOutput> = async (values) => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    setIsFormSubmitting(true);
    const { encryptedData, iv, salt, hmac } = encryptDataWithCryptoJS(
      values.password,
      unlockInput
    );
    const payload = {
      userid: (user as { id: string }).id,
      username: values.username,
      title: values.title,
      url: values.url,
      category: values.category,
      encryptedData,
      encryptionParams: {
        iv,
        salt,
        hmac,
        algorithm: "AES-256-CBC",
        version: "1.0",
      },
    };
    try {
      const endpoint = editingPassword
        ? `/update-password/${editingPassword._id}`
        : "/add-password";
      const method = editingPassword ? apiClient.put : apiClient.post;

      const { data } = await method(endpoint, payload);

      if (data.success) {
        toast.success((data as { message: string }).message);
        handleGetPasswords();
        setIsModalOpen(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleGetPasswords = async () => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/view-passwords/${(user as { id: string }).id}`
      );
      const { data: encryptedPasswords } = response.data;
      const decryptedPasswords = encryptedPasswords.map((item: any) => {
        const decryptedPassword = decryptDataWithCryptoJS(
          item.encryptedData,
          item.encryptionParams.iv,
          item.encryptionParams.salt,
          item.encryptionParams.hmac,
          unlockInput
        );
        return {
          ...item,
          decryptedPassword: decryptedPassword,
        };
      });
      setPasswords(decryptedPasswords);
    } catch (error) {
      console.error((error as { message: string }).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (unlockInput && isUnlocked) handleGetPasswords();
  }, [unlockInput, isUnlocked]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordIdToDelete, setPasswordIdToDelete] = useState<string | null>(
    null
  );

  const handleDelete = async (id: string) => {
    setPasswordIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const actuallyDeletePassword = async (id: string) => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    try {
      const { data } = await apiClient.delete(`/delete-password/${id}`, {
        data: {
          userid: (user as { id: string }).id,
        },
      });

      if (data.success) {
        toast.success((data as { message: string }).message);
        handleGetPasswords();
        setIsModalOpen(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {isLoading ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
          <div>
            <div className="h-8 w-40 bg-gray-700 rounded mb-2" />
            <div className="h-5 w-72 bg-gray-700 rounded" />
          </div>
          <div className="h-10 w-36 bg-gray-700 rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Passwords</h1>
            <p className="text-gray-400">
              Manage and organize your passwords securely
            </p>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-500 text-white"
            disabled={isLoading}
          >
            <FiPlus className="h-5 w-5" />
            Add Password
          </Button>
        </div>
      )}

      {/* Show direction if master password not set */}
      {!isLoading && hasMasterPassword === false && (
        <div className="bg-yellow-900/60 border border-yellow-700 rounded-lg p-4 text-yellow-300 text-center mb-4">
          <strong>Set up your master password first!</strong>
          <div className="mt-2">
            <Button
              className="bg-teal-600 hover:bg-teal-500 text-white"
              onClick={() => router.push("/user/settings")}
              disabled={isLoading}
            >
              Go to Master Password Setup
            </Button>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      {isLoading ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="h-11 w-full sm:flex-1 bg-gray-700 rounded-lg" />
            <div className="h-11 w-full sm:w-48 bg-gray-700 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, username, or URL"
              className="w-full sm:flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Passwords Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b border-gray-700 pb-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gray-700 rounded" />
                  <div className="h-4 w-48 bg-gray-700 rounded" />
                </div>
                <div className="h-8 w-20 bg-gray-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : passwords.length === 0 ? (
          <div className="text-center py-12">
            <FiGlobe className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No passwords yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start by adding your first password to get organized
            </p>
            <Button
              onClick={openAddModal}
              className="bg-teal-600 hover:bg-teal-500 text-white mx-auto"
              disabled={isLoading}
            >
              <FiPlus className="h-5 w-5" />
              Add Your First Password
            </Button>
          </div>
        ) : (
          <PasswordsTable
            data={paginatedPasswords}
            onCopyUsername={(text: string) => {
              copyToClipboard(text);
              return true;
            }}
            onCopyPassword={(data: any) =>
              requestUnlock({ type: "copy-password", value: data })
            }
            onEdit={openEditModal}
            onDelete={handleDelete}
            visibleById={visibleById}
            onToggleVisibility={(id: string) =>
              requestUnlock({ type: "toggle-visibility", id })
            }
          />
        )}
      </div>

      {/* Bottom controls - outside the table */}
      {passwords.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-0 mb-0 md:mb-16 lg:mb-0">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <label htmlFor="rows-per-page" className="text-gray-400">
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-400">
            Showing {totalItems === 0 ? 0 : pageStartIndex + 1}–{pageEndIndex}{" "}
            of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded bg-gray-800 border border-gray-700 text-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1.5 rounded border ${
                  p === currentPage
                    ? "bg-gray-800 border-teal-600 text-teal-500"
                    : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="px-3 py-1.5 rounded bg-gray-800 border border-gray-700 text-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-11/12 max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {editingPassword ? "Edit Password" : "Add Password"}
            </DialogTitle>
            <DialogClose asChild>
              <button
                className="text-gray-400 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </DialogClose>
          </DialogHeader>
          <form className="pt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">
                  Title
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. GitHub"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">URL</label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="https://example.com"
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">
                  Category
                </label>
                <select
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  {...register("category")}
                >
                  <option value="">Select a category</option>
                  <option value="social">Social</option>
                  <option value="work">Work</option>
                  <option value="finance">Finance</option>
                  <option value="shopping">Shopping</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.category.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Username / Email
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="you@example.com"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <div className="flex justify-end items-center gap-4">
                {!isFormSubmitting && (
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                )}
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                  disabled={isSubmitting}
                >
                  {editingPassword
                    ? isFormSubmitting
                      ? "Saving..."
                      : "Save Changes"
                    : isFormSubmitting
                    ? "Adding..."
                    : "Add"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Master Password Unlock Modal */}
      <Dialog
        open={isUnlockOpen}
        onOpenChange={(open) =>
          open ? setIsUnlockOpen(true) : handleUnlockCancel()
        }
      >
        <DialogContent className="w-11/12 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiLock className="h-5 w-5" />
              Enter Master Password
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div className="px-6 py-2">
              <label className="block text-sm text-gray-300 mb-1">
                Master Password
              </label>
              <input
                type="password"
                className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter master password"
                value={unlockInput}
                onChange={(e) => setUnlockInput(e.target.value)}
                autoFocus
              />
              {unlockError && (
                <p className="text-red-400 text-sm mt-1">{unlockError}</p>
              )}
            </div>
            <div className="border-t border-gray-600 flex justify-end items-center gap-4 px-6 py-4">
              <Button
                type="button"
                variant="secondary"
                disabled={isUnlocking}
                onClick={handleUnlockCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUnlocking}
                className="bg-teal-600 hover:bg-teal-500 text-white"
              >
                {isUnlocking ? "Unlocking..." : "Unlock"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="w-11/12 max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-2 text-gray-300">
            Do you really want to delete this password? This action cannot be
            undone.
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-500 text-white"
              onClick={async () => {
                if (passwordIdToDelete) {
                  setDeleteConfirmOpen(false);
                  await actuallyDeletePassword(passwordIdToDelete);
                  setPasswordIdToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
