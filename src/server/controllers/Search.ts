import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { User } from '../models/User';

const searchUser = async (req: Request, res: Response) => {
    try {
        const { username, page = 1, limit = 10 } = req.body;
        const query = { username: { $regex: username, $options: "iu" } };

        const users = await User.find(query)
            .select('_id username')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const resPage = { 
            currentPage: Number(page),
            totalPages: Math.ceil((await User.find(query).countDocuments()) / Number(limit)),
            size: Number(users.length),
        };

        return res.status(StatusCodes.OK).json({ users, page: resPage });

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

export const searchHandler = { 
    searchUser 
};
