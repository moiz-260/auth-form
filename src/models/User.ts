import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    fullName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [
                /^\+\d{7,15}$/,
                'Invalid phone number format',
            ],
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false, // Don't return password by default
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        throw error;
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);