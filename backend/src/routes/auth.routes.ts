import { Router } from 'express';
import { register, login, me, updateProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';



const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', protect, me);
router.patch('/profile', protect, restrictTo('STUDENT'), updateProfile);

export default router;