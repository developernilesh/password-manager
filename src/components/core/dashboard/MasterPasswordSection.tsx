"use client";

import { useState } from "react";
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

export function MasterPasswordSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasMasterPassword, setHasMasterPassword] = useState(false); // TODO: Get this from backend - for now showing "not set" scenario

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

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      return;
    }

    if (hasMasterPassword && !formData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to update/set master password
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const successMessage = hasMasterPassword
        ? "Master password updated successfully!"
        : "Master password set successfully!";

      setMessage({ type: "success", text: successMessage });
      setIsEditing(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setHasMasterPassword(true); // Update local state
    } catch (error) {
      const errorMessage = hasMasterPassword
        ? "Failed to update master password. Please try again."
        : "Failed to set master password. Please try again.";

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FiShield className="h-6 w-6 text-teal-400" />
          <h2 className="text-xl font-bold">Master Password</h2>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <>
              {hasMasterPassword ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                >
                  Change Password
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                >
                  Set Master Password
                </Button>
              )}
              {/* <Button
                  variant="outline"
                  onClick={() => window.location.href = '/user/settings'}
                  className="border-gray-600 bg-gray-600 hover:bg-gray-50 text-white"
                >
                  View All Settings
                </Button> */}
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
                <span className="text-gray-300">Master password not set</span>
              </div>
              <p className="text-gray-400 text-sm">
                You need to set a master password to start storing your
                passwords and credit cards securely. This password will be used
                to encrypt all your sensitive data.
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
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <FiCheck className="h-4 w-4" />
              ) : (
                <FiAlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message.text}</span>
            </motion.div>
          )}

          {hasMasterPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Master Password</Label>
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
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-500 text-white flex-1"
            >
              {isLoading
                ? hasMasterPassword
                  ? "Updating..."
                  : "Setting..."
                : hasMasterPassword
                ? "Update Password"
                : "Set Master Password"}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="secondary"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
