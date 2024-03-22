import { StatusCodes } from 'http-status-codes';
import { RequestHandler } from "express";
import * as yup from "yup";
import { JWTService } from '../services/JWTService';

export interface IUserLogin {
    email: string;
    password: string;
}

const loginValidation: yup.ObjectSchema<IUserLogin> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
});

const checkToken: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });

    try {
        const jwtData = JWTService.verify(token.toString());
        req.headers.idUser = jwtData.toString();   

        return next();
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
}

export const LoginSchema = {
    loginValidation,
    checkToken, 
}