"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiCheck } from "react-icons/fi";

const plans = [
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
];

export function PricingSection() {
  return (
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
            Choose the plan that&apos;s right for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
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
                        <FiCheck className="h-5 w-5 text-teal-400 flex-shrink-0" />
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
  );
}
