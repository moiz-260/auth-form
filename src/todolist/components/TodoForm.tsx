import React from 'react';
import GlassCard from '@/src/components/ui/GlassCard';

interface TodoFormProps {
    title: string;
    description: string;
    editingId: string | null;
    loading: boolean;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({
    title,
    description,
    editingId,
    loading,
    onTitleChange,
    onDescriptionChange,
    onSubmit,
    onCancel
}) => {
    return (
        <GlassCard className="h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? 'Edit Todo' : 'Add New Todo'}
            </h2>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
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
                        onChange={(e) => onDescriptionChange(e.target.value)}
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
                            onClick={onCancel}
                            className="h-12 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </GlassCard>
    );
};

export default TodoForm;