"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-purple-500/10"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/30 rounded-full blur-lg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start mb-6"
            >
              <div className="flex items-center space-x-2 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
                <FaWandMagicSparkles className="h-5 w-5 text-teal-400" />
                <span className="text-teal-400 font-medium">
                  Join 50,000+ Users
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight"
            >
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Secure
              </span>{" "}
              Your Digital Life?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Stop worrying about password security. Start your free trial today
              and experience the peace of mind that comes with military-grade
              protection.
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 mb-8 justify-center lg:justify-start"
            >
              {[
                { icon: FiCheckCircle, text: "30-day free trial" },
                { icon: FiShield, text: "No credit card required" },
                { icon: FiUsers, text: "Cancel anytime" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <item.icon className="h-5 w-5 text-teal-400" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/sign-in")}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold relative overflow-hidden group border-0"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </motion.div>

              {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-teal-400 px-8 py-4 text-lg bg-transparent transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </motion.div> */}
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Main Security Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden"
              >
                {/* Animated border */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-2xl opacity-20 blur-sm"></div>
                <div className="absolute inset-[1px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl"></div>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(20, 184, 166, 0.3)",
                        "0 0 40px rgba(20, 184, 166, 0.6)",
                        "0 0 20px rgba(20, 184, 166, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <FiLock className="h-10 w-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Bank-Level Security
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Your passwords are protected with AES-256 encryption - the
                    same standard used by banks and governments.
                  </p>

                  {/* Security Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">
                        256-bit
                      </div>
                      <div className="text-sm text-gray-400">Encryption</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        99.9%
                      </div>
                      <div className="text-sm text-gray-400">Uptime</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Security Icons */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -left-4 w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-teal-500/30"
              >
                <FiShield className="h-8 w-8 text-teal-400" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
              >
                <FiUsers className="h-8 w-8 text-blue-400" />
              </motion.div>

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/30"
              >
                <FaWandMagicSparkles className="h-6 w-6 text-purple-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Indicators */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">Trusted by leading companies worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ opacity: 1, scale: 1.1 }}
                className="w-24 h-12 bg-gray-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500 font-semibold">Logo {i}</span>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
