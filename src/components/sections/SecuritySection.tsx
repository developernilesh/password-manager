"use client";

import { motion } from "framer-motion";
import { FiCheck, FiGlobe, FiLock, FiStar, FiUsers } from "react-icons/fi";

const securityPoints = [
  "Zero-knowledge architecture - we can&apos;t see your data",
  "End-to-end encryption with AES-256",
  "Regular security audits by third-party experts",
  "SOC 2 Type II certified infrastructure",
  "Multi-factor authentication support",
];

export function SecuritySection() {
  return (
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
              {securityPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="h-4 w-4 text-white" />
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
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300">
                  &quot;Best password manager I&apos;ve ever used!&quot;
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
  );
}
