import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { User } from '../models/User';

export const suggestions = async (req: Request, res: Response) => {
    try {
        const userGenres = await User.findById(req.params.id).select('genres');

        const suggestions = [];

        if (userGenres != null) for (let genre of userGenres.genres) {
            const movies = await Movie.find({ genres: genre }).limit(10).select('_id title thumbnail');
            suggestions.push({ genreName: genre, movies });
        }

        res.status(StatusCodes.OK).json({ suggestions });

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}