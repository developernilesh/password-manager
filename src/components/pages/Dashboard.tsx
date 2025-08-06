"use client";

import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { FiLock, FiShield, FiKey, FiSettings } from "react-icons/fi";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FiLock className="h-8 w-8 text-teal-400" />
                <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-sm"></div>
              </div>
              <span className="text-xl font-bold">SecureVault</span>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-8">Welcome to Your Password Manager</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <FiKey className="h-8 w-8 text-teal-400" />
                <div>
                  <p className="text-gray-400 text-sm">Total Passwords</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <FiShield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Security Score</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <FiSettings className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Last Sync</p>
                  <p className="text-2xl font-bold">Now</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-lg transition-colors"
              >
                Add New Password
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors"
              >
                Generate Password
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors"
              >
                Security Check
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors"
              >
                Export Data
              </motion.button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="text-gray-400 text-center py-8">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Start by adding your first password!</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 