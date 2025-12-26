import React, { useState } from 'react';
import { Eye, EyeOff, Calendar } from 'lucide-react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormInputProps {
    label: string;
    type: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
    value?: string | Date;
    placeholder?: string;
    autoComplete?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    type,
    registration,
    error,
    value,
    placeholder = " ",
    autoComplete,
    onFocus,
    onBlur,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    const isPasswordType = type === 'password';
    const isDateType = type === 'date';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (e) {
            registration.onBlur(e);
        }
        onBlur?.();
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            const event = {
                target: {
                    name: registration.name,
                    value: formattedDate,
                },
            } as any;
            registration.onChange(event);
        }
    };

    const isLabelFloating = value || isFocused || selectedDate;

    const formatDateDisplay = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isDateType) {
        return (
            <div className="custom-datepicker-wrapper">
                <div className="relative">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        onFocus={handleFocus as any}
                        onBlur={handleBlur as any}
                        dateFormat="MMM dd, yyyy"
                        placeholderText=" "
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        className={`w-full h-14 px-6 pt-6 pb-2 pr-12 rounded-2xl bg-white/60 border-none text-black focus:ring-2 focus:ring-black outline-none transition-all ${error ? 'ring-2 ring-red-500' : ''
                            }`}
                        calendarClassName="custom-calendar"
                        wrapperClassName="w-full"
                    />
                    <label
                        className={`absolute left-6 transition-all duration-200 pointer-events-none z-10 ${isLabelFloating
                            ? 'top-2 text-xs text-gray-600'
                            : 'top-1/2 -translate-y-1/2 text-gray-400'
                            }`}
                    >
                        {label}
                    </label>
                    <Calendar
                        size={20}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>
                {error && (
                    <span className="block mt-1 ml-2 text-xs text-red-500">
                        {error.message}
                    </span>
                )}
                <style jsx global>{`
                    .custom-datepicker-wrapper .react-datepicker-wrapper {
                        width: 100%;
                    }

                    .custom-calendar {
                        font-family: inherit;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 16px;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                        padding: 16px;
                    }

                    .custom-calendar .react-datepicker__header {
                        background: transparent;
                        border: none;
                        padding: 0;
                        margin-bottom: 12px;
                    }

                    .custom-calendar .react-datepicker__current-month {
                        font-weight: 600;
                        font-size: 16px;
                        color: #111;
                        margin-bottom: 12px;
                    }

                    .custom-calendar .react-datepicker__day-names {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    }

                    .custom-calendar .react-datepicker__day-name {
                        color: #666;
                        font-size: 12px;
                        font-weight: 600;
                        width: 36px;
                        line-height: 36px;
                        margin: 0;
                    }

                    .custom-calendar .react-datepicker__month {
                        margin: 0;
                    }

                    .custom-calendar .react-datepicker__week {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 4px;
                    }

                    .custom-calendar .react-datepicker__day {
                        width: 36px;
                        height: 36px;
                        line-height: 36px;
                        margin: 0;
                        border-radius: 8px;
                        color: #111;
                        font-size: 14px;
                        transition: all 0.2s;
                    }

                    .custom-calendar .react-datepicker__day:hover {
                        background: rgba(0, 0, 0, 0.05);
                        border-radius: 8px;
                    }

                    .custom-calendar .react-datepicker__day--selected {
                        background: #000;
                        color: #fff;
                        font-weight: 600;
                    }

                    .custom-calendar .react-datepicker__day--selected:hover {
                        background: #333;
                    }

                    .custom-calendar .react-datepicker__day--today {
                        font-weight: 600;
                        color: #000;
                    }

                    .custom-calendar .react-datepicker__day--outside-month {
                        color: #ccc;
                    }

                    .custom-calendar .react-datepicker__day--disabled {
                        color: #ccc;
                        cursor: not-allowed;
                    }

                    .custom-calendar .react-datepicker__navigation {
                        top: 16px;
                        width: 32px;
                        height: 32px;
                        border-radius: 8px;
                        transition: all 0.2s;
                    }

                    .custom-calendar .react-datepicker__navigation:hover {
                        background: rgba(0, 0, 0, 0.05);
                    }

                    .custom-calendar .react-datepicker__navigation-icon::before {
                        border-color: #000;
                        border-width: 2px 2px 0 0;
                    }

                    .custom-calendar .react-datepicker__year-dropdown,
                    .custom-calendar .react-datepicker__month-dropdown {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 12px;
                        padding: 8px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    }

                    .custom-calendar .react-datepicker__year-option,
                    .custom-calendar .react-datepicker__month-option {
                        padding: 8px 12px;
                        border-radius: 8px;
                        transition: all 0.2s;
                    }

                    .custom-calendar .react-datepicker__year-option:hover,
                    .custom-calendar .react-datepicker__month-option:hover {
                        background: rgba(0, 0, 0, 0.05);
                    }

                    .custom-calendar .react-datepicker__year-option--selected,
                    .custom-calendar .react-datepicker__month-option--selected {
                        background: #000;
                        color: #fff;
                    }

                    .custom-calendar .react-datepicker__year-read-view,
                    .custom-calendar .react-datepicker__month-read-view {
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        border-radius: 8px;
                        padding: 4px 8px;
                    }
                `}</style>
            </div>
        );
    }

    const { onChange, ...restRegistration } = registration;

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (type === 'tel') {
            let val = target.value;
            // Immediate sanitization: remove anything that isn't a digit or a leading +
            val = val.replace(/[^\d+]/g, '');
            // Ensure + only appears at the very beginning
            if (val.includes('+', 1)) {
                val = val.at(0) + val.substring(1).replace(/\+/g, '');
            }
            // Prevent multiple + at the start
            if (val.startsWith('++')) {
                val = '+' + val.replace(/^\++/, '');
            }
            target.value = val;
        }
        // Call the original onChange from react-hook-form
        onChange({
            target: {
                name: registration.name,
                value: target.value
            }
        } as any);
    };

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    {...restRegistration}
                    onInput={handleInput}
                    type={inputType}
                    inputMode={type === 'tel' ? 'tel' : undefined}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                        if (type === 'tel') {
                            // Desktop-level blocking
                            if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key) ||
                                (e.key === '+' && !e.currentTarget.value.includes('+')) ||
                                (e.key === 'a' && (e.ctrlKey === true || e.metaKey === true)) ||
                                (e.key === 'c' && (e.ctrlKey === true || e.metaKey === true)) ||
                                (e.key === 'v' && (e.ctrlKey === true || e.metaKey === true)) ||
                                (e.key === 'x' && (e.ctrlKey === true || e.metaKey === true)) ||
                                (e.key === 'Home' || e.key === 'End' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                                return;
                            }
                            if ((e.shiftKey || (e.key < '0' || e.key > '9'))) {
                                e.preventDefault();
                            }
                        }
                    }}
                    className={`w-full h-14 px-6 pt-6 pb-2 ${isPasswordType ? 'pr-12' : ''
                        } rounded-2xl bg-white/60 border-none text-black focus:ring-2 focus:ring-black outline-none transition-all peer ${error ? 'ring-2 ring-red-500' : ''
                        }`}
                />
                <label
                    className={`absolute left-6 transition-all duration-200 pointer-events-none ${isLabelFloating
                        ? 'top-2 text-xs text-gray-600'
                        : 'top-1/2 -translate-y-1/2 text-gray-400'
                        } peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-600`}
                >
                    {label}
                </label>

                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {error && (
                <span className="block mt-1 ml-2 text-xs text-red-500">
                    {error.message}
                </span>
            )}
        </div>
    );
};

export default FormInput;
