"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCopy,
  FiEdit,
  FiGlobe,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheck,
} from "react-icons/fi";

interface encryptionParams {
  iv: string;
  salt: string;
  hmac: string;
  algorithm: string;
  version: string;
}

export interface PasswordRow {
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

interface PasswordsTableProps {
  data: PasswordRow[];
  onCopyUsername: (text: string) => Promise<boolean> | boolean;
  onCopyPassword: (data: PasswordRow) => Promise<boolean> | boolean;
  onEdit: (row: PasswordRow) => void;
  onDelete: (id: string) => void;
  visibleById: Record<string, boolean>;
  onToggleVisibility: (id: string) => Promise<boolean> | boolean;
}

export function PasswordsTable({
  data,
  onCopyUsername,
  onCopyPassword,
  onEdit,
  onDelete,
  visibleById,
  onToggleVisibility,
}: PasswordsTableProps) {
  const [copiedByKey, setCopiedByKey] = useState<Record<string, boolean>>({});
  const copyTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const markCopied = (key: string) => {
    if (copyTimeoutsRef.current[key]) {
      clearTimeout(copyTimeoutsRef.current[key]);
    }
    setCopiedByKey((prev) => ({ ...prev, [key]: true }));
    copyTimeoutsRef.current[key] = setTimeout(() => {
      setCopiedByKey((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      delete copyTimeoutsRef.current[key];
    }, 1500);
  };

  const formatUrlForHref = (url: string): string => {
    if (!url) return "#";
    try {
      // Valid absolute URL
      // eslint-disable-next-line no-new
      new URL(url);
      return url;
    } catch {
      try {
        const withProtocol = `https://${url}`;
        // eslint-disable-next-line no-new
        new URL(withProtocol);
        return withProtocol;
      } catch {
        return "#";
      }
    }
  };

  const handleCopy = async (
    field: "username" | "password",
    row: PasswordRow
  ) => {
    const key = `${row._id}-${field}`;
    const ok = await Promise.resolve(
      field === "username" ? onCopyUsername(row.username) : onCopyPassword(row)
    );
    if (ok) {
      markCopied(key);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(copyTimeoutsRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const getCategoryBadgeClasses = (category: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
    switch (category) {
      case "social":
        return `${base} bg-blue-500/10 text-blue-400 border-blue-500/30`;
      case "work":
        return `${base} bg-purple-500/10 text-purple-400 border-purple-500/30`;
      case "finance":
        return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/30`;
      case "shopping":
        return `${base} bg-amber-500/10 text-amber-400 border-amber-500/30`;
      default:
        return `${base} bg-slate-500/10 text-slate-300 border-slate-500/30`;
    }
  };
  const NUM_COLUMNS = 5; // Title, Username, Password, Category, Actions

  return (
    <div className="overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-gray-700/50">
          <tr className="border-b transition-colors hover:bg-gray-700/30">
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300">
              Title
            </th>
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300 sm:hidden">
              Credentials
            </th>
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300 hidden sm:table-cell">
              Username
            </th>
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300 hidden sm:table-cell">
              Password
            </th>
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300 hidden xl:table-cell">
              Category
            </th>
            <th className="h-12 px-3 sm:px-4 md:px-6 text-left align-middle text-sm font-medium text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-700">
          {data && data.length > 0 ? (
            data.map((row, index) => {
              const isVisible = !!visibleById[row._id];
              return (
                <tr
                  key={row._id}
                  className="border-b transition-colors hover:bg-gray-700/30"
                >
                  <td className="p-3 sm:p-4 md:p-6 align-middle">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                        <FiGlobe className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-[180px] sm:max-w-[260px] md:max-w-none">
                          {row.title}
                        </div>
                        {row?.url && (
                          <a
                            href={formatUrlForHref(row.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-400 hover:underline truncate max-w-[180px] sm:max-w-[260px] md:max-w-none hidden md:block"
                            title={row.url}
                          >
                            {row.url}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Mobile-only combined credentials column */}
                  <td className="p-3 sm:p-4 md:p-6 align-middle sm:hidden">
                    <div className="flex flex-col gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white truncate max-w-[180px]">
                          {row.username}
                        </span>
                        <button
                          onClick={() => handleCopy("username", row)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                          aria-label={
                            copiedByKey[`${row._id}-username`]
                              ? "Copied"
                              : "Copy username"
                          }
                          title={
                            copiedByKey[`${row._id}-username`]
                              ? "Copied"
                              : "Copy username"
                          }
                        >
                          {copiedByKey[`${row._id}-username`] ? (
                            <FiCheck className="h-4 w-4 text-green-400" />
                          ) : (
                            <FiCopy className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white truncate max-w-[180px]">
                          {isVisible ? row.decryptedPassword : "••••••••"}
                        </span>
                        <button
                          onClick={() => onToggleVisibility(row._id)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                          aria-label={
                            isVisible ? "Hide password" : "Show password"
                          }
                        >
                          {isVisible ? (
                            <FiEyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FiEye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy("password", row)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                          aria-label={
                            copiedByKey[`${row._id}-password`]
                              ? "Copied"
                              : "Copy password"
                          }
                          title={
                            copiedByKey[`${row._id}-password`]
                              ? "Copied"
                              : "Copy password"
                          }
                        >
                          {copiedByKey[`${row._id}-password`] ? (
                            <FiCheck className="h-4 w-4 text-green-400" />
                          ) : (
                            <FiCopy className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 md:p-6 align-middle hidden sm:table-cell">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white truncate max-w-[140px] sm:max-w-none">
                        {row.username}
                      </span>
                      <button
                        onClick={() => handleCopy("username", row)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        aria-label={
                          copiedByKey[`${row._id}-username`]
                            ? "Copied"
                            : "Copy username"
                        }
                        title={
                          copiedByKey[`${row._id}-username`]
                            ? "Copied"
                            : "Copy username"
                        }
                      >
                        {copiedByKey[`${row._id}-username`] ? (
                          <FiCheck className="h-4 w-4 text-green-400" />
                        ) : (
                          <FiCopy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 md:p-6 align-middle hidden sm:table-cell">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white truncate max-w-[140px] sm:max-w-none">
                        {isVisible ? row.decryptedPassword : "••••••••"}
                      </span>
                      <button
                        onClick={() => onToggleVisibility(row._id)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isVisible ? (
                          <FiEyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiEye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy("password", row)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        aria-label={
                          copiedByKey[`${row._id}-password`]
                            ? "Copied"
                            : "Copy password"
                        }
                        title={
                          copiedByKey[`${row._id}-password`]
                            ? "Copied"
                            : "Copy password"
                        }
                      >
                        {copiedByKey[`${row._id}-password`] ? (
                          <FiCheck className="h-4 w-4 text-green-400" />
                        ) : (
                          <FiCopy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 md:p-6 align-middle hidden xl:table-cell">
                    <span className={getCategoryBadgeClasses(row.category)}>
                      {row.category.charAt(0).toUpperCase() +
                        row.category.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 md:p-6 align-middle">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-600 rounded transition-colors"
                        onClick={() => onEdit(row)}
                        aria-label="Edit password"
                      >
                        <FiEdit className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-600 rounded transition-colors"
                        onClick={() => onDelete(row._id)}
                        aria-label="Delete password"
                      >
                        <FiTrash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={NUM_COLUMNS}
                className="h-24 text-center p-3 sm:p-4 md:p-6 align-middle"
              >
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
