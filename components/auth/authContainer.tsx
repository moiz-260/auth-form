"use client";

import React, { useState } from "react";
import Image from "next/image";

import GlassCard from "@/components/ui/GlassCard";
import SignInForm from "@/components/signin/SignInForm";
import SignUpForm from "@/components/signup/SignUpForm";

const AuthContainer = () => {
    const [isSignIn, setIsSignIn] = useState(false);

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

            {/* <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-8 md:px-16 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-400" />
                </div>

                <div className="flex gap-4 font-medium">
                    <button
                        onClick={() => setIsSignIn(true)}
                        className={`h-11 px-6 rounded-xl border transition-all
              ${isSignIn
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        Log in
                    </button>

                    <button
                        onClick={() => setIsSignIn(false)}
                        className={`h-11 px-6 rounded-xl transition-all
              ${!isSignIn
                                ? "bg-black text-white"
                                : "bg-gray-100 text-black hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        Sign up
                    </button>
                </div>
            </header> */}

            <main className="relative z-10 flex min-h-screen items-center justify-center pt-24 pb-12 px-4">
                <div className="container max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="flex justify-center lg:justify-start">
                            <GlassCard className="w-full max-w-[650px]">
                                {isSignIn ? <SignInForm /> : <SignUpForm />}
                            </GlassCard>
                        </div>

                        <div className="hidden lg:flex justify-center items-center" />
                    </div>
                </div>
            </main>

            <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Authenticated Form. All rights reserved.
            </footer>
        </div>
    );
};

export default AuthContainer;
