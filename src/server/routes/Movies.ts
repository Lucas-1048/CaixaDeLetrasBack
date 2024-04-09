import { Router } from 'express';
import { genres } from '../controllers/Genres';
import { suggestions } from '../controllers/Suggestions';

export const router = Router();

router.get('/genres', genres);

router.get('/suggestions/:id', suggestions);