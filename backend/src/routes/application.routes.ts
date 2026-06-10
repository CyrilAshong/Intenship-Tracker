import { Router } from 'express';
import {
  applyForJob,
  fetchStudentApplications,
  fetchApplicationById,
  fetchJobApplications,
} from '../controllers/application.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

// Student routes
router.post('/', protect, restrictTo('STUDENT'), applyForJob);
router.get('/my-applications', protect, restrictTo('STUDENT'), fetchStudentApplications);
router.get('/:id', protect, fetchApplicationById);

// Company routes
router.get('/job/:jobId', protect, restrictTo('COMPANY'), fetchJobApplications);

export default router;