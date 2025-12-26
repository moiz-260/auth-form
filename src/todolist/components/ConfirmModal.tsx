import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-white/30"
                style={{
                    animation: 'scaleIn 0.3s ease-out'
                }}
            >
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-11 px-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-11 px-4 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;