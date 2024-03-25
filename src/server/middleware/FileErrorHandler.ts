import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import multer from 'multer';

export const fileErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code == 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File size too large' });
        }
        if (err.code == 'LIMIT_UNEXPECTED_FILE') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Unexpected field. Endpoint expects "avatar" containing the image.' })
        }
    }
    
    if (err.message.startsWith('Only .jpg')) {
        return res.status(415).json({ error : err.message })
    }

    next(err);
};