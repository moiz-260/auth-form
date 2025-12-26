"use client";

import React from 'react';
import AuthLayout from '@/src/components/layout/AuthLayout';
import GlassCard from '@/src/components/ui/GlassCard';
import { useTodoManager } from './hooks/useTodoManager';
import ToastContainer from './components/ToastContainer';
import ConfirmModal from './components/ConfirmModal';
import TodoDetailModal from './components/TodoDetailModal';
import TodoForm from './components/TodoForm';
import TodoCard from './components/TodoCard';

const TodoList: React.FC = () => {
    const {
        todos,
        title,
        description,
        editingId,
        loading,
        toasts,
        confirmModal,
        detailModal,
        setTitle,
        setDescription,
        setConfirmModal,
        setDetailModal,
        removeToast,
        handleSubmit,
        handleEdit,
        handleDeleteClick,
        handleDelete,
        handleCancel,
        handleTodoClick,
        handleLogout
    } = useTodoManager();

    return (
        <AuthLayout>
            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onConfirm={handleDelete}
                onCancel={() => setConfirmModal({ isOpen: false, todoId: null })}
                message="Are you sure you want to delete this todo? This action cannot be undone."
            />

            {/* Todo Detail Modal */}
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
                    {/* Todo Form */}
                    <TodoForm
                        title={title}
                        description={description}
                        editingId={editingId}
                        loading={loading}
                        onTitleChange={setTitle}
                        onDescriptionChange={setDescription}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />

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
                                <TodoCard
                                    key={todo._id}
                                    todo={todo}
                                    isEditing={editingId === todo._id}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteClick}
                                    onClick={handleTodoClick}
                                />
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