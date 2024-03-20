import { StatusCodes } from 'http-status-codes';
import { Request, Response, RequestHandler } from 'express';
import { User, IUser } from '../models/User';

export const signUp = async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
        const user = new User(req.body)
        await user.save()
        return res.status(StatusCodes.OK).json({ message: 'Signup successful' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    }
}