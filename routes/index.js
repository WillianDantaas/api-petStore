import express from 'express';
import authRoutes from './authRoutes.js';
import passRouter from './passRouter.js';
import tutorLocation from './tutorLocation.js';

import postsRoutes from './posts/postsRoutes.js';
import petRoutes from './pets/petRoutes.js';
import alertPets from './pets/alertPets.js';

import vaccinationRoutes from './vaccinationRoutes.js';
import medicalHistoryRoutes from './medicalHistoryRoutes.js';

import followRoutes from './follow/followRoutes.js';
import verifyToken from '../middlewares/verifyToken.js';

import userRouter from './user/profile.js';

const router = express.Router();

// Auth
router.use('/auth', authRoutes);

// Recuperação de senha
router.use('/r', passRouter);

// Tutor Location
router.use('/tutors', tutorLocation);

// Pet
router.use('', petRoutes);
router.use('', alertPets);

// Vacinas
router.use('', vaccinationRoutes);

// Histórico médico
router.use('', medicalHistoryRoutes);

// Posts
router.use('/api/posts', postsRoutes);

// Follow
router.use('/api/follow', verifyToken, followRoutes);

// Profile User/Tutors
router.use('/api/user', verifyToken, userRouter)

export default router;
