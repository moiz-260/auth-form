import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import User from '@/src/models/User';
import jwt from 'jsonwebtoken';


export async function POST(request: NextRequest) {
    try {
        // Connect to database
        await connectDB();

        const body = await request.json();

        const { fullName, dateOfBirth, phoneNumber, email, password } = body;

        // Validate required fields
        if (!fullName || !dateOfBirth || !phoneNumber || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }],
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: existingUser.email === email
                        ? 'Email already registered'
                        : 'Phone number already registered',
                },
                { status: 409 }
            );
        }

        // Create new user
        const user = await User.create({
            fullName,
            dateOfBirth,
            phoneNumber,
            email,
            password,
        });

        // Check if JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: 'User created successfully',
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    dateOfBirth: user.dateOfBirth,
                },
                token,
            },
            { status: 201 }
        );
    } catch (error: any) {
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            );
        }

        // Handle MongoDB connection errors
        if (error.name === 'MongooseServerSelectionError') {
            return NextResponse.json(
                { error: 'Database connection failed. Please check your MongoDB URI.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}