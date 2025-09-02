"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { PageLayout } from "@/components/layout/PageLayout";
import LoadingSpinner from "@/components/layout/LoadingSpinner";

export default function UserDashboard() {
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

  // If user is signed in, showing dashboard
  return (
    <PageLayout>
      <DashboardPage />
    </PageLayout>
  );
}
