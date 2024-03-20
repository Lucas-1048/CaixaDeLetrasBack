import { Router } from 'express';
import { BodyValidator } from '../middleware/LoginValidation';
import { signUpBodyValidator, checkDuplicateEmail, checkDuplicateUsername } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { loginByEmailAndPassword } from '../controllers/Login';

export const router = Router();

router.post('/login', BodyValidator, loginByEmailAndPassword);

router.post('/signup', [signUpBodyValidator, checkDuplicateEmail, checkDuplicateUsername], signUp)