import mongoose from 'mongoose';

export interface IUser {
    user: string;
    email: string;
    password: string;
}

export const User = mongoose.model<IUser>('User', new mongoose.Schema<IUser>({
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}));