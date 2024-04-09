import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

export const suggestions = async (req: Request, res: Response) => {
    try {
        const userGenres = res.locals.user.genres;

        const suggestions = [];

        if (userGenres != null) {
            for (let genre of userGenres) {
                const movies = await Movie.find({ genres: genre }).limit(10).select('_id title thumbnail');
                const moviesWithScores = await Promise.all(movies.map(async movie => {
                    const score = await movie.getScore();
                    return { ...movie.toObject(), score };
                }));
                suggestions.push({ genreName: genre, movies: moviesWithScores });
            }
        }

        res.status(StatusCodes.OK).json({ suggestions });

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}