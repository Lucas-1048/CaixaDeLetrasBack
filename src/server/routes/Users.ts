import { Router } from 'express';
import { loginValidation } from '../middleware/LoginSchema';
import { bodyValidation } from '../middleware/BodyValidation';
import { VerifySignUp } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';
import { checkJwtToken } from '../middleware/JWTAuth';
import { account } from '../controllers/Account';
import { accountChecks } from '../middleware/AccountChecks';
import { pictureHandler } from '../controllers/AccountPicture';

export const router = Router();

router.post('/login', bodyValidation(loginValidation), login);

router.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp)

router.get('/user/:id', checkJwtToken, account);

router.post('/avatar/:id', [checkJwtToken, accountChecks.checkParamId, pictureHandler.upload.single('avatar')], pictureHandler.uploadProfile);

router.get('/avatar/:username', accountChecks.checkParamUsername, pictureHandler.getProfilePicture);