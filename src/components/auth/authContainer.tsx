"use client";

import React, { useState } from "react";
import Image from "next/image";
import GlassCard from "@/src/components/ui/GlassCard";
import SignInForm from "@/src/components/auth/signin/SignInForm";
import SignUpForm from "@/src/components/auth/signup/SignUpForm";


const AuthContainer = () => {
  const [isSignIn, setIsSignIn] = useState(true); // default to sign in

  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">


      <div className="fixed inset-0 z-0">
        <Image
          src="/images/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12 px-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              {/* <GlassCard className="w-full max-w-[650px]">
                {isSignIn ? <SignInForm /> : <SignUpForm />}
              </GlassCard> */}
              <GlassCard className="w-full max-w-md mx-auto"> {/* max-w-md = 28rem = 448px */}
                {isSignIn ? <SignInForm /> : <SignUpForm />}
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthContainer;
