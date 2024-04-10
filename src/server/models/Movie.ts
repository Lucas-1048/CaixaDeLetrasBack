import mongoose from 'mongoose';
import { Review } from './Review';

export interface IMovie {
    title: string,
    year: number,
    cast: string[],
    genres: string[],
    score?: number,
    extract?: string,
    thumbnail?: string,
}

interface IMovieMethods {
    updateScore(): number;
}

type MovieModel = mongoose.Model<IMovie, {}, IMovieMethods>;

const MovieSchema = new mongoose.Schema<IMovie, MovieModel, IMovieMethods>({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    cast: {type: [String], required: true},
    genres: {type: [String], required: true},
    score: {type: Number, default: 0},	
    extract: {type: String},
    thumbnail: {type: String},
});

MovieSchema.method('updateScore', async function updateScore() {
    return Review.find({movie: this._id}).then((reviews) => {
        if (reviews.length === 0) return 0;

        const total = reviews.reduce((acc, review) => acc + review.rating, 0);

        const score = total / reviews.length;

        this.score = score;

        this.markModified('score');
        
        this.save();
    });
});

export const Movie = mongoose.model<IMovie, MovieModel>('Movie', MovieSchema);
