import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'

const uploadAvatar = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ 
            error: 'No file uploaded' 
        });
    }

    const user = res.locals.user;

    user.profilePicturePath = req.file.filename;
    user.markModified('profilePicturePath');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();
}

const removeAvatar = async (_req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user.profilePicturePath) {
        return res.status(StatusCodes.NOT_FOUND).json({ 
            error: 'User does not have an avatar' 
        });
    }

    fs.unlink(process.env.PROFILE_DEST + user.profilePicturePath, err => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
        }
    })

    user.profilePicturePath = '';
    user.markModified('profilePicturePath');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();
}

const getAvatar = async(_req: Request, res: Response) => {
    const user = res.locals.user;

    const file = path.resolve(process.env.PROFILE_DEST!, user.profilePicturePath);
    res.status(StatusCodes.OK).sendFile(file, err => {
        if (err) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                error: 'User does not have an avatar' 
            })
        }
    });
}

export const pictureHandler = {
    uploadAvatar,
    removeAvatar,
    getAvatar,
}