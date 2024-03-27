import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

const getAccountInfo = async (_req: Request, res: Response) => {
    try {
        return res.json(res.locals.user);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};

const getPublicAccount = async (_req: Request, res: Response) => {
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

    if(pos >= 4 || pos < 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: "Number must be an integer from 0 to 3" 
        })
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