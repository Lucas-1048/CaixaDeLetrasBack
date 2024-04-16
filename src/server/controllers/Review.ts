import { Review } from "../models/Review";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    if (await Review.findOne({ user: user._id, movie: movie._id })) {
        return res.status(StatusCodes.CONFLICT).json({ error: "User ID already has a review of the specified movieID" });
    }

    try {
        const review = new Review({
            user: user._id,
            movie: movie._id,
            review: req.body.review,
            rating: req.body.rating,
        });

        await review.save();

        await movie.updateScore();

        return res.status(StatusCodes.CREATED).json({ review });
    } catch (err) {
        next(err)
    }
}

const removeReview = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    await Review.findOneAndDelete({ user: user._id, movie: movie._id });
    await movie.updateScore();

    return res.status(StatusCodes.NO_CONTENT).send()
}

const putReview = async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    let review = await Review.findOne({ user: user._id, movie: movie._id });
    
    try {
        if (!review) {
            review = new Review({
                user: user._id,
                movie: movie._id,
                review: req.body.review,
                rating: req.body.rating,
            });
        }
        else {
            review.review = req.body.review;
            review.rating = req.body.rating
            review.markModified('review');
            review.markModified('rating');
        }

        await review.save();
        await movie.updateScore();

        return res.status(StatusCodes.CREATED).json({ review });
    } catch (err) {
        next(err)
    }
}

const getReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = res.locals.review;
    await review.populate('user');
    const username = review.user.username;

    const result = {
        user: username,
        movieId: review.movie,
        review: review.review,
        rating: review.rating,
    }

    return res.status(StatusCodes.OK).send(result);
}

export const reviewHandler = {
    createReview,
    removeReview,
    putReview,
    getReview,
}