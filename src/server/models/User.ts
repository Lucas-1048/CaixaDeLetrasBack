import mongoose from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    birthDate: Date;
    gender: string;
    genres: string[];
    profilePicturePath: string | null | undefined;
    biography: string | null | undefined;
    favorites: (string | null | undefined)[];
}

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    birthDate: {type: Date, required: true},
    gender: {type: String, required: true},
    genres: {type: [String], required: true},
    profilePicturePath: {type: String, default: '', required: false},
    biography: {type: String, default: '', required: false},
    favorites: {type: [String], required: true}
});

export const User = mongoose.model<IUser>('User', UserSchema);
