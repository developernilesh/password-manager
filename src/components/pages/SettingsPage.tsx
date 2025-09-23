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

      {/* Additional Settings Sections */}
      {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Security Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">
                Auto-lock after inactivity
              </h3>
              <p className="text-sm text-gray-400">
                Automatically lock the app after 5 minutes of inactivity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">
                Biometric authentication
              </h3>
              <p className="text-sm text-gray-400">
                Use fingerprint or face ID to unlock the app
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">
                Two-factor authentication
              </h3>
              <p className="text-sm text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div> */}

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
        <div className="flex items-center justify-start gap-8">
          <div>
            <h3 className="font-semibold text-gray-300">Manage Profile</h3>
            <p className="text-sm text-gray-400">
              Update your profile settings and informations
            </p>
          </div>
          <UserButton />
        </div>
      </div>
      {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Data Management</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">Export data</h3>
              <p className="text-sm text-gray-400">
                Download all your passwords and credit cards as a secure file
              </p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">Import data</h3>
              <p className="text-sm text-gray-400">
                Import passwords from other password managers
              </p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Import
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-400">Delete account</h3>
              <p className="text-sm text-gray-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
