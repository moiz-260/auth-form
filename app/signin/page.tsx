"use client";

import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import GlassCard from "@/components/ui/GlassCard";
import SignInForm from "@/components/signin/SignInForm";

export default function SignInPage() {
    return (
        <AuthLayout>
            <div className="container max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center lg:justify-start">
                        <GlassCard className="w-full max-w-[650px]">
                            <SignInForm />
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
