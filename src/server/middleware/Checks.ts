import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { Review } from "../models/Review";
import mongoose from "mongoose";
import * as yup from 'yup';

interface IBio {
    biography: string;
}

const bioValidation: yup.ObjectSchema<IBio> = yup.object().shape({
    biography: yup.string().required(),
});

interface ISearchMovie {
    title: string;
    genres?: string[];
    cast?: string[];
    year?: number;
    page?: number;
    limit?: number;
};

const searchMovieValidation: yup.ObjectSchema<ISearchMovie> = yup.object().shape({
    title: yup.string().required(),
    genres: yup.array().of(yup.string().required()),
    cast: yup.array().of(yup.string().required()),
    year: yup.number().integer(),
    page: yup.number().integer().min(1),
    limit: yup.number().integer().min(1),
});

const checkParamUserId: RequestHandler = async (req, res ,next) => {
    const id = req.params.idUser;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: 'Invalid object ID format in parameters' 
        })
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'User ID not found' 
        });
    }
    
    res.locals.user = user;

    next();
} 

const checkQueryUsername : RequestHandler = async (req, res, next) => {
    const user = await User.findOne({ username: req.query.username as string });
    
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'Username not found' 
        });
    }

    res.locals.user = user;

    next();
}

const checkParamMovieId : RequestHandler = async (req, res, next) => {
    const id = req.params.idMovie;
    
    if (!mongoose.isValidObjectId(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: 'Invalid object ID format in parameters' 
        })
    }

    const movie = await Movie.findById(id);

    if(!movie) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'Movie not found'
        });
    }

    res.locals.movie = movie;

    next();
}

const checkBodyMovieId : RequestHandler = async(req, res, next) => {
    const id = req.body.movieId;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: 'Invalid object ID format for movieId' 
        })
    }

    const movie = await Movie.findById(id);

    if(!movie) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'Movie not found'
        });
    }

    res.locals.movie = movie;

    next();
}

const checkParamReviewId: RequestHandler = async (req, res, next) => {
    const id = req.params.reviewId;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: 'Invalid object ID format in parameters' 
        })
    }

    const review = await Review.findById(id);

    if (!review) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'Review ID not found' 
        });
    }
    
    res.locals.review = review;

    next();

}

export const Checks = {
    searchMovieValidation,
    bioValidation,
    checkParamUserId,
    checkQueryUsername,
    checkParamMovieId,
    checkBodyMovieId,
    checkParamReviewId,
}