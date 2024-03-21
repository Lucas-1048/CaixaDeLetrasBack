import { StatusCodes } from 'http-status-codes';
import { Request, Response, RequestHandler } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from "bcryptjs";

export const signUp = async (req: Request<{}, {}, IUser>, res: Response) => {
    try {
        const user = new User({
            user: req.body.user,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        })
        await user.save()
        return res.status(StatusCodes.OK).json({ message: 'Signup successful' })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    }
}