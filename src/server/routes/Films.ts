import { Router } from 'express';
import { genres } from '../controllers/Genres';

export const router = Router();

router.get('/genres', genres);