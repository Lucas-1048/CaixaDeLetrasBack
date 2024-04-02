import { Router } from 'express';
import { Checks } from '../middleware/Checks';
import { reviewHandler } from '../controllers/Review';
import { checkJwtToken } from '../middleware/JWTAuth';

export const reviewRouter = Router();

reviewRouter.post('/review/:idUser', [Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.createReview);