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

        return res.status(StatusCodes.CREATED).json({ review });

    } catch (err : any) {
        next(err)
    }
}


export const reviewHandler = {
    createReview,
}