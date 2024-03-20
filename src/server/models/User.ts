import mongoose from 'mongoose';

const url : string = process.env.MONGODB_URL as string

mongoose.connect(url)
    .then(res => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("Error connecting to MongoDB");
    })

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