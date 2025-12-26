export interface Todo {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning';
}

export interface ConfirmModalState {
    isOpen: boolean;
    todoId: string | null;
}

export interface DetailModalState {
    isOpen: boolean;
    todo: Todo | null;
}