import mongoose from 'mongoose';

export const User = mongoose.model('User', new mongoose.Schema({
    user: String,
    email: String,
    password: String,
}));