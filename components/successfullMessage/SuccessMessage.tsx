import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
    autoCloseDuration?: number; // in milliseconds
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
    isVisible,
    message,
    onClose,
    autoCloseDuration = 3000
}) => {
    useEffect(() => {
        if (isVisible && autoCloseDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, autoCloseDuration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-slideUp">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Success!
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-600 animate-progress"
                        style={{
                            animation: `progress ${autoCloseDuration}ms linear forwards`
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default SuccessMessage;