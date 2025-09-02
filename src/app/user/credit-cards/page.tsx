"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCardsPage } from "@/components/pages/CreditCardsPage";
import { PageLayout } from "@/components/layout/PageLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export default function UserCreditCards() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return <LoadingSpinner message="Loading..." />;
  }

  // If user is not signed in, show loading while redirecting
  if (isSignedIn) {
    return <LoadingSpinner message="Redirecting to home..." />;
  }

  // If user is signed in, show dashboard
  return (
    <PageLayout>
      <CreditCardsPage />
    </PageLayout>
  );
}
