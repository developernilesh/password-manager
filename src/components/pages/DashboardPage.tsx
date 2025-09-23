"use client";

import { motion } from "framer-motion";
import {
  FiShield,
  FiKey,
  FiSettings,
  FiPlus,
  FiBarChart,
} from "react-icons/fi";
import { MasterPasswordSection } from "@/components/core/dashboard/MasterPasswordSection";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    const getPasswordsData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/view-passwords/${(user as { id: string }).id}`
        );
        const { data } = response.data;
        console.log(data);
        setPasswords(data.length);
      } catch (error) {
        console.error((error as { message: string }).message);
      } finally {
        setIsLoading(false);
      }
    };
    getPasswordsData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here&apos;s an overview of your secure vault.
        </p>
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
              <p className="text-2xl font-bold">{passwords}</p>
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

      {/* Master Password Section */}
      <MasterPasswordSection />

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/user/passwords" prefetch={true}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-2 w-full"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Password</span>
            </motion.button>
          </Link>
          <Link href="/user/credit-cards" prefetch={true}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-2 w-full"
            >
              <FiShield className="h-5 w-5" />
              <span>Add Credit Card</span>
            </motion.button>
          </Link>
          <Link href="/user/password-generator" prefetch={true}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2 w-full"
            >
              <FiKey className="h-5 w-5" />
              <span>Generate Password</span>
            </motion.button>
          </Link>
          <Link href="/user/settings" prefetch={true}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors flex items-center space-x-2 w-full"
            >
              <FiSettings className="h-5 w-5" />
              <span>Settings</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-400 text-center py-8">
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">Start by adding your first password!</p>
        </div>
      </div> */}

      {/* Security Tips */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Security Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-teal-400 mb-2">
              Use Strong Passwords
            </h3>
            <p className="text-gray-300 text-sm">
              Create unique, complex passwords for each account using our
              password generator.
            </p>
          </div>
          {/* <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">Enable 2FA</h3>
            <p className="text-gray-300 text-sm">Add an extra layer of security with two-factor authentication.</p>
          </div> */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-400 mb-2">
              Regular Updates
            </h3>
            <p className="text-gray-300 text-sm">
              Keep your passwords updated and change them regularly.
            </p>
          </div>
          {/* <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-400 mb-2">Monitor Activity</h3>
            <p className="text-gray-300 text-sm">Regularly check your security score and activity logs.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
