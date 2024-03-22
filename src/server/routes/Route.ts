import { Router } from 'express';
import { loginValidation} from '../middleware/LoginSchema';
import { validation } from '../middleware/BodyValidation';
import { signUpValidation, checkDuplicateEmail, checkDuplicateUsername } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';

export const router = Router();

router.post('/login', validation(loginValidation), login);

router.post('/signup', [validation(signUpValidation), checkDuplicateEmail, checkDuplicateUsername], signUp)