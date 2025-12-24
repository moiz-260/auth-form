"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthLayout from "@/src/components/layout/AuthLayout";
import SignInForm from "@/src/components/auth/authContainer";

export default function LandingPage() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token in cookies
    const token = Cookies.get("token");

    if (token) {
      // User is authenticated, redirect to todolist
      router.push("/todolist");
    } else {
      // No token found, user needs to sign in
      setIsChecking(false);
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated, show sign-in form
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
