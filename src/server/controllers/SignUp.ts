import { StatusCodes } from 'http-status-codes';
import { Request, Response, RequestHandler } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from "bcryptjs";

export const signUp = async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            genres: req.body.genres,
        })
        await user.save()
        return res.status(StatusCodes.CREATED).json({ message: 'Signup successful' })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    }
}