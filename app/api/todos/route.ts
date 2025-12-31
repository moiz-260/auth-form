import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Todo from '@/src/models/Todo';
import { upsertTodoToPinecone } from '@/src/lib/ai';

// GET - Fetch all todos for a user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get userId or email from query params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');

        if (!userId && !email) {
            return NextResponse.json(
                { error: 'User ID or Email is required' },
                { status: 400 }
            );
        }

        const filter = email ? { email } : { userId };
        const todos = await Todo.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ todos }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching todos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch todos' },
            { status: 500 }
        );
    }
}

// POST - Create a new todo
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { title, description, userId, email } = body;
        console.log(body);

        if (!title || !description || !userId) {
            return NextResponse.json(
                { error: 'Title, description, userId, and email are required' },
                { status: 400 }
            );
        }

        const todo = await Todo.create({
            title,
            description,
            userId,
            email,
        });

        // Sync with Pinecone for Chatbot
        try {
            await upsertTodoToPinecone({
                id: todo._id.toString(),
                title: todo.title,
                description: todo.description,
                userId: todo.userId,
                email: todo.email,
            });
        } catch (pineconeError) {
            console.error('Failed to sync with Pinecone:', pineconeError);
            // We don't want to fail the main request if Pinecone fails, 
            // but in a real app you might want to retry or handle this.
        }

        return NextResponse.json({ todo }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}
