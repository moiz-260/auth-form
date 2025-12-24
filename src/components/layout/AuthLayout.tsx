"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const pathname = usePathname();

    return (
        <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/images/background.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Header */}
            {/* <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-8 md:px-16 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                            <span className="text-white font-bold text-xs">AG</span>
                        </div>
                        <span className="font-bold text-xl hidden sm:inline-block">Antigravity</span>
                    </Link>
                </div>

                <div className="flex gap-4 font-medium ">
                    <Link
                        href="/signin"
                        className={`h-11 px-6 rounded-xl flex items-center justify-center transition-all border
              ${pathname === "/signin"
                                ? "bg-black text-white border-black"
                                : "bg-black text-white border-gray-200 hover:bg-gray-50 hover:text-black "
                            }`}
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/signup"
                        className={`h-11 px-6 rounded-xl flex items-center justify-center transition-all
              ${pathname === "/signup"
                                ? "bg-black text-white"
                                : "bg-gray-100 text-black hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        Sign Up
                    </Link>
                </div>
            </header> */}

            {/* Main */}
            <main className="relative z-10 flex min-h-screen items-center justify-center pt-6 pb-8 px-4">
                {children}
            </main>

            {/* <footer className="relative z-10 py-8 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Authenticated Form. All rights reserved.
            </footer> */}
        </div>
    );
};

export default AuthLayout;
