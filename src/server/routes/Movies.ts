import { Router } from 'express';
import { genres } from '../controllers/Genres';
import { suggestions } from '../controllers/Suggestions';

const router = Router();

router.get('/genres', genres);

router.get('/suggestions/:id', suggestions);

export { router as moviesRouter };