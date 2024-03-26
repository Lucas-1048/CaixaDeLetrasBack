import multer from 'multer'
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: process.env.PROFILE_DEST,
    filename: (req, file, cb) => {
        const extensionName = path.extname(file.originalname)        
        cb(null,req.params.id + (extensionName == '.jpeg' ? '.jpg' : extensionName));
    } 
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: Number(process.env.PROFILE_MAXSIZE)},
    fileFilter: function(req, file, cb){
        const allowedFileExtensions = ['.jpg', '.jpeg'];
        const extension = path.extname(file.originalname).toLowerCase();
        if (!allowedFileExtensions.includes(extension)) {
            return cb(new Error('Only .jpg and .jpeg files are allowed'));
        }

        const allowedMimeTypes = ['image/jpeg', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only .jpeg and .jpg image mimetypes are allowed'));
        }

        cb(null, true);
    },
});

const uploadAvatar = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No file uploaded' });
    }

    const user = res.locals.user;

    user.profilePicturePath = req.file.filename;
    user.markModified('profilePicturePath');

    await user.save();

    return res.status(StatusCodes.NO_CONTENT).send();
}

const removeAvatar = async (req: Request, res: Response) => {
    const user = res.locals.user;

    if (!user.profilePicturePath) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User does not have an avatar' });
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

const getAvatar = async(req: Request, res: Response) => {
    const user = res.locals.user;

    const file = path.resolve(process.env.PROFILE_DEST!, user.profilePicturePath);
    res.status(StatusCodes.OK).sendFile(file, err => {
        if (err) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'User does not have an avatar' })
        }
    });
}

export const pictureHandler = {
    upload,
    uploadAvatar,
    removeAvatar,
    getAvatar,
}