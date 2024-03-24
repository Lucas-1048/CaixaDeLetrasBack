import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import { User } from "../models/User";

const checkParamId: RequestHandler = async (req, res ,next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User ID not found' });
    }
    
    res.locals.user = user;

    next();
}

const checkParamUsername : RequestHandler = async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Username not found' });
    }

    res.locals.user = user;

    next();
}

export const accountChecks = {
    checkParamId,
    checkParamUsername,
}