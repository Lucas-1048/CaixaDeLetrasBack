import { Router } from 'express';
import { loginValidation } from '../middleware/LoginSchema';
import { bodyValidation } from '../middleware/BodyValidation';
import { VerifySignUp } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';
import { checkJwtToken } from '../middleware/JWTAuth';
import { accountHandler } from '../controllers/Account';
import { Checks } from '../middleware/Checks';
import { pictureHandler } from '../controllers/AccountPicture';

export const router = Router();

router.post('/login', bodyValidation(loginValidation), login);

router.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp)

router.get('/user/:id', checkJwtToken, accountHandler.getAccountInfo);

router.put('/avatar/:id', [checkJwtToken, Checks.checkParamId, pictureHandler.upload.single('avatar')], pictureHandler.uploadAvatar);

router.delete('/avatar/:id', [checkJwtToken, Checks.checkParamId], pictureHandler.removeAvatar);

router.get('/avatar/:username', Checks.checkParamUsername, pictureHandler.getAvatar);

router.get('/profile/:username', Checks.checkParamUsername, accountHandler.getPublicAccount);

router.put('/bio/:id', [checkJwtToken, Checks.checkParamId], accountHandler.updateBio)