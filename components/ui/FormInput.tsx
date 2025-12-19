'use client';

import React, { useState } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
    label: string;
    type?: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
    value?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    type = 'text',
    registration,
    error,
    value,
    onFocus,
    onBlur,
    placeholder = ' ', // Default to space for peer-placeholder-shown logic
    autoComplete,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative">
            <input
                {...registration}
                type={inputType}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onFocus={onFocus}
                onBlur={(e) => {
                    registration.onBlur(e);
                    onBlur?.();
                }}
                className={`w-full h-14 px-6 pt-6 pb-2 rounded-2xl bg-white/60 border-none text-black focus:ring-2 focus:ring-black outline-none transition-all peer ${error ? 'ring-2 ring-red-500' : ''
                    }`}
            />
            <label
                className={`absolute left-6 transition-all duration-200 pointer-events-none ${value
                    ? 'top-2 text-xs text-gray-600'
                    : 'top-1/2 -translate-y-1/2 text-gray-400'
                    } peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-600`}
            >
                {label}
            </label>

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {error && (
                <span className="absolute -bottom-5 left-2 text-xs text-red-500">
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default FormInput;
