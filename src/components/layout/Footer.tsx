"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiLock, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { icon: FiTwitter, href: "#" },
  { icon: FiGithub, href: "#" },
  { icon: FiLinkedin, href: "#" },
];

const quickLinks = [
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FiLock className="h-8 w-8 text-teal-400" />
              <span className="text-xl font-bold">SecureVault</span>
            </div>
            <p className="text-gray-400 max-w-md">
              The most trusted password manager for individuals and teams. Keep
              your digital life secure with military-grade encryption.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
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
            &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
