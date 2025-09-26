"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCopy,
  FiCreditCard,
  FiEdit,
  FiEye,
  FiEyeOff,
  FiTrash2,
} from "react-icons/fi";

interface encryptionParams {
  iv: string;
  salt: string;
  algorithm: string;
  hmac: string;
  version: string;
}

export interface CreditCardRow {
  _id: string;
  cardName: string;
  encryptedCardNumber: string;
  cardNoEncryptionParams: encryptionParams;
  decryptedCardNumber: string;
  cardholderName: string;
  expiry: string; // MM/YY
  encryptedCvv: string;
  cvvEncryptionParams: encryptionParams;
  decryptedCvv: string;
  bank: string;
  category: string;
  createdAt: string;
}

type SensitiveField = "number" | "cvv";

interface CreditCardsGridProps {
  cards: CreditCardRow[];
  visibleById: Record<string, { number: boolean; cvv: boolean }>;
  onToggleVisibility: (
    id: string,
    field: SensitiveField
  ) => Promise<boolean> | boolean;
  onEdit: (card: CreditCardRow) => void;
  onDelete: (id: string) => void;
  onCopyCardholder: (text: string) => Promise<boolean> | boolean;
  onCopyNumber: (text: string) => Promise<boolean> | boolean;
  onCopyCvv: (text: string) => Promise<boolean> | boolean;
}

export function CreditCardsGrid({
  cards,
  visibleById,
  onToggleVisibility,
  onEdit,
  onDelete,
  onCopyCardholder,
  onCopyNumber,
  onCopyCvv,
}: CreditCardsGridProps) {
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

  useEffect(() => {
    return () => {
      Object.values(copyTimeoutsRef.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, "*");
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case "personal":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "business":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "travel":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "shopping":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIconColors = (category: string) => {
    switch (category) {
      case "personal":
        return "from-purple-500 to-purple-600";
      case "business":
        return "from-blue-500 to-blue-600";
      case "travel":
        return "from-green-500 to-green-600";
      case "shopping":
        return "from-orange-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const handleCopy = async (
    key: string,
    value: string,
    which: "holder" | "number" | "cvv"
  ) => {
    const ok = await Promise.resolve(
      which === "holder"
        ? onCopyCardholder(value)
        : which === "number"
        ? onCopyNumber(value)
        : onCopyCvv(value)
    );
    if (ok) markCopied(key);
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {cards.map((card) => {
        const vis = visibleById[card._id] ?? { number: false, cvv: false };
        return (
          <div
            key={card._id}
            className="credit-card-bg rounded-lg p-6 border hover:border-gray-500 transition-colors"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${getCategoryIconColors(
                    card.category
                  )} rounded-lg flex items-center justify-center`}
                >
                  <FiCreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{card.cardName}</h3>
                  <p className="text-sm text-gray-400">{card.bank}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 hover:bg-gray-600 rounded transition-colors"
                  onClick={() => onEdit(card)}
                  aria-label="Edit card"
                >
                  <FiEdit className="h-4 w-4 text-blue-400" />
                </button>
                <button
                  className="p-2 hover:bg-gray-600 rounded transition-colors"
                  onClick={() => onDelete(card._id)}
                  aria-label="Delete card"
                >
                  <FiTrash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-teal-400">Card Number</label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">
                    {vis.number
                      ? card.decryptedCardNumber
                      : maskCardNumber(card.decryptedCardNumber)}
                  </span>
                  <button
                    onClick={() => onToggleVisibility(card._id, "number")}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                    aria-label={vis.number ? "Hide number" : "Show number"}
                  >
                    {vis.number ? (
                      <FiEyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleCopy(`${card._id}-number`, card.decryptedCardNumber, "number")
                    }
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                    aria-label={
                      copiedByKey[`${card._id}-number`]
                        ? "Copied"
                        : "Copy number"
                    }
                    title={
                      copiedByKey[`${card._id}-number`]
                        ? "Copied"
                        : "Copy number"
                    }
                  >
                    {copiedByKey[`${card._id}-number`] ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        className="text-green-400"
                      >
                        <path d="M20 6L9 17l-5-5" strokeWidth="2" />
                      </svg>
                    ) : (
                      <FiCopy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-teal-400">Cardholder</label>
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="truncate">{card.cardholderName}</p>
                    <button
                      onClick={() =>
                        handleCopy(
                          `${card._id}-holder`,
                          card.cardholderName,
                          "holder"
                        )
                      }
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      aria-label={
                        copiedByKey[`${card._id}-holder`]
                          ? "Copied"
                          : "Copy cardholder"
                      }
                      title={
                        copiedByKey[`${card._id}-holder`]
                          ? "Copied"
                          : "Copy cardholder"
                      }
                    >
                      {copiedByKey[`${card._id}-holder`] ? (
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          className="text-green-400"
                        >
                          <path d="M20 6L9 17l-5-5" strokeWidth="2" />
                        </svg>
                      ) : (
                        <FiCopy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400">Expires</label>
                  <p className="font-mono">{card.expiry}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-teal-400">CVV</label>
                <div className="flex items-center space-x-2">
                  <span className="font-mono">
                    {vis.cvv ? card.decryptedCvv : "***"}
                  </span>
                  <button
                    onClick={() => onToggleVisibility(card._id, "cvv")}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                    aria-label={vis.cvv ? "Hide CVV" : "Show CVV"}
                  >
                    {vis.cvv ? (
                      <FiEyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleCopy(`${card._id}-cvv`, card.decryptedCvv, "cvv")
                    }
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                    aria-label={
                      copiedByKey[`${card._id}-cvv`] ? "Copied" : "Copy CVV"
                    }
                    title={
                      copiedByKey[`${card._id}-cvv`] ? "Copied" : "Copy CVV"
                    }
                  >
                    {copiedByKey[`${card._id}-cvv`] ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        className="text-green-400"
                      >
                        <path d="M20 6L9 17l-5-5" strokeWidth="2" />
                      </svg>
                    ) : (
                      <FiCopy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColors(
                    card.category
                  )}`}
                >
                  {card.category.charAt(0).toUpperCase() +
                    card.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
