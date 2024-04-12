import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { Review } from '../models/Review';
import { readdirSync } from 'fs';

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

const getReviews = async (req: Request, res: Response) => {
    try {

        const { limit = 10, page = 1 } = req.body;

        const reviews = await Review.aggregate([
            { $match: { movie: res.locals.movie._id } },
            { $sort: { createdAt: -1 } },
            { $skip: Number(page) * Number(limit) },
            { $limit: Number(limit) },
            { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 1, username: '$user.username', review: 1, rating: 1, createdAt: 1 } }
        ]);

        const resPage = {
            currentPage: Number(req.query.page),
            totalPages: Math.ceil(await Review.find({ movie: res.locals.movie._id }).countDocuments()) / Number(limit),
            size: Number(reviews.length),
        };
        return res.status(StatusCodes.OK).json({ reviews, page: resPage });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

export const movieHandler = {
    getReviews,
    genres,
    getMovie
};