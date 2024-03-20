import { Router } from 'express';
import { BodyValidator } from '../middleware/LoginValidation';
import { loginByEmailAndPassword } from '../controllers/Login';

export const router = Router();

router.post('/login', BodyValidator, loginByEmailAndPassword);