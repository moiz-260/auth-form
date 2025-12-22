import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from '@/schemas/authSchema';
import { SignUpFormData } from '@/types/auth';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import RiveTeddyAnimation, { RiveTeddyAnimationRef } from '@/components/RiveTeddyAnimation';
import FormInput from '@/components/ui/FormInput';
import SuccessMessage from '@/components/successfullMessage/SuccessMessage';

const SignUpForm: React.FC = () => {
    const [step, setStep] = useState(1);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activeField, setActiveField] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const riveRef = useRef<RiveTeddyAnimationRef>(null);

    const formMethods = useForm<SignUpFormData>({
        resolver: yupResolver(signUpSchema),
        mode: 'onBlur',
    });

    const {
        register,
        handleSubmit,
        watch,
        trigger,
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
        setErrorMessage('');

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
            setShowSuccessMessage(true);

            // Clear form persistence
            localStorage.removeItem('signup-form');

            // Redirect after success message
            setTimeout(() => {
                window.location.href = '/signin'; // Change to your dashboard route
            }, 2000);
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            setErrorMessage(error.message || 'Sign up failed. Please try again.');
            riveRef.current?.triggerFail();
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (err: any) => {
        console.log(`Validation error: ${err}`);
        riveRef.current?.triggerFail();
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-6">
                <RiveTeddyAnimation ref={riveRef} />

                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        {step === 1 ? "Personal Info" : "Account Details"}
                    </h1>
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
            )}

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
                        <FormInput
                            key="phoneNumber"
                            label="Phone Number"
                            type="tel"
                            registration={register('phoneNumber')}
                            error={errors.phoneNumber}
                            value={phoneNumber}
                            autoComplete="tel"
                            onFocus={() => handleTextFieldFocus('phoneNumber')}
                            onBlur={handleTextFieldBlur}
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
                    <a href="/signin" className="text-black font-semibold hover:underline">
                        Sign In
                    </a>
                </p>
            </div>

            {/* Success Message */}
            <SuccessMessage
                isVisible={showSuccessMessage}
                message="Your account has been created successfully! Welcome to our family."
                onClose={() => setShowSuccessMessage(false)}
                autoCloseDuration={4000}
            />
        </div>
    );
};

export default SignUpForm;