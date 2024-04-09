import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

// Criar Middleware para sanitizar a query

export const searchMovie = async (req: Request, res: Response) => {
    try {
        const { genres, cast, year, page = 1, limit = 10 } = req.query;
        const query = {} as any;
        query.title = { $regex: req.params.title, $options: 'iu' };
        if (genres) {
            query.genres = genres;
        }
        if (cast) {
            query.cast = cast;
        }
        if (year) {
            query.year = year;
        }
        const movies = await Movie.find(query)
            .select('title thumbnail _id')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        return res.status(StatusCodes.OK).json({ movies });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}