import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { Request, Response } from "express";

export const account = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        return res.json(user);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
};