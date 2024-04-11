import { Router } from 'express';
import { genres } from '../controllers/Genres';
import { searchMovie } from '../controllers/SearchMovie';
import { suggestions } from '../controllers/Suggestions';
import { checkJwtToken } from '../middleware/JWTAuth';
import { Checks } from '../middleware/Checks';

const router = Router();

router.get('/genres', genres);

router.get('/searchMovie', searchMovie);

router.get('/suggestions/:idUser', [ checkJwtToken, Checks.checkParamUserId ], suggestions);

export { router as moviesRouter };
