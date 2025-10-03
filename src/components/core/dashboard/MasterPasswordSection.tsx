"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getMasterPasswordHash,
  setMasterPassword,
  verifyMasterPassword,
} from "@/actions/actions";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import {
  decryptDataWithCryptoJS,
  encryptDataWithCryptoJS,
} from "@/lib/encryption-client";
import { useUser } from "@clerk/nextjs";
import { getErrorMessage } from "@/components/common/handle-error";

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
  url: string;
  category: string;
  createdAt: string;
}

interface CreditCard {
  _id: string;
  cardName: string;
  encryptedCardNumber: string;
  cardNoEncryptionParams: encryptionParams;
  cardholderName: string;
  expiry: string; // MM/YY
  encryptedCvv: string;
  cvvEncryptionParams: encryptionParams;
  bank: string;
  category: string;
  createdAt: string;
}

export function MasterPasswordSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingMasterPassword, setIsChangingMasterPassword] =
    useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(true);

  const { user } = useUser();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingMasterPassword(true);
    setMessage(null);
    try {
      if (hasMasterPassword) {
        if (!formData.currentPassword) {
          setMessage({ type: "error", text: "Current password is required" });
          return;
        }
        const isMatched = await verifyMasterPassword(formData.currentPassword);
        if (!isMatched) {
          setMessage({ type: "error", text: "Current password doesn't match" });
          return;
        }
      }
      if (formData.newPassword.length < 8) {
        setMessage({
          type: "error",
          text: "New password must be at least 8 characters long",
        });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        return;
      }
      const response = await setMasterPassword(formData.newPassword);
      if (!response) {
        setMessage({
          type: "error",
          text: "Cannot set your master password at moment. Please try again!",
        });
        return;
      }
      if (hasMasterPassword) {
        handleMasterPasswordChange(
          (user as { id: string }).id,
          formData.currentPassword,
          formData.newPassword
        );
      } else {
        toast.success("Master password set successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsEditing(false);
      }
      setHasMasterPassword(true); // Update local state
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsChangingMasterPassword(false);
    }
  };

  const handleMasterPasswordChange = async (
    userId: string,
    oldMasterPassword: string,
    newMasterPassword: string
  ): Promise<void> => {
    setIsUpdating(true);
    try {
      // 1. Get all passwords encrypted with the old master password
      const passwords = await apiClient.get(`/view-passwords/${userId}`);
      const { data: encryptedPasswords } = passwords.data;

      // 2. Verifying old master password by trying to decrypt one password
      try {
        const testPassword = encryptedPasswords[0];
        decryptDataWithCryptoJS(
          testPassword.encryptedData,
          testPassword.encryptionParams.iv,
          testPassword.encryptionParams.salt,
          testPassword.encryptionParams.hmac,
          oldMasterPassword
        );
      } catch (error) {
        throw new Error("Old master password is incorrect");
      }

      // 3. Re-encrypting all passwords with the new master password
      const updatedPasswords = await Promise.all(
        encryptedPasswords.map(async (password: Password) => {
          // Decrypt with old master password
          const decryptedPassword = decryptDataWithCryptoJS(
            password.encryptedData,
            password.encryptionParams.iv,
            password.encryptionParams.salt,
            password.encryptionParams.hmac,
            oldMasterPassword
          );

          // Encrypt with new master password
          const { encryptedData, iv, salt, hmac } = encryptDataWithCryptoJS(
            decryptedPassword,
            newMasterPassword
          );

          return {
            _id: password._id,
            encryptedData,
            encryptionParams: {
              iv,
              salt,
              hmac,
              algorithm: "AES-256-CBC",
              version: "1.0",
            },
          };
        })
      );

      const cards = await apiClient.get(`/view-credit-cards/${userId}`);
      const { data: encryptedCards } = cards.data;

      const updatedCards = await Promise.all(
        encryptedCards.map(async (card: CreditCard) => {
          const decryptedCardNumber = decryptDataWithCryptoJS(
            card.encryptedCardNumber,
            card.cardNoEncryptionParams.iv,
            card.cardNoEncryptionParams.salt,
            card.cardNoEncryptionParams.hmac,
            oldMasterPassword
          );
          const decryptedCvv = decryptDataWithCryptoJS(
            card.encryptedCvv,
            card.cvvEncryptionParams.iv,
            card.cvvEncryptionParams.salt,
            card.cvvEncryptionParams.hmac,
            oldMasterPassword
          );
          const {
            encryptedData: encryptedCardNumber,
            iv: cardNoIv,
            salt: cardNoSalt,
            hmac: cardNoHmac,
          } = encryptDataWithCryptoJS(decryptedCardNumber, newMasterPassword);

          const {
            encryptedData: encryptedCvv,
            iv: cvvIv,
            salt: cvvSalt,
            hmac: cvvHmac,
          } = encryptDataWithCryptoJS(decryptedCvv, newMasterPassword);

          return {
            _id: card._id,
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
        })
      );
      // return;
      // 4. Send updated passwords to the server
      const { data } = await apiClient.post("/change-master-password", {
        userId: (user as { id: string }).id,
        updatedPasswords,
        updatedCards,
      });

      if (data.success) {
        toast.success("Master password updated successfully!");
        setIsEditing(false);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: unknown) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage(null);
  };

  const checkMasterPassword = async () => {
    setIsLoading(true);
    try {
      const response = await getMasterPasswordHash();
      if (response) setHasMasterPassword(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMasterPassword();
  }, []);

  useEffect(() => {
    if (
      user?.emailAddresses?.[0]?.emailAddress &&
      user.emailAddresses[0].emailAddress === "tester.account@yopmail.com"
    ) {
      setShowChangePassword(false);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
    >
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-gray-700 rounded-full" />
              <div className="h-6 w-32 bg-gray-700 rounded" />
            </div>
            <div className="h-8 w-32 bg-gray-700 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-700 rounded" />
            <div className="h-3 w-2/3 bg-gray-700 rounded" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FiShield className="h-6 w-6 text-teal-400" />
              <h2 className="text-xl font-bold">Master Password</h2>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  {hasMasterPassword ? (
                    showChangePassword ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-teal-600 hover:bg-teal-500 text-white"
                      >
                        Change Password
                      </Button>
                    ) : (
                      <div className="text-amber-500 px-2 py-1 bg-amber-400/10 border border-amber-500 rounded-lg font-semibold animate-pulse">Changing Master Password has been turned off for this test account!</div>
                    )
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-teal-600 hover:bg-teal-500 text-white"
                    >
                      Set Master Password
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              {hasMasterPassword ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">
                      Master password is set and secure
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Your master password is used to encrypt and decrypt all your
                    stored passwords and credit card information. Make sure to
                    choose a strong, memorable password and keep it safe.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">
                      Master password not set
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    You need to set a master password to start storing your
                    passwords and credit cards securely. This password will be
                    used to encrypt all your sensitive data.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    message?.type === "success"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                >
                  {message?.type === "success" ? (
                    <FiCheck className="h-4 w-4" />
                  ) : (
                    <FiAlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">{message?.text}</span>
                </motion.div>
              )}

              {hasMasterPassword && (
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    Current Master Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current master password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      required
                      disabled={isChangingMasterPassword || isUpdating}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Master Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new master password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    required
                    disabled={isChangingMasterPassword || isUpdating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new master password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                    disabled={isChangingMasterPassword || isUpdating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="submit"
                  disabled={isChangingMasterPassword || isUpdating}
                  className="bg-teal-600 hover:bg-teal-500 text-white flex-1"
                >
                  {isChangingMasterPassword || isUpdating
                    ? hasMasterPassword
                      ? "Updating..."
                      : "Setting..."
                    : hasMasterPassword
                    ? "Update Password"
                    : "Set Master Password"}
                </Button>
                <Button
                  type="button"
                  disabled={isChangingMasterPassword || isUpdating}
                  onClick={handleCancel}
                  variant="secondary"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </motion.div>
  );
}
