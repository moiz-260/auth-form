"use client";

import React from "react";
import AuthLayout from "@/src/components/layout/AuthLayout";
import GlassCard from "@/src/components/ui/GlassCard";
import SignUpForm from "@/src/components/auth/signup/SignUpForm";

export default function SignUpPage() {
    return (
        <AuthLayout>
            <div className="container max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center lg:justify-start">
                        <GlassCard className="w-full max-w-[650px]">
                            <SignUpForm />
                        </GlassCard>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
