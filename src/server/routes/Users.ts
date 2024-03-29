import { Router } from 'express';
import { bodyValidation } from '../middleware/BodyValidation';
import { VerifySignUp } from '../middleware/VerifySignUp';
import { signUp } from '../controllers/SignUp'
import { login } from '../controllers/Login';
import { checkJwtToken } from '../middleware/JWTAuth';
import { accountHandler } from '../controllers/Account';
import { Checks } from '../middleware/Checks';
import { upload } from '../middleware/FileExtension';
import { pictureHandler } from '../controllers/Avatar';

export const router = Router();

router.post('/login', login);

router.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp);

router.put('/avatar/:id', [ checkJwtToken, Checks.checkParamUserId, upload.single('avatar') ],
    pictureHandler.uploadAvatar);

router.delete('/avatar/:id', [ checkJwtToken, Checks.checkParamUserId ], pictureHandler.removeAvatar);

router.get('/avatar/:username', [ checkJwtToken, Checks.checkParamUsername ], pictureHandler.getAvatar);

router.get('/profile/:username', [ checkJwtToken, Checks.checkParamUsername ], accountHandler.getPublicAccount);

router.put('/bio/:id', [ checkJwtToken, Checks.checkParamUserId ], accountHandler.updateBio);

router.post('/favorites/:id', [ checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId ],
    accountHandler.setFavorite);

router.put('/favorites/:id/:pos', [ checkJwtToken, Checks.checkParamUserId, Checks.checkBodyMovieId ], 
    accountHandler.updateFavorite);