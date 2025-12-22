"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AuthLayout from "@/components/layout/AuthLayout";
import SignUpForm from "@/components/auth/authContainer";
// import LoadingScreen from "@/components/LoadingScreen";
export default function LandingPage() {
  // const [loading, setLoading] = React.useState(true);
  // useEffect(() => {
  //   // Simulate data fetching
  //   const timer = setTimeout(() => setLoading(false), 3000);
  //   return () => clearTimeout(timer);
  // }, []);
  // return loading ? (<LoadingScreen />) : (
  return (
    <AuthLayout >

      <SignUpForm />

      {/* <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
        <div className="flex gap-4">
          <Link
            href="/signin"
            className="h-14 px-10 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all flex items-center justify-center min-w-[160px]"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="h-14 px-10 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all border border-gray-200 flex items-center justify-center min-w-[160px]"
          >
            Sign Up
          </Link>
        </div>
      </div> */}
    </AuthLayout>
  );
}
