import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import mongoose from "mongoose";
import * as yup from 'yup';

interface IBio {
    biography: string;
}

const bioValidation: yup.ObjectSchema<IBio> = yup.object().shape({
    biography: yup.string().required(),
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

export const Checks = {
    bioValidation,
    checkParamUserId,
    checkQueryUsername,
    checkParamMovieId,
    checkBodyMovieId,
}