"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoMenu, IoShieldOutline } from "react-icons/io5";
import {
  FiAlertTriangle,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiLock,
  FiSmartphone,
  FiTwitter,
  FiUsers,
} from "react-icons/fi";
import { LuFolderSync } from "react-icons/lu";
import { FaCheck, FaStar } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function PasswordManagerLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
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
              <a
                href="#login"
                className="hover:text-teal-400 transition-colors"
              >
                Login
              </a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-teal-500 hover:bg-teal-600 text-white relative overflow-hidden group">
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
                    <FaXTwitter className="h-6 w-6" />
                  ) : (
                    <IoMenu className="h-6 w-6" />
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
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                Sign Up
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
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
              className="text-xl text-gray-300 mb-8 max-w-2xl"
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg bg-transparent"
                >
                  Learn More
                </Button>
              </motion.div>
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
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-teal-500 rounded-full flex items-center justify-center"
                  >
                    <IoShieldOutline className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    256-bit Encryption
                  </h3>
                  <p className="text-gray-400">
                    Your data is protected with the same encryption used by
                    banks and governments.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to keep your digital life secure and organized
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: IoShieldOutline,
                title: "Military-Grade Encryption",
                description:
                  "AES-256 encryption ensures your passwords are protected with the highest security standards.",
              },
              {
                icon: FiSmartphone,
                title: "One-Click Autofill",
                description:
                  "Seamlessly fill passwords across all your devices and browsers with a single click.",
              },
              {
                icon: LuFolderSync,
                title: "Cross-Device Sync",
                description:
                  "Access your passwords anywhere, anytime. Sync across all your devices instantly.",
              },
              {
                icon: FiAlertTriangle,
                title: "Breach Alerts",
                description:
                  "Get notified immediately if any of your accounts are compromised in a data breach.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 h-full hover:border-teal-500/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center group-hover:bg-teal-500/30 transition-colors"
                    >
                      <feature.icon className="h-8 w-8 text-teal-400" />
                    </motion.div>
                    <CardTitle className="text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up with your email and create a master password. This is the only password you'll need to remember.",
              },
              {
                step: "02",
                title: "Add & Store Passwords",
                description:
                  "Import existing passwords or add new ones. Our browser extension makes it effortless to save credentials.",
              },
              {
                step: "03",
                title: "Access Anytime, Anywhere",
                description:
                  "Your encrypted vault syncs across all devices. Access your passwords securely from anywhere.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  >
                    {item.step}
                  </motion.div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-teal-500 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section
        id="security"
        className="py-20 bg-gray-800/50 relative overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        >
          <FiLock className="w-full h-full text-teal-500" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Security & Trust
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your security is our top priority. We use industry-leading
              encryption and security practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  "Zero-knowledge architecture - we can't see your data",
                  "End-to-end encryption with AES-256",
                  "Regular security audits by third-party experts",
                  "SOC 2 Type II certified infrastructure",
                  "Multi-factor authentication support",
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Trusted by Thousands
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="h-5 w-5" />
                    ))}
                  </div>
                  <span className="text-gray-300">
                    "Best password manager I've ever used!"
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <FiUsers className="h-6 w-6 text-teal-400" />
                  <span className="text-gray-300">50,000+ active users</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FiGlobe className="h-6 w-6 text-teal-400" />
                  <span className="text-gray-300">
                    Available in 25+ countries
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that's right for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "Store up to 50 passwords",
                  "Basic autofill",
                  "Mobile app access",
                  "Email support",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Premium",
                price: "$3",
                period: "per month",
                features: [
                  "Unlimited password storage",
                  "Advanced autofill",
                  "Cross-device sync",
                  "Priority support",
                  "Breach monitoring",
                  "Secure file storage",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card
                  className={`bg-gray-800 border-gray-700 h-full ${
                    plan.popular
                      ? "border-teal-500 shadow-lg shadow-teal-500/20"
                      : ""
                  }`}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <FaCheck className="h-5 w-5 text-teal-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="pt-6"
                    >
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-teal-500 hover:bg-teal-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to take control of your digital security?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SecureVault to keep their
              passwords safe and secure.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold relative overflow-hidden group"
              >
                <motion.span
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255, 255, 255, 0.7)",
                      "0 0 0 10px rgba(255, 255, 255, 0)",
                      "0 0 0 0 rgba(255, 255, 255, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="relative z-10"
                >
                  Start Free Trial
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <FiLock className="h-8 w-8 text-teal-400" />
                <span className="text-xl font-bold">SecureVault</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The most trusted password manager for individuals and teams.
                Keep your digital life secure with military-grade encryption.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {[
                  { icon: FiTwitter, href: "#" },
                  { icon: FiGithub, href: "#" },
                  { icon: FiLinkedin, href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    <social.icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} SecureVault. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
