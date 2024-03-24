import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import multer from 'multer';

export const fileErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code == 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File size too large' });
        }
    }

    next(err);
};