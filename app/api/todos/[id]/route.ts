import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Todo from '@/src/models/Todo';
import mongoose from 'mongoose';
import { upsertTodoToPinecone, deleteTodoFromPinecone } from '@/src/lib/ai';

// PUT - Update a todo
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // Unwrap params (it's a Promise in Next.js 15+ App Router)
        const { id } = await params;

        console.log('PUT - Received ID:', id);

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('PUT - Invalid ObjectId format:', id);
            return NextResponse.json(
                { error: 'Invalid todo ID format' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { title, description } = body;

        console.log('PUT - Update data:', { title, description });

        if (!title || !description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        const todo = await Todo.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!todo) {
            console.error('PUT - Todo not found for ID:', id);
            return NextResponse.json(
                { error: 'Todo not found' },
                { status: 404 }
            );
        }

        // Sync with Pinecone
        try {
            await upsertTodoToPinecone({
                id: todo._id.toString(),
                title: todo.title,
                description: todo.description,
                userId: todo.userId,
                email: todo.email,
            });
        } catch (error) {
            console.error('Failed to update Pinecone:', error);
        }

        console.log('PUT - Successfully updated todo:', todo);
        return NextResponse.json({ todo }, { status: 200 });
    } catch (error: any) {
        console.error('PUT - Error updating todo:', error);
        return NextResponse.json(
            { error: 'Failed to update todo', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a todo
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // Unwrap params (it's a Promise in Next.js 15+ App Router)
        const { id } = await params;

        console.log('DELETE - Received ID:', id);

        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error('DELETE - Invalid ObjectId format:', id);
            return NextResponse.json(
                { error: 'Invalid todo ID format' },
                { status: 400 }
            );
        }

        const todo = await Todo.findByIdAndDelete(id);

        if (!todo) {
            console.error('DELETE - Todo not found for ID:', id);
            return NextResponse.json(
                { error: 'Todo not found' },
                { status: 404 }
            );
        }

        // Sync with Pinecone
        try {
            await deleteTodoFromPinecone(id);
        } catch (error) {
            console.error('Failed to delete from Pinecone:', error);
        }

        console.log('DELETE - Successfully deleted todo:', todo);
        return NextResponse.json(
            { message: 'Todo deleted successfully', todo },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('DELETE - Error deleting todo:', error);
        return NextResponse.json(
            { error: 'Failed to delete todo', details: error.message },
            { status: 500 }
        );
    }
}
