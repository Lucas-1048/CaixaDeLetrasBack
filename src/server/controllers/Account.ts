import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

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

export const accountHandler = {
    getPublicAccount,
    updateBio,
    setFavorite,
    updateFavorite,
}