import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';

interface IUserLogin {
    user: string;
    email: string;
    password: string;
}

export const userValidation: yup.ObjectSchema<IUserLogin> = yup.object().shape({
    user: yup.string().required().min(2).max(20),
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
});

export const getById = async (req: Request<{}, {}, IUserLogin>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    if (user.password !== req.body.password) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    return res.status(StatusCodes.OK).json({ message: 'Login successful' });
};