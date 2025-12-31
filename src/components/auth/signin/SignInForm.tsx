"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/src/schemas/authSchema";
import { SignInFormData } from "@/src/types/auth";
import { useFormPersistence } from "@/src/hooks/useFormPersistence";
import RiveTeddyAnimation, { RiveTeddyAnimationRef } from "@/src/components/RiveTeddyAnimation";
import FormInput from "@/src/components/ui/FormInput";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const SignInForm: React.FC = () => {
    const [activeField, setActiveField] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const riveRef = useRef<RiveTeddyAnimationRef>(null);
    const router = useRouter();

    const formMethods = useForm<SignInFormData>({
        resolver: yupResolver(signInSchema),
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = formMethods;

    useFormPersistence({
        formId: "signin",
        formMethods,
        persistFields: ["email"],
    });

    const email = watch("email");
    const password = watch("password");

    // Update teddy's eye position based on email length
    useEffect(() => {
        if (activeField === "email" && email) {
            riveRef.current?.updateEmailLook(email.length);
        }
    }, [email, activeField]);

    const handleTextFieldFocus = (fieldName: string) => {
        setActiveField(fieldName);
        riveRef.current?.handleEmailFocus();
    };

    const handleTextFieldBlur = () => {
        setActiveField("");
        riveRef.current?.handleEmailBlur();
    };

    const onSubmit = async (data: SignInFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Sign in failed");

            // Store token in localStorage and cookies
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("email", result.user.email);
            Cookies.set("token", result.token, { expires: 7 });
            Cookies.set("userId", result.user.id, { expires: 7 });
            Cookies.set("email", result.user.email, { expires: 7 });

            riveRef.current?.triggerSuccess();
            toast.success("Login successful! Welcome back to your account.");

            localStorage.removeItem("signin-form");

            setTimeout(() => {
                window.location.href = "/todolist";
            }, 1500);
        } catch (error: any) {
            console.error(error);
            riveRef.current?.triggerFail();
            toast.error(error.message || "Invalid email or password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = () => {
        riveRef.current?.triggerFail();
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-6">
                <RiveTeddyAnimation ref={riveRef} />

                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Welcome back <br /> Login to your account
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                <FormInput
                    label="Enter your email address"
                    type="email"
                    registration={register("email")}
                    error={errors.email}
                    value={email}
                    autoComplete="email"
                    onFocus={() => handleTextFieldFocus("email")}
                    onBlur={handleTextFieldBlur}
                />

                <FormInput
                    label="Password"
                    type="password"
                    registration={register("password")}
                    error={errors.password}
                    value={password}
                    autoComplete="current-password"
                    onFocus={() => riveRef.current?.handlePasswordFocus()}
                    onBlur={() => riveRef.current?.handlePasswordBlur()}
                />

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full px-10 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>

            <div className="text-center">
                <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => router.push('/signup')}
                        className="text-black font-semibold hover:underline hover: cursor-pointer"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
