"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { countries, Country } from '@/src/constants/countries';
import { FieldError } from 'react-hook-form';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: FieldError;
    label: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    error,
    label,
    onFocus,
    onBlur,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        countries.find(c => value.startsWith(c.dialCode)) || countries.find(c => c.code === 'PK') || countries[0]
    );
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter countries based on search
    const filteredCountries = useMemo(() => {
        return countries.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.dialCode.includes(searchQuery)
        );
    }, [searchQuery]);

    // Extract the number part from the full value
    const numberPart = useMemo(() => {
        if (value.startsWith(selectedCountry.dialCode)) {
            return value.slice(selectedCountry.dialCode.length);
        }
        return value;
    }, [value, selectedCountry]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        setSearchQuery('');
        // Update the full value with the new dial code
        onChange(country.dialCode + numberPart);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Only allow digits
        val = val.replace(/\D/g, '');
        onChange(selectedCountry.dialCode + val);
    };

    const handleFocusInput = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlurInput = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const isLabelFloating = isFocused || value.length > selectedCountry.dialCode.length;

    return (
        <div className="relative w-full">
            <div
                className={`flex items-center w-full h-14 rounded-2xl bg-white/60 backdrop-blur-md transition-all duration-200 ${error ? 'ring-2 ring-red-500' : isFocused ? 'ring-2 ring-black' : ''
                    }`}
            >
                {/* Country Code Selector */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 h-full border-r border-gray-200/50 hover:bg-black/5 transition-colors rounded-l-2xl min-w-[100px]"
                >
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="font-medium text-sm text-gray-700">{selectedCountry.code}</span>
                    <span className="text-gray-500 text-sm">{selectedCountry.dialCode}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Number Input */}
                <div className="relative flex-1 h-full">
                    <input
                        type="tel"
                        value={numberPart}
                        onChange={handleNumberChange}
                        onFocus={handleFocusInput}
                        onBlur={handleBlurInput}
                        // placeholder={isLabelFloating ? "" : "(000) 000-0000"}
                        className="w-full h-full px-4 pt-6 pb-2 bg-transparent border-none outline-none text-black font-medium text-sm placeholder:text-gray-300"
                    />
                    <label
                        className={`absolute left-4 transition-all duration-200 pointer-events-none ${isLabelFloating
                            ? 'top-2 text-xs text-gray-600 font-medium'
                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                            }`}
                    >
                        {label}
                    </label>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <span className="block mt-1 ml-2 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {error.message}
                </span>
            )}

            {/* Country Dropdown Tooltip/Popover */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-16 left-0 z-[100] w-full max-w-sm bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                >
                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for countries"
                                className="w-full h-10 pl-10 pr-4 bg-gray-50 rounded-xl border-none outline-none text-sm focus:ring-2 focus:ring-black/5 transition-all"
                            />
                        </div>
                    </div>

                    {/* Countries List */}
                    <div className="max-h-64 overflow-y-auto scrollbar-minimal">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={`${country.code}-${country.dialCode}`}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className="flex items-center justify-between w-full p-3 hover:bg-black/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{country.flag}</span>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-900">{country.name}</p>
                                            <p className="text-xs text-gray-500">{country.dialCode}</p>
                                        </div>
                                    </div>
                                    {selectedCountry.code === country.code && (
                                        <Check size={16} className="text-black" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-sm text-gray-500">No countries found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhoneInput;
