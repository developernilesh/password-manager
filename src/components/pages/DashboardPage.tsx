"use client";

import { motion } from "framer-motion";
import { FiLock, FiShield, FiKey, FiSettings, FiPlus, FiDownload, FiShield as FiSecurity, FiBarChart } from "react-icons/fi";

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your secure vault.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
        >
          <div className="flex items-center space-x-3">
            <FiBarChart className="h-8 w-8 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Credit Cards</p>
              <p className="text-2xl font-bold">0</p>
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
            className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Add Password</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiKey className="h-5 w-5" />
            <span>Generate Password</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiSecurity className="h-5 w-5" />
            <span>Security Check</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FiDownload className="h-5 w-5" />
            <span>Export Data</span>
          </motion.button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-400 text-center py-8">
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">Start by adding your first password!</p>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Security Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-teal-400 mb-2">Use Strong Passwords</h3>
            <p className="text-gray-300 text-sm">Create unique, complex passwords for each account using our password generator.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">Enable 2FA</h3>
            <p className="text-gray-300 text-sm">Add an extra layer of security with two-factor authentication.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-400 mb-2">Regular Updates</h3>
            <p className="text-gray-300 text-sm">Keep your passwords updated and change them regularly.</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-400 mb-2">Monitor Activity</h3>
            <p className="text-gray-300 text-sm">Regularly check your security score and activity logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 