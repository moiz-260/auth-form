import React from 'react';
import { Todo } from '../types';

interface TodoDetailModalProps {
    isOpen: boolean;
    todo: Todo | null;
    onClose: () => void;
}

const TodoDetailModal: React.FC<TodoDetailModalProps> = ({ isOpen, todo, onClose }) => {
    if (!isOpen || !todo) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 
             max-w-2xl w-full border border-white/30 
             max-h-[80vh] overflow-y-auto scrollbar-minimal"
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 pr-8">{todo.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{todo.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Created: {new Date(todo.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TodoDetailModal;