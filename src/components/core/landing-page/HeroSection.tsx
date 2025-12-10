"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiShield } from "react-icons/fi";
import Link from "next/link";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16"
    >
      <motion.div style={{ y }} className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your Passwords.{" "}
            <span className="text-teal-400">Safe. Secure. Always.</span>
          </motion.h1>

          <motion.p
            className="text-xl text-center lg:text-start text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            The ultimate encrypted password vault for peace of mind. Never
            forget a password again with military-grade security.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 text-lg relative overflow-hidden group cursor-pointer"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="border border-gray-600 hover:border-teal-400 text-white hover:text-teal-400 px-8 py-3 text-lg bg-transparent hover:bg-transparent relative cursor-pointer"
              >
                Learn More
              </Button>
            </motion.div> */}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="relative w-full max-w-md mx-auto">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(20, 184, 166, 0.3)",
                      "0 0 40px rgba(20, 184, 166, 0.5)",
                      "0 0 20px rgba(20, 184, 166, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-24 h-24 mx-auto mb-6 bg-teal-500 rounded-full flex items-center justify-center"
                >
                  <FiShield className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">
                  256-bit Encryption
                </h3>
                <p className="text-gray-400">
                  Your data is protected with the same encryption used by banks
                  and governments.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
