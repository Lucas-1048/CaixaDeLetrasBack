import { Router } from 'express';
import { Checks } from '../middleware/Checks';
import { reviewHandler } from '../controllers/Review';
import { checkJwtToken } from '../middleware/JWTAuth';

export const reviewRouter = Router();

reviewRouter.post('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.createReview);

reviewRouter.delete('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.removeReview);

reviewRouter.put('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.putReview);