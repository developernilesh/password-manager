"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiAlertTriangle, FiShield, FiSmartphone } from "react-icons/fi";
import { LuFolderSync } from "react-icons/lu";

const features = [
  {
    icon: FiShield,
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
];

export function FeaturesSection() {
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
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-gray-800 border-gray-700 h-full hover:border-teal-500/50 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-teal-500/20 rounded-full flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                    <feature.icon className="h-8 w-8 text-teal-400 group-hover:rotate-360 transition-all duration-1000" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
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
  );
}
