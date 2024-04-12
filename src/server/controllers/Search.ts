import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { Movie } from '../models/Movie';

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

export const searchMovie = async (req: Request, res: Response) => {
    try {
        const { title, genres, cast, year, page = 1, limit = 10 } = req.body;
        const query = {} as any;
        query.title = { $regex: title, $options: 'iu' };
        if (genres) {
            query.genres = { $all: genres };
        }
        if (cast) {
            query.cast = { $all: cast };
        }
        if (year) {
            query.year = year;
        }

        const movies = await Movie.find(query)
            .sort({ score: -1 })
            .select('title thumbnail score _id')
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const resPage = { 
            currentPage: Number(page),
            totalPages: Math.ceil((await Movie.find(query).countDocuments()) / Number(limit)),
            size: Number(movies.length),
        };

        return res.status(StatusCodes.OK).json({ movies, page: resPage });

    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
}

export const searchHandler = { 
    searchUser,
    searchMovie
};
