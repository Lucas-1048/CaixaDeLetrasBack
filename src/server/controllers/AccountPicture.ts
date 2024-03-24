import multer from 'multer'
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import path from 'path'

const storage = multer.diskStorage({
    destination: process.env.PROFILE_DEST,
    filename: (req, file, cb) => {
        cb(null,req.params.id + path.extname(file.originalname));
    } 
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: Number(process.env.PROFILE_MAXSIZE)},
});

const uploadProfile = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file uploaded' });
    }

    const user = res.locals.user;

    user.profilePicturePath = req.file.filename;
    user.markModified('profilePicturePath');

    await user.save();

    return res.status(StatusCodes.CREATED).json({ message: 'File uploaded succesfully' });
}

const getProfilePicture = async(req: Request, res: Response) => {
    const user = res.locals.user;

    return res.status(StatusCodes.OK).sendFile(`${process.env.PROFILE_DEST}${user.profilePicturePath}`, { root: '.' });
}

export const pictureHandler = {
    upload,
    uploadProfile,
    getProfilePicture,
}