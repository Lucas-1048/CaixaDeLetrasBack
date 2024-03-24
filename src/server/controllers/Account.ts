import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
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

    return res.status(StatusCodes.OK).json({
        username: user.username,
        gender: user.gender,
        biography: user.biography,
    });
}

export const accountHandler = {
    getAccountInfo,
    getPublicAccount,
}