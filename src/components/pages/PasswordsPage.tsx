"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiSearch, FiEye, FiEyeOff, FiEdit, FiTrash2, FiCopy, FiGlobe } from "react-icons/fi";

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  category: string;
  createdAt: string;
}

export function PasswordsPage() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "social", "work", "finance", "shopping", "other"];

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Passwords</h1>
          <p className="text-gray-400">Manage and organize your passwords securely</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
        >
          <FiPlus className="h-5 w-5" />
          <span>Add Password</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {showPasswords ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Passwords Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        {filteredPasswords.length === 0 ? (
          <div className="text-center py-12">
            <FiGlobe className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No passwords yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first password to get organized</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <FiPlus className="h-5 w-5" />
              <span>Add Your First Password</span>
            </motion.button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Password</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPasswords.map((password) => (
                  <tr key={password.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                          <FiGlobe className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{password.title}</div>
                          <div className="text-sm text-gray-400">{password.url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">{password.username}</span>
                        <button
                          onClick={() => copyToClipboard(password.username)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          <FiCopy className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white">
                          {showPasswords ? password.password : "••••••••"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(password.password)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          <FiCopy className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        {password.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-600 rounded transition-colors">
                          <FiEdit className="h-4 w-4 text-blue-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-600 rounded transition-colors">
                          <FiTrash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <FiGlobe className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Passwords</p>
              <p className="text-2xl font-bold">{passwords.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <FiGlobe className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Strong Passwords</p>
              <p className="text-2xl font-bold">{passwords.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiGlobe className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-2xl font-bold">{new Set(passwords.map(p => p.category)).size}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 