import { Router } from 'express';
import {
  postJob,
  fetchAllJobs,
  fetchJobById,
  fetchCompanyJobs,
  fetchCompanyPublicProfile,
  getJobMatchScore,
} from '../controllers/job.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', protect, fetchAllJobs);
router.get('/company/my-jobs', protect, restrictTo('COMPANY'), fetchCompanyJobs);
router.get('/company/:companyId', protect, fetchCompanyPublicProfile);
router.get('/:id/match', protect, restrictTo('STUDENT'), getJobMatchScore);
router.get('/:id', protect, fetchJobById);

// Company only routes
router.post('/', protect, restrictTo('COMPANY'), postJob);

export default router;