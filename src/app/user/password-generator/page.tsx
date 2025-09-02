"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PasswordGeneratorPage } from "@/components/pages/PasswordGeneratorPage";
import { PageLayout } from "@/components/layout/PageLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export default function PasswordGenerator() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Using a small timeout to ensure router is ready
      const timer = setTimeout(() => {
        router.push("/");
      }, 100);
      // clearing the timeout on unmount
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, router]);

  // loading state while Clerk is loading
  if (!isLoaded) {
    return <LoadingSpinner message="Loading..." />;
  }

  // loading while redirecting, if user is not signed in
  if (!isSignedIn) {
    return <LoadingSpinner message="Redirecting to home..." />;
  }

  // If user is signed in, showing password generator page
  return (
    <PageLayout>
      <PasswordGeneratorPage />
    </PageLayout>
  );
}
