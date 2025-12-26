"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/src/schemas/authSchema';
import { SignUpFormData } from '@/src/types/auth';
import { useFormPersistence } from '@/src/hooks/useFormPersistence';
import RiveTeddyAnimation, { RiveTeddyAnimationRef } from '@/src/components/RiveTeddyAnimation';
import FormInput from '@/src/components/ui/FormInput';
import PhoneInput from '@/src/components/ui/PhoneInput';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

const SignUpForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [activeField, setActiveField] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const riveRef = useRef<RiveTeddyAnimationRef>(null);
    const router = useRouter();

    const formMethods = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
        mode: 'onBlur',
    });

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        control,
        formState: { errors },
    } = formMethods;

    useFormPersistence({
        formId: "signup",
        formMethods,
        persistFields: ["fullName", "dateOfBirth", "phoneNumber", "email"],
    });

    const fullName = watch('fullName');
    const dateOfBirth = watch('dateOfBirth');
    const phoneNumber = watch('phoneNumber');
    const email = watch('email');
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    // Update teddy's eye position based on the currently active text field
    useEffect(() => {
        let currentValue: string = '';
        let currentDate: Date = new Date();

        switch (activeField) {
            case 'fullName':
                currentValue = fullName || '';
                break;
            case 'dateOfBirth':
                currentDate = dateOfBirth || new Date();
                break;
            case 'phoneNumber':
                currentValue = phoneNumber || '';
                break;
            case 'email':
                currentValue = email || '';
                break;
            default:
                currentValue = '';
        }

        riveRef.current?.updateEmailLook(currentValue.length);
    }, [fullName, dateOfBirth, phoneNumber, email, activeField]);

    const handleTextFieldFocus = (fieldName: string) => {
        setActiveField(fieldName);
        riveRef.current?.handleEmailFocus();
    };

    const handleTextFieldBlur = () => {
        setActiveField('');
        riveRef.current?.handleEmailBlur();
    };

    const handleNext = async () => {
        const isStep1Valid = await trigger(['fullName', 'dateOfBirth', 'phoneNumber']);
        if (isStep1Valid) {
            setStep(2);
        }
    };

    const onSubmit = async (data: SignUpFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: data.fullName,
                    dateOfBirth: data.dateOfBirth,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Sign up failed');
            }

            // Store token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            console.log('Sign Up Success:', result);
            riveRef.current?.triggerSuccess();
            toast.success("Your account has been created successfully! Welcome to our family.");

            // Clear form persistence
            localStorage.removeItem('signup-form');

            // Redirect after success message
            setTimeout(() => {
                router.push('/signin');
            }, 1500);
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            riveRef.current?.triggerFail();
            toast.error(error.message || 'Sign up failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (err: any) => {
        console.log(`Validation error: ${err}`);
        riveRef.current?.triggerFail();
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
            <div className="flex flex-col gap-6">
                <RiveTeddyAnimation ref={riveRef} />

                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        {step === 1 ? "Personal Info" : "Account Details"}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                {step === 1 ? (
                    <>
                        <FormInput
                            key="fullName"
                            label="Full Name"
                            type="text"
                            registration={register('fullName')}
                            error={errors.fullName}
                            value={fullName}
                            autoComplete="name"
                            onFocus={() => handleTextFieldFocus('fullName')}
                            onBlur={handleTextFieldBlur}
                        />
                        <FormInput
                            key="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            registration={register('dateOfBirth')}
                            error={errors.dateOfBirth}
                            value={dateOfBirth}
                            autoComplete="bday"
                            onFocus={() => handleTextFieldFocus('dateOfBirth')}
                            onBlur={handleTextFieldBlur}
                        />
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    label="Phone Number"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    error={errors.phoneNumber}
                                    onFocus={() => handleTextFieldFocus('phoneNumber')}
                                    onBlur={() => {
                                        field.onBlur();
                                        handleTextFieldBlur();
                                    }}
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={handleNext}
                            className="h-14 mt-2 px-10 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
                        >
                            Next
                        </button>
                    </>
                ) : (
                    <>
                        <FormInput
                            key="email"
                            label="Enter your email address"
                            type="email"
                            registration={register('email')}
                            error={errors.email}
                            value={email}
                            autoComplete="email"
                            onFocus={() => handleTextFieldFocus('email')}
                            onBlur={handleTextFieldBlur}
                        />

                        <FormInput
                            key="password"
                            label="Password"
                            type="password"
                            registration={register('password')}
                            error={errors.password}
                            value={password}
                            autoComplete="new-password"
                            onFocus={() => riveRef.current?.handlePasswordFocus()}
                            onBlur={() => riveRef.current?.handlePasswordBlur()}
                        />

                        <FormInput
                            key="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            registration={register('confirmPassword')}
                            error={errors.confirmPassword}
                            value={confirmPassword}
                            autoComplete="new-password"
                            onFocus={() => riveRef.current?.handlePasswordFocus()}
                            onBlur={() => riveRef.current?.handlePasswordBlur()}
                        />

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-full bg-gray-100 text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-14 flex-1 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating Account...' : 'Sign up'}
                            </button>
                        </div>
                    </>
                )}
            </form>

            <div className="text-center">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => router.push('/signin')}
                        className="text-black font-semibold hover:underline cursor-pointer"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpForm;
