import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { IUserLogin } from '../middleware/LoginAuth';
import bcrypt from "bcryptjs";
import { JWTService } from '../services/JWTService';

export const login = async (req: Request<{}, {}, IUserLogin>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
        
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }

    try {
        const accessToken = JWTService.sign({ uid: user._id });
        if(accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }

        return res.status(StatusCodes.OK).json({ message: 'Login successful' });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
};