"use client";

import { MasterPasswordSection } from "@/components/core/dashboard/MasterPasswordSection";
import { UserButton } from "@clerk/nextjs";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and security preferences.
        </p>
      </div>

      {/* Master Password Section */}
      <MasterPasswordSection />

      <div className="bg-gray-800/60 backdrop-blur rounded-xl p-8 border border-gray-700 flex flex-col sm:flex-row items-center gap-8 shadow-lg">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <svg
              width="22"
              height="22"
              fill="none"
              className="inline-block text-teal-400 mr-1"
            >
              <circle
                cx="11"
                cy="11"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M11 6a2 2 0 100 4 2 2 0 000-4zm0 6c-2.21 0-4 1.12-4 2.5V16h8v-1.5c0-1.38-1.79-2.5-4-2.5z"
                fill="currentColor"
              />
            </svg>
            Profile Settings
          </h2>
          <h3 className="font-semibold text-gray-200 mb-1">Manage Profile</h3>
          <p className="text-sm text-gray-400 mb-2">
            Update your profile settings and information.
          </p>
          <ul className="text-xs text-gray-400 space-y-1 mt-2 list-disc list-inside">
            <li>Change your display name and photo</li>
            <li>Update email or sign-in method</li>
            <li>Manage connected accounts</li>
          </ul>
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <UserButton />
          <span className="text-xs text-gray-500 mt-1">Click above</span>
        </div>
      </div>
    </div>
  );
}
