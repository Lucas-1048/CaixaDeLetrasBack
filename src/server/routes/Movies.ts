import { Router } from 'express';
import { movieHandler } from '../controllers/Movie';
import { suggestions } from '../controllers/Suggestions';
import { checkJwtToken } from '../middleware/JWTAuth';
import { Checks } from '../middleware/Checks';
import { bodyValidation } from '../middleware/BodyValidation';
import { searchHandler } from '../controllers/Search';

const router = Router();

router.get('/genres', movieHandler.genres);

router.get('/searchMovie', [ bodyValidation(Checks.searchMovieValidation)], searchHandler.searchMovie);

router.get('/suggestions/:idUser', [ checkJwtToken, Checks.checkParamUserId ], suggestions);

router.get('/movie/:idMovie', [ Checks.checkParamMovieId ], movieHandler.getMovie);

router.get('/movie/review/:idMovie', [ Checks.checkParamMovieId ], movieHandler.getReviews);

export { router as moviesRouter };
