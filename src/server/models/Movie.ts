import mongoose from 'mongoose';
import { Review } from './Review';

export interface IMovie {
    title: string,
    year: number,
    cast: string[],
    genres: string[],
    extract?: string,
    thumbnail?: string,
}

interface IMovieMethods {
    getScore(): number;
}

type MovieModel = mongoose.Model<IMovie, {}, IMovieMethods>;

const MovieSchema = new mongoose.Schema<IMovie, MovieModel, IMovieMethods>({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    cast: {type: [String], required: true},
    genres: {type: [String], required: true},
    extract: {type: String},
    thumbnail: {type: String},
});

MovieSchema.method('getScore', function getScore() {
    return Review.find({movie: this._id}).then((reviews) => {
        if (reviews.length === 0) return 0;

        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return total / reviews.length;
    });
});

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
