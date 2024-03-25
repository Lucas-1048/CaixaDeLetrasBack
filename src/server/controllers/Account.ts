import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { Request, Response } from "express";

export const getAccountInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        return res.json(user);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

const getPublicAccount = async (req: Request, res: Response) => {
    const user = res.locals.user;

    await user.populate('favorites');    

    return res.status(StatusCodes.OK).json({
        username: user.username,
        gender: user.gender,
        biography: user.biography,
        favorites: user.favorites,
    });
}

const updateBio = async (req: Request, res: Response) => {
    const user = res.locals.user;
    
    user.biography = req.body.biography;
    user.markModified('biography');
    
    await user.save();
    
    return res.status(StatusCodes.NO_CONTENT).send();
}

const updateFavorite = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const movie = res.locals.movie;
    const pos = parseInt(req.params.pos);
    
    if (!movie) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Movie ID not found" });
    }
    if(pos >= 4) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Number must be an integer from 0 to 3" })
    }

    user.favorites[pos] = movie._id;
    user.markModified('favorites');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();
}

export const accountHandler = {
    getAccountInfo,
    getPublicAccount,
    updateBio,
    updateFavorite,
}