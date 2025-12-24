"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import GlassCard from '@/src/components/ui/GlassCard';
import AuthLayout from '@/src/components/layout/AuthLayout';

interface Todo {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning';
}

// Toast Component
const Toast: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const bgColor = {
        success: 'bg-green-500/90',
        error: 'bg-red-500/90',
        warning: 'bg-amber-500/90'
    }[toast.type];

    return (
        <div
            className={`${bgColor} backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl animate-slide-in-top flex items-center gap-3 min-w-[280px] max-w-md border border-white/20`}
            style={{
                animation: 'slideInTop 0.3s ease-out'
            }}
        >
            <div className="flex-shrink-0">
                {toast.type === 'success' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {toast.type === 'error' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                {toast.type === 'warning' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}
            </div>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
    );
};

// Confirmation Modal Component
const ConfirmModal: React.FC<{
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}> = ({ isOpen, onConfirm, onCancel, message }) => {
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

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; todoId: string | null }>({
        isOpen: false,
        todoId: null
    });

    // Toast functions
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Get userId from cookies or localStorage
    useEffect(() => {
        // First try to get from cookies
        const userIdFromCookie = Cookies.get('userId');

        if (userIdFromCookie) {
            setUserId(userIdFromCookie);
        } else {
            // Fallback to localStorage
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                setUserId(userData.id || userData._id || userData.email);
            } else {
                // Redirect to home if no user found
                window.location.href = '/';
            }
        }
    }, []);

    // Fetch todos
    useEffect(() => {
        if (userId) {
            fetchTodos();
        }
    }, [userId]);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`/api/todos?userId=${userId}`);
            const data = await response.json();
            if (response.ok) {
                setTodos(data.todos);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleDeleteClick = (id: string) => {
        setConfirmModal({ isOpen: true, todoId: id });
    };

    const handleDelete = async () => {
        const id = confirmModal.todoId;
        setConfirmModal({ isOpen: false, todoId: null });

        if (!id) return;

        try {
            console.log('Deleting todo with ID:', id);

            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            console.log('Delete response:', response.status, data);

            if (response.ok) {
                await fetchTodos();
                showToast('Todo deleted successfully!', 'success');
            } else {
                showToast(data.error || 'Failed to delete todo', 'error');
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            showToast('Network error while deleting todo', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setLoading(true);

        try {
            if (editingId) {
                console.log('Updating todo with ID:', editingId);

                // Update existing todo
                const response = await fetch(`/api/todos/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description }),
                });

                const data = await response.json();
                console.log('Update response:', response.status, data);

                if (response.ok) {
                    await fetchTodos();
                    setEditingId(null);
                    setTitle('');
                    setDescription('');
                    showToast('Todo updated successfully!', 'success');
                } else {
                    showToast(data.error || 'Failed to update todo', 'error');
                }
            } else {
                // Create new todo
                const response = await fetch('/api/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, userId }),
                });

                const data = await response.json();

                if (response.ok) {
                    await fetchTodos();
                    setTitle('');
                    setDescription('');
                    showToast('Todo created successfully!', 'success');
                } else {
                    showToast(data.error || 'Failed to create todo', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving todo:', error);
            showToast('Network error while saving todo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (todo: Todo) => {
        setTitle(todo.title);
        setDescription(todo.description);
        setEditingId(todo._id);
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setEditingId(null);
    };

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear cookies
        Cookies.remove('token');
        Cookies.remove('userId');

        // Redirect to home page (which will show sign-in form)
        window.location.href = '/';
    };

    return (
        <AuthLayout>
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onConfirm={handleDelete}
                onCancel={() => setConfirmModal({ isOpen: false, todoId: null })}
                message="Are you sure you want to delete this todo? This action cannot be undone."
            />

            <div className="w-full max-w-4xl mx-auto">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left leading-snug">
                            My Todo List
                        </h1>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center px-5 py-2 rounded-full bg-black text-white font-semibold shadow-md hover:shadow-lg hover:bg-white hover:text-black transition-all text-sm sm:text-base w-full sm:w-auto"
                        >
                            Logout
                        </button>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Add/Edit Todo Form */}
                    <GlassCard className="h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingId ? 'Edit Todo' : 'Add New Todo'}
                        </h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder-gray-400 transition-all"
                                    placeholder="Enter todo title"
                                    required
                                />

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder-gray-400 transition-all resize-none"
                                    placeholder="Enter todo description"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-12 px-6 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingId ? 'Update' : 'Add Todo'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="h-12 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </GlassCard>

                    {/* Todo List */}
                    <div className="flex flex-col gap-4">
                        {todos.length === 0 ? (
                            <GlassCard>
                                <p className="text-center text-gray-600">
                                    No todos yet. Create your first todo!
                                </p>
                            </GlassCard>
                        ) : (
                            todos.map((todo) => (
                                <GlassCard key={todo._id} className="max-w-full">
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {todo.title}
                                        </h3>
                                        <p className="text-gray-700">{todo.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleEdit(todo)}
                                                className="flex-1 h-10 px-4 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(todo._id)}
                                                className="flex-1 h-10 px-4 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInTop {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </AuthLayout>
    );
};

export default TodoList;