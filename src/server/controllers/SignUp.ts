import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from "bcryptjs";
import { SignUpRequest } from '../middleware/VerifySignUp'; 

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response) => {
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
        return res.status(StatusCodes.CREATED).json({ 
            message: 'Signup successful' 
        })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    }
}