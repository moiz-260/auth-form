import React from 'react';
import Toast from './Toast';

interface ToastType {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning';
}

interface ToastContainerProps {
    toasts: ToastType[];
    removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;