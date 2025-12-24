import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Todo from '@/src/models/Todo';

// GET - Fetch all todos for a user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Get userId from query params
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
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
        const { title, description, userId } = body;

        if (!title || !description || !userId) {
            return NextResponse.json(
                { error: 'Title, description, and userId are required' },
                { status: 400 }
            );
        }

        const todo = await Todo.create({
            title,
            description,
            userId,
        });

        return NextResponse.json({ todo }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}
