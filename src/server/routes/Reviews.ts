import { Router } from 'express';
import { Checks } from '../middleware/Checks';
import { reviewHandler } from '../controllers/Review';
import { checkJwtToken } from '../middleware/JWTAuth';

export const router = Router();

router.post('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.createReview);

router.delete('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.removeReview);

router.put('/review/:idUser', [checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId], reviewHandler.putReview);

router.get('/review/:reviewId', [Checks.checkParamReviewId], reviewHandler.getReview);

export { router as reviewsRouter } // Fix this line