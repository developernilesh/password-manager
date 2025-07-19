"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiLock, FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <FiLock className="h-8 w-8 text-teal-400" />
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-sm"></div>
            </div>
            <span className="text-xl font-bold">SecureVault</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-teal-400 transition-colors">
              Home
            </a>
            <a
              href="#features"
              className="hover:text-teal-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#security"
              className="hover:text-teal-400 transition-colors"
            >
              Security
            </a>
            <a
              href="#pricing"
              className="hover:text-teal-400 transition-colors"
            >
              Pricing
            </a>
            <a href="#login" className="hover:text-teal-400 transition-colors">
              Login
            </a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white relative overflow-hidden group cursor-pointer">
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isMenuOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <RxCross2 className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto" },
            closed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            <a
              href="#home"
              className="block hover:text-teal-400 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="block hover:text-teal-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#security"
              className="block hover:text-teal-400 transition-colors"
            >
              Security
            </a>
            <a
              href="#pricing"
              className="block hover:text-teal-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#login"
              className="block hover:text-teal-400 transition-colors"
            >
              Login
            </a>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white cursor-pointer">
              Sign Up
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
