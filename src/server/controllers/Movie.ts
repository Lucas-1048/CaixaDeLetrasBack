import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

const genres = async (_req: Request, res: Response) => {
    try {
        const genres = await Movie.distinct('genres');
        return res.status(StatusCodes.OK).json({ genres });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

// This function follows from Checks.checkParamMovieId, so it assumes that
// res.locals.movie is defined and already set by the middleware, and that, if
// the movie doesn't exist, the middleware has already returned a 404 status.
const getMovie = (req: Request, res: Response) => {
    try {
        res.status(StatusCodes.OK).json(res.locals.movie);
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

export const movieHandler = {
    genres,
    getMovie
};