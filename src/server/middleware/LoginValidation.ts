import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import * as yup from "yup";

export interface IUserLogin {
    email: string;
    password: string;
}

export const userValidation: yup.ObjectSchema<IUserLogin> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
});

export const BodyValidator: RequestHandler = async (req, res, next) => {
    try {
        await userValidation.validate(req.body, { abortEarly: false });
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
};