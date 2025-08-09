"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";
import { Navbar } from "./Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar - visible on all screen sizes */}
      <Navbar />

      {/* Desktop layout */}
      <div className="flex h-screen pt-16">
        {/* Sidebar - only visible on md+ screens */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Bottom bar - only visible on mobile */}
      <BottomBar />
    </div>
  );
} 