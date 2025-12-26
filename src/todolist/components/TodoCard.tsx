import React from 'react';
import GlassCard from '@/src/components/ui/GlassCard';
import { Todo } from '../types';

interface TodoCardProps {
    todo: Todo;
    isEditing: boolean;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void;
    onClick: (todo: Todo) => void;
}

const truncateText = (text: string, wordLimit: number = 10) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
};

const TodoCard: React.FC<TodoCardProps> = ({ todo, isEditing, onEdit, onDelete, onClick }) => {
    return (
        <GlassCard
            className={`max-w-full relative transition-all duration-300 ${isEditing ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]' : ''
                }`}
        >
            {/* Icon buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(todo);
                    }}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                    title="Edit todo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(todo._id);
                    }}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                    title="Delete todo"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Editing indicator */}
            {isEditing && (
                <div className="absolute -top-2 -left-2">
                    <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                </div>
            )}

            <div
                className="flex flex-col gap-3 pr-20 cursor-pointer"
                onClick={() => onClick(todo)}
            >
                <h3 className="text-xl font-bold text-gray-900 break-words">
                    {todo.title}
                </h3>
                <p className="text-gray-700 break-words">
                    {truncateText(todo.description, 10)}
                </p>
                {todo.description.split(' ').length > 10 && (
                    <button
                        onClick={() => onClick(todo)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium text-left"
                    >
                        Read more →
                    </button>
                )}
            </div>
        </GlassCard>
    );
};

export default TodoCard;