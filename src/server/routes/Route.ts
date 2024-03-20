import { Router } from 'express';
import { BodyValidator } from '../middleware/Validation';
import { getById } from '../controllers/GetById';

export const router = Router();

router.post('/login', BodyValidator, getById);