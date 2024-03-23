import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

export const checkJwtToken: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });

    try {
        const jwtData = JWTService.verify(token);
        req.headers.idUser = jwtData.toString();   

        return next();
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
    }
}