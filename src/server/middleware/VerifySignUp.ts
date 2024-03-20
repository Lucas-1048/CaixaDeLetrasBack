import { StatusCodes } from "http-status-codes";
import { IUser, User } from '../models/User'
import { RequestHandler } from "express";
import * as yup from "yup";

const signUpValidation: yup.ObjectSchema<IUser> = yup.object().shape({
    user: yup.string().required().min(4).max(20),
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
});

export const checkDuplicateEmail : RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).exec();
        if (user) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'e-mail already registered' })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }

    return next();
}

export const checkDuplicateUsername : RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({user: req.body.user}).exec();
        if (user) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'username already registered' })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
    }

    return next();
}

export const signUpBodyValidator : RequestHandler = async (req, res, next) => {
    try {
        await signUpValidation.validate(req.body, { abortEarly: false });
        return next();
    } catch (err) {
        const yupError = err as yup.ValidationError;

        const errors: Record<string, string> = {};
        yupError.inner.forEach(error => {
            if (!error.path) return;
            errors[error.path] = error.message;
        });
        return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }
}
//Function above might be worth to refactor along with ./LoginValidation.ts/BodyValidator