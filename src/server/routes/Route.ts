import { Router } from 'express';
import { LoginSchema } from '../middleware/LoginAuth';
import { bodyValidation } from '../middleware/BodyValidation';
import { VerifySignUp } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';

export const router = Router();

router.post('/login', bodyValidation(LoginSchema.loginValidation), login);

router.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp)
