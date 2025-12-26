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

// Todo Detail Modal Component (Task 1)
const TodoDetailModal: React.FC<{
    isOpen: boolean;
    todo: Todo | null;
    onClose: () => void;
}> = ({ isOpen, todo, onClose }) => {
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
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-2xl w-full border border-white/30 max-h-[80vh] overflow-y-auto"
                style={{
                    animation: 'scaleIn 0.3s ease-out'
                }}
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
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; todo: Todo | null }>({
        isOpen: false,
        todo: null
    });

    // Toast functions
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Truncate text helper (Task 1)
    const truncateText = (text: string, wordLimit: number = 20) => {
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    // Get userId from cookies or localStorage
    useEffect(() => {
        const userIdFromCookie = Cookies.get('userId');

        if (userIdFromCookie) {
            setUserId(userIdFromCookie);
        } else {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                setUserId(userData.id || userData._id || userData.email);
            } else {
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
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setEditingId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('userId');
        window.location.href = '/';
    };

    const handleTodoClick = (todo: Todo) => {
        setDetailModal({ isOpen: true, todo });
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

            {/* Todo Detail Modal (Task 1) */}
            <TodoDetailModal
                isOpen={detailModal.isOpen}
                todo={detailModal.todo}
                onClose={() => setDetailModal({ isOpen: false, todo: null })}
            />

            <div className="w-full max-w-4xl mx-auto">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left leading-snug">
                            My Todo List
                        </h1>

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
                                <GlassCard
                                    key={todo._id}
                                    className={`max-w-full relative transition-all duration-300 ${editingId === todo._id
                                        ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02]'
                                        : ''
                                        }`}
                                >
                                    {/* Task 3: Icon buttons */}
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(todo);
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
                                                handleDeleteClick(todo._id);
                                            }}
                                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                                            title="Delete todo"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Task 2: Highlight editing todo */}
                                    {editingId === todo._id && (
                                        <div className="absolute -top-2 -left-2">
                                            <span className="flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                            </span>
                                        </div>
                                    )}

                                    <div
                                        className="flex flex-col gap-3 pr-20 cursor-pointer"
                                        onClick={() => handleTodoClick(todo)}
                                    >
                                        <h3 className="text-xl font-bold text-gray-900 break-words">
                                            {todo.title}
                                        </h3>
                                        {/* Task 1: Truncate description */}
                                        <p className="text-gray-700 break-words">
                                            {truncateText(todo.description, 20)}
                                        </p>
                                        {todo.description.split(' ').length > 20 && (
                                            <button
                                                onClick={() => handleTodoClick(todo)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium text-left"
                                            >
                                                Read more →
                                            </button>
                                        )}
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