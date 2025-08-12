"use client";

import { HeroSection } from "@/components/core/landing-page/HeroSection";
import { FeaturesSection } from "@/components/core/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/components/core/landing-page/HowItWorksSection";
import { SecuritySection } from "@/components/core/landing-page/SecuritySection";
import { PricingSection } from "@/components/core/landing-page/PricingSection";
import { CTASection } from "@/components/core/landing-page/CTASection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SecuritySection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
} 