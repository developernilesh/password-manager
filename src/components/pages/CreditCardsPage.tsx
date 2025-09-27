"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { FiPlus, FiSearch, FiCreditCard, FiLock } from "react-icons/fi";
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
import { CreditCardsGrid } from "@/components/core/credit-cards-page/CreditCardsGrid";
import { verifyMasterPassword, getMasterPasswordHash } from "@/actions/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  decryptDataWithCryptoJS,
  encryptDataWithCryptoJS,
} from "@/lib/encryption-client";
import { useUser } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";
import { getErrorMessage } from "../common/handle-error";

interface EncryptionParams {
  iv: string;
  salt: string;
  algorithm: string;
  hmac: string;
  version: string;
}

interface BaseCreditCard {
  _id: string;
  cardName: string;
  encryptedCardNumber: string;
  cardNoEncryptionParams: EncryptionParams;
  cardholderName: string;
  expiry: string;
  encryptedCvv: string;
  cvvEncryptionParams: EncryptionParams;
  bank: string;
  category: string;
  createdAt: string;
}

interface EncryptedCreditCard extends BaseCreditCard {}

interface CreditCard extends BaseCreditCard {
  decryptedCardNumber: string;
  decryptedCvv: string;
}

export function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [visibleById, setVisibleById] = useState<
    Record<string, { number: boolean; cvv: boolean }>
  >({});

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasMasterPassword, setHasMasterPassword] = useState<boolean | null>(
    null
  );
  const router = useRouter();
  const { user } = useUser();

  type SensitiveField = "number" | "cvv";
  type PendingAction =
    | { type: "toggle-visibility"; id: string; field: SensitiveField }
    | { type: "copy-sensitive"; value: string };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null
  );
  const pendingResolveRef = useRef<((ok: boolean) => void) | null>(null);

  const categories = [
    "all",
    "personal",
    "business",
    "travel",
    "shopping",
    "other",
  ];

  useEffect(() => {
    // Check if master password is set
    async function checkMasterPassword() {
      setIsLoading(true);
      try {
        const hash = await getMasterPasswordHash();
        setHasMasterPassword(!!hash);
        if (!!hash) handleGetCreditCardsInfo();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    checkMasterPassword();
  }, []);

  useEffect(() => {
    if (unlockInput && isUnlocked) handleGetCreditCardsInfo();
  }, [unlockInput, isUnlocked]);

  const filteredCards = useMemo(() => {
    return creditCards.filter((card) => {
      const matchesCategory =
        selectedCategory === "all" || card.category === selectedCategory;
      return matchesCategory;
    });
  }, [creditCards, selectedCategory]);

  const searchedCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredCards;
    return filteredCards.filter((c) => {
      return (
        c.cardName.toLowerCase().includes(q) ||
        c.bank.toLowerCase().includes(q) ||
        c.cardholderName.toLowerCase().includes(q) ||
        c.decryptedCardNumber
          .replaceAll(" ", "")
          .includes(q.replaceAll(" ", "")) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [filteredCards, searchQuery]);

  const totalItems = searchedCards.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageStartIndex = (currentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, totalItems);
  const paginatedCards = useMemo(
    () => searchedCards.slice(pageStartIndex, pageEndIndex),
    [searchedCards, pageStartIndex, pageEndIndex]
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
        setVisibleById((prev) => {
          const current = prev[action.id] ?? { number: false, cvv: false };
          return {
            ...prev,
            [action.id]: { ...current, [action.field]: !current[action.field] },
          };
        });
      } else if (action.type === "copy-sensitive") {
        copyToClipboard(action.value);
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
            setVisibleById((prev) => {
              const current = prev[pendingAction.id] ?? {
                number: false,
                cvv: false,
              };
              return {
                ...prev,
                [pendingAction.id]: {
                  ...current,
                  [pendingAction.field]: !current[pendingAction.field],
                },
              };
            });
          } else if (pendingAction.type === "copy-sensitive") {
            copyToClipboard(pendingAction.value);
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

  // Handlers to interop with child grid component
  const handleToggleVisibility = (id: string, field: SensitiveField) =>
    requestUnlock({ type: "toggle-visibility", id, field });

  const handleCopyCardholder = (text: string) => {
    copyToClipboard(text);
    return true;
  };

  const handleCopySensitive = (text: string) =>
    requestUnlock({ type: "copy-sensitive", value: text });

  const luhnCheck = (digitsOnlyNumber: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = digitsOnlyNumber.length - 1; i >= 0; i -= 1) {
      let digit = digitsOnlyNumber.charCodeAt(i) - 48; // faster than parseInt
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const cardSchema = z.object({
    cardName: z.string().min(2, "Card name must be at least 2 characters"),
    bank: z.string().min(2, "Bank is required"),
    cardholderName: z.string().min(2, "Cardholder name is required"),
    cardNumber: z
      .string()
      .trim()
      .transform((v) => v.replace(/\D/g, ""))
      .refine((v) => v.length >= 13 && v.length <= 19, {
        message: "Card number must be 13–19 digits",
      })
      .refine((v) => luhnCheck(v), { message: "Card number is invalid" }),
    expiry: z
      .string()
      .trim()
      .regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, "Use MM/YY format")
      .superRefine((v, ctx) => {
        const [mm, yy] = v.split("/");
        const month = Number(mm);
        const year = 2000 + Number(yy);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // 1-12
        if (
          year < currentYear ||
          (year === currentYear && month < currentMonth)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Card has expired",
          });
        }
        if (year > currentYear + 15) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Expiry too far in the future",
          });
        }
      }),
    cvv: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
    category: z.enum([
      "personal",
      "business",
      "travel",
      "shopping",
      "other",
    ] as const),
  });

  type CardFormInput = z.input<typeof cardSchema>;
  type CardFormOutput = z.output<typeof cardSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CardFormInput, unknown, CardFormOutput>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      cardName: "",
      bank: "",
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      category: undefined as unknown as CardFormInput["category"],
    },
  });

  const formatCardNumberForDisplay = (digitsOnly: string): string => {
    const digits = digitsOnly.replace(/\D/g, "").slice(0, 19);
    const parts: string[] = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 19);
    const formatted = formatCardNumberForDisplay(digits);
    setValue("cardNumber", formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formatExpiryForDisplay = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 0) return "";

    // First digit logic with zero-padding when > 1
    if (digits.length === 1) {
      const d0 = digits.charAt(0);
      if (d0 === "0" || d0 === "1") {
        return d0; // wait for next digit
      }
      return `0${d0}/`;
    }

    // Two or more digits → build MM
    let month = digits.substring(0, 2);
    const m1 = month.charAt(0);
    const m2 = month.charAt(1);
    if (m1 === "0" && m2 === "0") month = "01"; // 00 → 01
    else if (m1 === "1" && m2 > "2") month = "12"; // 13-19 → 12
    else if (m1 === "0" && m2 >= "1" && m2 <= "9") month = `0${m2}`; // 01-09 ok
    // if m1 is 0 or 1 with valid m2, keep as is

    const year = digits.substring(2, 4); // up to 2 digits
    return `${month}/${year}`.slice(0, 5);
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryForDisplay(e.target.value);
    setValue("expiry", formatted, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setValue("cvv", digits, { shouldValidate: true, shouldDirty: true });
  };

  const openAddModal = () => {
    if (!hasMasterPassword) {
      toast.error(
        "You must set up your master password before adding any credit card."
      );
      return;
    }
    setEditingCard(null);
    reset({
      cardName: "",
      bank: "",
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      category: undefined as unknown as CardFormInput["category"],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (card: CreditCard) => {
    setEditingCard(card);
    reset({
      cardName: card.cardName,
      bank: card.bank,
      cardholderName: card.cardholderName,
      cardNumber: formatCardNumberForDisplay(card.decryptedCardNumber),
      expiry: card.expiry,
      cvv: card.decryptedCvv,
      category: card.category as CardFormInput["category"],
    });
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<CardFormOutput> = async (values) => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    setIsFormSubmitting(true);
    const normalizedNumber = values.cardNumber; // already digits-only from schema transform
    const {
      encryptedData: encryptedCardNumber,
      iv: cardNoIv,
      salt: cardNoSalt,
      hmac: cardNoHmac,
    } = encryptDataWithCryptoJS(normalizedNumber, unlockInput);

    const {
      encryptedData: encryptedCvv,
      iv: cvvIv,
      salt: cvvSalt,
      hmac: cvvHmac,
    } = encryptDataWithCryptoJS(values.cvv, unlockInput);

    const payload = {
      userid: (user as { id: string }).id,
      cardName: values.cardName,
      bank: values.bank,
      cardholderName: values.cardholderName,
      expiry: values.expiry,
      category: values.category,
      encryptedCardNumber,
      cardNoEncryptionParams: {
        iv: cardNoIv,
        salt: cardNoSalt,
        hmac: cardNoHmac,
        algorithm: "AES-256-CBC",
        version: "1.0",
      },
      encryptedCvv,
      cvvEncryptionParams: {
        iv: cvvIv,
        salt: cvvSalt,
        hmac: cvvHmac,
        algorithm: "AES-256-CBC",
        version: "1.0",
      },
    };
    try {
      const endpoint = editingCard
        ? `/update-credit-card/${editingCard._id}`
        : "/add-credit-card";
      const method = editingCard ? apiClient.put : apiClient.post;

      const { data } = await method(endpoint, payload);

      if (data.success) {
        toast.success((data as { message: string }).message);
        handleGetCreditCardsInfo();
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleGetCreditCardsInfo = async () => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/view-credit-cards/${(user as { id: string }).id}`
      );
      const { data: encryptedCreditCardsData } = response.data;
      const decryptedCreditCardsData = encryptedCreditCardsData.map(
        (item: EncryptedCreditCard) => {
          const decryptedCardNumber = decryptDataWithCryptoJS(
            item.encryptedCardNumber,
            item.cardNoEncryptionParams.iv,
            item.cardNoEncryptionParams.salt,
            item.cardNoEncryptionParams.hmac,
            unlockInput
          );
          const decryptedCvv = decryptDataWithCryptoJS(
            item.encryptedCvv,
            item.cvvEncryptionParams.iv,
            item.cvvEncryptionParams.salt,
            item.cvvEncryptionParams.hmac,
            unlockInput
          );
          return {
            ...item,
            expd: decryptedCardNumber,
            decryptedCardNumber: decryptedCardNumber,
            decryptedCvv: decryptedCvv,
          };
        }
      );
      setCreditCards(decryptedCreditCardsData);
    } catch (error) {
      console.error((error as { message: string }).message);
    } finally {
      setIsLoading(false);
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passwordIdToDelete, setPasswordIdToDelete] = useState<string | null>(
    null
  );

  const handleDelete = (id: string) => {
    setPasswordIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const actuallyDeletePassword = async (id: string) => {
    if (!unlockInput) {
      setIsUnlockOpen(true);
      return;
    }
    try {
      const { data } = await apiClient.delete(`/delete-credit-card/${id}`, {
        data: {
          userid: (user as { id: string }).id,
        },
      });

      if (data.success) {
        toast.success((data as { message: string }).message);
        handleGetCreditCardsInfo();
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
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
            <h1 className="text-3xl font-bold mb-2">Credit Cards</h1>
            <p className="text-gray-400">
              Securely store and manage your credit card information
            </p>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-teal-600 hover:bg-teal-500 text-white"
          >
            <FiPlus className="h-5 w-5" />
            Add Card
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
            >
              Go to Master Password Setup
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {isLoading ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="h-11 w-full sm:flex-1 bg-gray-700 rounded-lg" />
            <div className="h-11 w-full sm:w-48 bg-gray-700 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by card, bank, holder, or number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Credit Cards Grid */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        {isLoading ? (
          <CreditCardsGridSkeleton count={3} />
        ) : creditCards.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No credit cards yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start by adding your first credit card to get organized
            </p>
            <Button
              onClick={openAddModal}
              className="bg-teal-600 hover:bg-teal-500 text-white mx-auto"
            >
              <FiPlus className="h-5 w-5" />
              Add Your First Card
            </Button>
          </div>
        ) : (
          <CreditCardsGrid
            cards={paginatedCards}
            visibleById={visibleById}
            onToggleVisibility={handleToggleVisibility}
            onCopyCardholder={handleCopyCardholder}
            onCopyNumber={handleCopySensitive}
            onCopyCvv={handleCopySensitive}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Bottom controls */}
      {creditCards.length > 0 && (
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
              {[6, 12, 24, 48].map((size) => (
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

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-11/12 max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingCard ? "Edit Card" : "Add Card"}</DialogTitle>
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
                  Card Name
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Visa Platinum"
                  {...register("cardName")}
                />
                {errors.cardName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.cardName.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-300 mb-1">Bank</label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Chase"
                  {...register("bank")}
                />
                {errors.bank && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.bank.message}
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
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="travel">Travel</option>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  {...register("cardNumber", {
                    onChange: handleCardNumberChange,
                  })}
                />
                {errors.cardNumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="MM/YY"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  maxLength={5}
                  {...register("expiry", { onChange: handleExpiryChange })}
                />
                {errors.expiry && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.expiry.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">CVV</label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="123"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  {...register("cvv", { onChange: handleCvvChange })}
                />
                {errors.cvv && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.cvv.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  className="w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Full name on card"
                  {...register("cardholderName")}
                />
                {errors.cardholderName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.cardholderName.message}
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
                  {editingCard
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

// Skeleton for credit card grid
function CreditCardsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-700/60 rounded-xl border border-gray-600 p-6 flex flex-col gap-4"
        >
          <div className="h-6 bg-gray-600/60 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-600/50 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-600/40 rounded w-1/3 mb-2" />
          <div className="h-8 bg-gray-600/30 rounded w-full mb-2" />
          <div className="flex gap-2 mt-4">
            <div className="h-8 w-20 bg-gray-600/40 rounded" />
            <div className="h-8 w-20 bg-gray-600/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
