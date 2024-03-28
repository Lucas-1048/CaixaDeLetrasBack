import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services/JWTService";

export const checkJwtToken: RequestHandler = async (req, res, next) => {
    const token = req.cookies['access_token'];

    if (!token) return res.status(StatusCodes.FORBIDDEN).json({ 
        message: 'Access denied' 
    });

    const jwtData = JWTService.verify(token);

    if (jwtData === "JWT_SECRET_NOT_FOUND") {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'The JWT_SECRET was not defined'
        });
    } else if (jwtData === "INVALID_TOKEN") {
        return res.status(StatusCodes.FORBIDDEN).json({
            message: 'Token verification failed'
        });
    } else if (req.params.id !== String(jwtData.uid) && 
        String(jwtData.uid) !== process.env.ADMIN) {
            return res.status(StatusCodes.FORBIDDEN).json({ 
                message: 'Access denied' 
            });
    }
    return next();
};
