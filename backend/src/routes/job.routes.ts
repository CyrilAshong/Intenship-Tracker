import { Router } from 'express';
import {
  postJob,
  fetchAllJobs,
  fetchJobById,
  fetchCompanyJobs,
} from '../controllers/job.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', protect, fetchAllJobs);
router.get('/:id', protect, fetchJobById);

// Company only routes
router.post('/', protect, restrictTo('COMPANY'), postJob);
router.get('/company/my-jobs', protect, restrictTo('COMPANY'), fetchCompanyJobs);

export default router;