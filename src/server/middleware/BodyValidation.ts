import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';

type TValidation = (schema: yup.ObjectSchema<any>) => RequestHandler;

export const bodyValidation: TValidation = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
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