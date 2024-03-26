import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

export const checkJwtToken: RequestHandler = async (req, res, next) => {
    const token = req.cookies['access_token'];

    if (!token) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });

    try {
        const jwtData = JWTService.verify(token);

        req.headers.idUser = jwtData.toString();

        return next();
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
};
