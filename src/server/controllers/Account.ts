import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { Review } from "../models/Review";
import 'dotenv/config';

const getPrivateAccount = async (_req: Request, res: Response) => {
    const user = res.locals.user;

    await user.populate('favorites');

    return res.status(StatusCodes.OK).json({
        username: user.username,
        email: user.email,
        birthDate: user.birthDate,
        gender: user.gender,
        genres: user.genres,
        profilePicturePath: user.profilePicturePath,
        biography: user.biography,
        favorites: user.favorites,
    });
}

const getPublicAccount = async (_req: Request, res: Response) => {
    const user = res.locals.user;

    await user.populate('favorites');    

    return res.status(StatusCodes.OK).json({
        username: user.username,
        gender: user.gender,
        biography: user.biography,
        favorites: user.favorites,
        profilePicturePath: process.env.SERVER_IP + ":" + process.env.PORT + "/avatar?username=" + user.username
    });
}

const deleteAccount = async (_req: Request, res: Response) => {
    const user = res.locals.user;

    await user.deleteOne();

    return res.status(StatusCodes.NO_CONTENT).send();
}

const updateBio = async (req: Request, res: Response) => {
    const user = res.locals.user;
    
    user.biography = req.body.biography;
    user.markModified('biography');
    
    await user.save();
    
    return res.status(StatusCodes.NO_CONTENT).send();
}

const setFavorite = async (_req: Request, res: Response) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    for(let i = 0; i < 4; i++) {
        if(user.favorites[i] === undefined) {
            user.favorites[i] = movie._id;
            user.markModified('favorites');
            break;
        }
        else if(i === 3) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                error: "User already has 4 favorites" 
            });
        }
    }
    await user.save();

    return res.status(StatusCodes.OK).json({ 
        message: "Favorite added successfully"
    });

}

const updateFavorite = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const movie = res.locals.movie;
    const pos = parseInt(req.query.pos as string);

    if(pos >= 4 || pos < 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Number must be an integer from 0 to 3" 
        })
    }

    if(user.favorites[pos] === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Favorite does not exist"
        });
    }

    user.favorites[pos] = movie._id;
    user.markModified('favorites');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();
}

const removeFavorite = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    let pos = -1;

    for (let i = 0; i < 4; i++) {
        console.log(user.favorites[i], " ", movie._id);
        if (movie._id.equals(user.favorites[i])) {
            pos = i;
        }
    }

    if (pos === -1) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Movie is not a favorite"
        });
    }

    user.favorites[pos] = undefined;

    for(let i = 0; i < 3; i++) {
        if(user.favorites[i] === undefined) {
            user.favorites[i] = user.favorites[i+1];
            user.favorites[i+1] = undefined;
        }
    }

    user.markModified('favorites');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();

}

const getReviews = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const { page = 1, limit = 10 } = req.body;

        let data = await Review.aggregate([
            { $match: { user: user._id } },
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * Number(limit) },
            { $limit: Number(limit) },
            { $lookup: { from: 'movies', localField: 'movie', foreignField: '_id', as: 'movie' } },
            { $unwind: '$movie' },
            { $project: { _id: 1, movie: { title: 1, thumbnail: 1 }, rating: 1, createdAt: 1, review: 1 } }
        ]);

        data = data.map((data) => {
            data.profilePicturePath = process.env.SERVER_IP + ":" + process.env.PORT + "/avatar?username=" + data.username;
            return data;
        })

        const resPage = { 
            currentPage: Number(page),
            totalPages: Math.ceil((await Review.find({user: user._id}).countDocuments()) / Number(limit)),
            size: Number(data.length),
        };

        return res.status(StatusCodes.OK).json({ reviews: data, page: resPage });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

const isFavorite = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const movie = res.locals.movie;

    if(user.favorites.includes(movie._id)) {
        return res.status(StatusCodes.OK).json({ isFavorite: true });
    }

    return res.status(StatusCodes.OK).json({ isFavorite: false });
}

export const accountHandler = {
    getReviews,
    isFavorite,
    getPrivateAccount,
    getPublicAccount,
    deleteAccount,
    updateBio,
    setFavorite,
    updateFavorite,
    removeFavorite,
}