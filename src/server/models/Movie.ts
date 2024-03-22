import mongoose from 'mongoose';

export interface IMovie {
    title: string,
    year: number,
    cast: string[],
    genres: string[],
    extract?: string,
    thumbnail?: string,
}

const MovieSchema = new mongoose.Schema({
    title: {type: String, required: true},
    year: {type: Number, required: true},
    cast: {type: [String], required: true},
    genres: {type: [String], required: true},
    extract: {type: String},
    thumbnail: {type: String},
});

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
