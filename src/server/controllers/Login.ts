import { StatusCodes } from 'http-status-codes';
import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import { IUserLogin } from '../middleware/LoginValidation';
import bcrypt from "bcryptjs";

export const loginByEmailAndPassword = async (req: Request<{}, {}, IUserLogin>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
        
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    return res.status(StatusCodes.CREATED).json({ message: 'Login successful' });
};