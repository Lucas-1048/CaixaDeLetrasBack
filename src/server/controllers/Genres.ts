import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Movie } from '../models/Movie';

export const genres = async (_req: Request, res: Response) => {
    try {
        const genres = await Movie.distinct('genres');
        return res.status(StatusCodes.OK).json({ genres });
    } catch (err: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}