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

export const userRouter = Router();

userRouter.post('/login', login);

userRouter.post('/signup', [ bodyValidation(VerifySignUp.signUpValidation), 
    VerifySignUp.checkDuplicateEmail, VerifySignUp.checkDuplicateUsername ], signUp);

userRouter.put('/avatar/:idUser', [ checkJwtToken, Checks.checkParamUserId, upload.single('avatar') ],
    pictureHandler.uploadAvatar);

userRouter.delete('/avatar/:idUser', [ checkJwtToken, Checks.checkParamUserId ], pictureHandler.removeAvatar);

userRouter.get('/avatar/', Checks.checkQueryUsername, pictureHandler.getAvatar);

userRouter.get('/profile/', Checks.checkQueryUsername, accountHandler.getPublicAccount);

userRouter.get('/profile/:idUser', [ checkJwtToken, Checks.checkParamUserId ], accountHandler.getPrivateAccount);

userRouter.delete('/profile/:idUser', [ checkJwtToken, Checks.checkParamUserId ], accountHandler.deleteAccount);

userRouter.put('/bio/:idUser', [ checkJwtToken, Checks.checkParamUserId, bodyValidation(Checks.bioValidation) ], 
    accountHandler.updateBio);

userRouter.post('/favorites/:idUser/:idMovie', [ checkJwtToken, Checks.checkParamUserId, Checks.checkParamMovieId ],
    accountHandler.setFavorite);

userRouter.put('/favorites/:idUser/:idMovie', [ checkJwtToken, Checks.checkParamUserId, Checks.checkParamMovieId ], 
    accountHandler.updateFavorite);

userRouter.delete('/favorites/:idUser/:idMovie', [ checkJwtToken, Checks.checkParamUserId, Checks.checkParamMovieId ],
    accountHandler.removeFavorite);
