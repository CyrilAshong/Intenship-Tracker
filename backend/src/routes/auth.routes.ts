import { Router } from 'express';
import {
  register,
  login,
  me,
  verify,
  resendOTPHandler,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verify);
router.post('/resend-otp', resendOTPHandler);

// Protected route
router.get('/me', protect, me);

export default router;
