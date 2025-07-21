"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  Download,
  Shield,
  Smartphone,
  Globe,
  ArrowRight,
  CheckCircle,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Create Your Account",
    subtitle: "Get started in seconds",
    description:
      "Sign up with your email and create a master password. This is the only password you'll need to remember.",
    features: [
      "Email verification",
      "Master password setup",
      "Account security",
    ],
    icon: UserPlus,
    color: "from-teal-500 to-cyan-500",
    mockup: "signup",
  },
  {
    step: "02",
    title: "Import & Store Passwords",
    subtitle: "Seamless password migration",
    description:
      "Import existing passwords from browsers or add new ones. Our browser extension makes it effortless to save credentials.",
    features: ["Browser import", "Manual entry", "Auto-save new passwords"],
    icon: Download,
    color: "from-blue-500 to-indigo-500",
    mockup: "vault",
  },
  {
    step: "03",
    title: "Access Anywhere, Anytime",
    subtitle: "Your passwords, everywhere",
    description:
      "Your encrypted vault syncs across all devices. Access your passwords securely from anywhere.",
    features: ["Cross-device sync", "Offline access", "Auto-fill everywhere"],
    icon: Globe,
    color: "from-purple-500 to-pink-500",
    mockup: "devices",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-20 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20 mb-6"
          >
            <Shield className="h-5 w-5 text-teal-400" />
            <span className="text-teal-400 font-medium">
              Simple & Secure Process
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Get Started in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
              3 Easy Steps
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Setting up your secure password vault takes less than 5 minutes.
            Here's how it works:
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* Content Side */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                  >
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-4 mb-6">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <item.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div>
                        <div className="text-sm text-gray-400 font-medium">
                          STEP {item.step}
                        </div>
                        <div className="text-sm text-teal-400 font-medium">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {item.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: featureIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="h-5 w-5 text-teal-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`bg-gradient-to-r ${item.color} hover:shadow-lg text-white border-0 group`}
                        size="lg"
                      >
                        <span className="flex items-center">
                          {index === 0 && "Start Free Trial"}
                          {index === 1 && "Import Passwords"}
                          {index === 2 && "Download Apps"}
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.div>
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Visual Side */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    {/* Main Mockup Container */}
                    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                      {/* Animated Border */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-sm rounded-3xl`}
                      ></div>
                      <div className="absolute inset-[1px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl"></div>

                      <div className="relative z-10">
                        {/* Step 1 Mockup - Signup */}
                        {item.mockup === "signup" && (
                          <div className="space-y-6">
                            <div className="text-center">
                              <motion.div
                                animate={{
                                  boxShadow: [
                                    "0 0 20px rgba(20, 184, 166, 0.3)",
                                    "0 0 40px rgba(20, 184, 166, 0.5)",
                                    "0 0 20px rgba(20, 184, 166, 0.3)",
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                }}
                                className="w-20 h-20 mx-auto mb-4 bg-teal-500 rounded-full flex items-center justify-center"
                              >
                                <UserPlus className="h-10 w-10 text-white" />
                              </motion.div>
                              <h4 className="text-xl font-semibold text-white mb-2">
                                Create Account
                              </h4>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-gray-700/50 p-3 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">
                                  Email
                                </div>
                                <div className="text-white">
                                  john@example.com
                                </div>
                              </div>
                              <div className="bg-gray-700/50 p-3 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">
                                  Master Password
                                </div>
                                <div className="text-white">••••••••••••</div>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-teal-500 p-3 rounded-lg text-center text-white font-medium cursor-pointer"
                              >
                                Create Secure Account
                              </motion.div>
                            </div>
                          </div>
                        )}

                        {/* Step 2 Mockup - Vault */}
                        {item.mockup === "vault" && (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{
                                  duration: 20,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                                className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center"
                              >
                                <Key className="h-10 w-10 text-white" />
                              </motion.div>
                              <h4 className="text-xl font-semibold text-white">
                                Password Vault
                              </h4>
                            </div>
                            {[
                              {
                                site: "Gmail",
                                username: "john@gmail.com",
                                strength: "Strong",
                              },
                              {
                                site: "Facebook",
                                username: "john.doe",
                                strength: "Medium",
                              },
                              {
                                site: "GitHub",
                                username: "johndoe",
                                strength: "Strong",
                              },
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between"
                              >
                                <div>
                                  <div className="text-white font-medium">
                                    {item.site}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    {item.username}
                                  </div>
                                </div>
                                <div
                                  className={`px-2 py-1 rounded text-xs ${
                                    item.strength === "Strong"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {item.strength}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Step 3 Mockup - Devices */}
                        {item.mockup === "devices" && (
                          <div className="text-center space-y-6">
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                              }}
                              className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center"
                            >
                              <Globe className="h-10 w-10 text-white" />
                            </motion.div>
                            <h4 className="text-xl font-semibold text-white mb-4">
                              Sync Across Devices
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { icon: Smartphone, label: "Mobile" },
                                { icon: Globe, label: "Web" },
                                { icon: Shield, label: "Desktop" },
                              ].map((device, i) => (
                                <motion.div
                                  key={i}
                                  animate={{
                                    y: [0, -5, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.3,
                                  }}
                                  className="bg-gray-700/50 p-4 rounded-lg"
                                >
                                  <device.icon className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                                  <div className="text-sm text-gray-300">
                                    {device.label}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <CheckCircle className="h-6 w-6 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Connection Line */}
              {/* {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute left-1/2 transform -translate-x-1/2 mt-16 w-0.5 h-16 bg-gradient-to-b from-teal-500 to-blue-500 origin-top"
                />
              )} */}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of users who have already secured their digital
              lives with SecureVault.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-3 text-lg border-0"
              >
                Start Your Free Trial
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
