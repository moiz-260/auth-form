import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from '@/schemas/authSchema';
import { SignInFormData } from '@/types/auth';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import RiveTeddyAnimation, { RiveTeddyAnimationRef } from '@/components/RiveTeddyAnimation';
import FormInput from '@/components/ui/FormInput';
import SuccessMessage from '@/components/successfullMessage/SuccessMessage';

const SignInForm: React.FC = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activeField, setActiveField] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const riveRef = useRef<RiveTeddyAnimationRef>(null);

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
        formId: 'signin',
        formMethods,
        persistFields: ['email'],
    });

    // Watch all fields for floating label animation
    const email = watch('email');
    const password = watch('password');

    // Update teddy's eye position based on email length
    useEffect(() => {
        if (activeField === 'email' && email) {
            riveRef.current?.updateEmailLook(email.length);
        }
    }, [email, activeField]);

    const handleTextFieldFocus = (fieldName: string) => {
        setActiveField(fieldName);
        riveRef.current?.handleEmailFocus();
    };

    const handleTextFieldBlur = () => {
        setActiveField('');
        riveRef.current?.handleEmailBlur();
    };

    const onSubmit = async (data: SignInFormData) => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Sign in failed');
            }

            // Store token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            console.log('Sign In Success:', result);
            riveRef.current?.triggerSuccess();
            setShowSuccessMessage(true);

            // Clear form persistence
            localStorage.removeItem('signin-form');

            // Redirect after success message
            setTimeout(() => {
                window.location.href = '/signin'; // Change to your dashboard route
            }, 2000);
        } catch (error: any) {
            console.error('Sign In Error:', error);
            setErrorMessage(error.message || 'Invalid email or password');
            riveRef.current?.triggerFail();
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = () => {
        riveRef.current?.triggerFail();
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-6">
                <RiveTeddyAnimation ref={riveRef} />

                <div className="flex flex-col gap-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Welcome back <br /> Login to your account
                    </h1>
                    {/* <p className="max-w-[400px] text-gray-600 leading-relaxed mt-4">
                        Welcome back! Please enter your details to access your account and continue your journey with us.
                    </p> */}
                </div>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                {/* Email Field with Floating Label */}
                <FormInput
                    label="Enter your email address"
                    type="email"
                    registration={register('email')}
                    error={errors.email}
                    value={email}
                    autoComplete="email"
                    onFocus={() => handleTextFieldFocus('email')}
                    onBlur={handleTextFieldBlur}
                />

                {/* Password Field with Floating Label */}
                <FormInput
                    label="Password"
                    type="password"
                    registration={register('password')}
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
                    {isSubmitting ? 'Logging in...' : 'Log in'}
                </button>
            </form>

            <div className="text-center">
                <p className="text-gray-600">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-black font-semibold hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>

            {/* Success Message */}
            <SuccessMessage
                isVisible={showSuccessMessage}
                message="Login successful! Welcome back to your account."
                onClose={() => setShowSuccessMessage(false)}
                autoCloseDuration={4000}
            />
        </div>
    );
};

export default SignInForm;