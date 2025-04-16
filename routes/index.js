import express from 'express';
import authRoutes from './auth/authRoutes.js';
import passRouter from './passRouter.js';
import tutorLocation from './user/location/tutorLocation.js';

import postsRoutes from './posts/postsRoutes.js';
import petRoutes from './pets/petRoutes.js';
import alertPets from './pets/alertPets.js';

import vaccinationRoutes from './pets/vaccination/vaccinationRoutes.js';
import medicalHistoryRoutes from './pets/medicalHistory/medicalHistoryRoutes.js';

import followRoutes from './follow/followRoutes.js';
import verifyToken from '../middlewares/verifyToken.js';

import userRouter from './user/profile.js';

const router = express.Router();

// Auth
router.use('/auth', authRoutes);

// Recuperação de senha
router.use('/r', verifyToken, passRouter);

// Tutor Location
router.use('/tutors', verifyToken, tutorLocation);

// Pet
router.use('', verifyToken, petRoutes);
router.use('', verifyToken, alertPets);

// Vacinas
router.use('', verifyToken, vaccinationRoutes);

// Histórico médico
router.use('', verifyToken, medicalHistoryRoutes);

// Posts
router.use('/api/posts', verifyToken, postsRoutes);

// Follow
router.use('/api/follow', verifyToken, followRoutes);

// Profile User/Tutors
router.use('/api/user', verifyToken, userRouter)

export default router;
