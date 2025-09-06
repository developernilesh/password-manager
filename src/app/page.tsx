"use client";

import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { LandingPage } from "@/components/pages/LandingPage";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Using a small timeout to ensure router is ready
      const timer = setTimeout(() => {
        router.push("/user/dashboard");
      }, 100);
      // clearing the timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (isSignedIn) {
    return <LoadingSpinner message="Redirecting to dashboard..." />;
  }

  return <LandingPage />;
}
