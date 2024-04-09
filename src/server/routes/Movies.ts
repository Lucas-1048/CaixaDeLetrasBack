import { Router } from 'express';
import { genres } from '../controllers/Genres';
import { searchMovie } from '../controllers/SearchMovie';

export const router = Router();

router.get('/genres', genres);

router.get('/searchMovie:query', searchMovie);