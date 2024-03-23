import { Router } from 'express';
import { BodyValidator } from '../middleware/LoginSchema';
import { signUpBodyValidator, checkDuplicateEmail, checkDuplicateUsername } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';

export const router = Router();

router.post('/login', BodyValidator, login);

router.post('/signup', [signUpBodyValidator, checkDuplicateEmail, checkDuplicateUsername], signUp)