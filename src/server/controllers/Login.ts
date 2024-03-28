import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from "bcryptjs";
import { JWTService } from '../services/JWTService';

interface IUserLogin {
    email: string;
    password: string;
}

export const login = async (req: Request<{}, {}, IUserLogin>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 
            message: 'Invalid email or password' 
        });
    }
        
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 
            message: 'Invalid email or password' 
        });
    }

    try {
        const accessToken = JWTService.sign({ uid: user._id });
        if(accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                error: 'Internal server error' 
            });
        }
        res.cookie('access_token', accessToken, { httpOnly: true });

        return res.status(StatusCodes.OK).json({ 
            message: 'Login successful', uid: user._id 
        });
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    }
};