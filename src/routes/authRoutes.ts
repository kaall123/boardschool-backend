import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js'; // 1. Impor updateProfile
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', verifyToken, getMe);

// 📌 2. TAMBAHKAN RUTE EDIT PROFIL INI:
router.put('/profile', verifyToken, updateProfile);

export default router;