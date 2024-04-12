import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export interface IReview {
    user: mongoose.Types.ObjectId;
    movie: mongoose.Types.ObjectId;
    review: string;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ReviewSchema = new mongoose.Schema({
    user: {type: ObjectId, ref:'User', required: true},
    movie: {type: ObjectId, ref:'Movie', required: true},
    review: {type: String, required: true},
    rating: {type: Number, required: true, min: 0, max: 5},
}, {timestamps: true});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
