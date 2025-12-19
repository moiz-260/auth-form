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
    const riveRef = useRef<RiveTeddyAnimationRef>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


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

    const email = watch('email');
    const password = watch('password');

    useEffect(() => {
        if (email) {
            riveRef.current?.updateEmailLook(email.length);
        }
    }, [email]);

    const onSubmit = (data: SignInFormData) => {
        console.log('Sign In Data:', data);
        setShowSuccessMessage(true);
        riveRef.current?.triggerSuccess();
    };

    const onError = () => {
        riveRef.current?.triggerFail();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center sm:items-start gap-6">
                <RiveTeddyAnimation ref={riveRef} />

                <div className="flex flex-col gap-2 text-center sm:text-left">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Welcome back <br /> Login to your account
                    </h1>
                    {/* <p className="max-w-[400px] text-gray-600 leading-relaxed mt-4">
                        Welcome back! Please enter your details to access your account and continue your journey with us.
                    </p> */}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-6">
                <FormInput
                    label="Enter your email address"
                    type="email"
                    registration={register('email')}
                    error={errors.email}
                    value={email}
                    onFocus={() => riveRef.current?.handleEmailFocus()}
                    onBlur={() => riveRef.current?.handleEmailBlur()}
                />

                <FormInput
                    label="Password"
                    type="password"
                    registration={register('password')}
                    error={errors.password}
                    value={password}
                    onFocus={() => riveRef.current?.handlePasswordFocus()}
                    onBlur={() => riveRef.current?.handlePasswordBlur()}
                />

                <button
                    type="submit"
                    className="h-14 w-full px-10 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
                >
                    Log in
                </button>
            </form>

            <div className="text-center mt-4">
                <p className="text-gray-600">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="text-black font-semibold hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
            <SuccessMessage
                isVisible={showSuccessMessage}
                message="Your account has been created successfully! Welcome to our family."
                onClose={() => setShowSuccessMessage(false)}
                autoCloseDuration={4000}
            />
        </div>
    );
};

export default SignInForm;