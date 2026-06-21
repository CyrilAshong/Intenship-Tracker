import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', protect, me);

export default router;