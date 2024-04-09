import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const dataBaseErrorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val:any) => val.message);
            return res.status(StatusCodes.BAD_REQUEST).json({errors : messages})
        }
    }
    
    next(err);
};