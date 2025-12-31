import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Todo, Toast, ConfirmModalState, DetailModalState } from '../types';

export const useTodoManager = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
        isOpen: false,
        todoId: null
    });
    const [detailModal, setDetailModal] = useState<DetailModalState>({
        isOpen: false,
        todo: null
    });
    const [email, setEmail] = useState<string>('');

    // Toast functions
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Get userId and email from cookies or localStorage
    useEffect(() => {
        const userIdFromCookie = Cookies.get('userId');
        const emailFromCookie = Cookies.get('email');

        if (userIdFromCookie) {
            setUserId(userIdFromCookie);
        }

        if (emailFromCookie) {
            setEmail(emailFromCookie);
        }

        if (!userIdFromCookie || !emailFromCookie) {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                if (!userIdFromCookie) setUserId(userData.id || userData._id || userData.email);
                if (!emailFromCookie) setEmail(userData.email);
            } else if (!userIdFromCookie && !emailFromCookie) {
                window.location.href = '/';
            }
        }
    }, []);

    // Fetch todos
    useEffect(() => {
        if (email) {
            fetchTodos();
        }
    }, [email]);

    const fetchTodos = async () => {
        try {
            const query = email ? `email=${email}` : `userId=${userId}`;
            const response = await fetch(`/api/todos?${query}`);
            const data = await response.json();
            if (response.ok) {
                setTodos(data.todos);
            }
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        setLoading(true);

        try {
            if (editingId) {
                const response = await fetch(`/api/todos/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description }),
                });

                const data = await response.json();

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
                    body: JSON.stringify({ title, description, userId, email }),
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = (id: string) => {
        setConfirmModal({ isOpen: true, todoId: id });
    };

    const handleDelete = async () => {
        const id = confirmModal.todoId;
        setConfirmModal({ isOpen: false, todoId: null });

        if (!id) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

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

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setEditingId(null);
    };

    const handleTodoClick = (todo: Todo) => {
        setDetailModal({ isOpen: true, todo });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('userId');
        window.location.href = '/';
    };

    return {
        // State
        todos,
        title,
        description,
        editingId,
        loading,
        toasts,
        confirmModal,
        detailModal,

        // Setters
        setTitle,
        setDescription,
        setConfirmModal,
        setDetailModal,

        // Functions
        showToast,
        removeToast,
        handleSubmit,
        handleEdit,
        handleDeleteClick,
        handleDelete,
        handleCancel,
        handleTodoClick,
        handleLogout
    };
};