import express from 'express';
import { getProfileById, getProfile } from '../../controllers/user/profileController.js';

const userRouter = express.Router();

// Retorna perfil do tutor atráves do token
userRouter.get('/profile', getProfile);

// Rota protegida - retorna o perfil de um tutor por ID
userRouter.get('/:id', getProfileById);

export default userRouter;
