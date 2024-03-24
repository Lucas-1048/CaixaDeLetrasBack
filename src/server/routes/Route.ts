import { Router } from 'express';
import { loginValidation } from '../middleware/LoginSchema';
import { bodyValidation } from '../middleware/BodyValidation';
import { VerifySignUp } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';
import { genres } from '../controllers/Genres';
import { checkJwtToken } from '../middleware/JWTAuth';
import { account } from '../controllers/Account';

export const router = Router();

router.post('/login', bodyValidation(loginValidation), login);

router.get('/genres', genres);

router.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp)

router.get('/user/:id', checkJwtToken, account);
