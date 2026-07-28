import { Router } from 'express';
import {
  getDashboard,
  getStudents,
  updateStudentVerification,
  getCompanies,
  updateCompanyVerification,
  toggleUserStatus,
  getJobs,
  toggleJobStatus,
  getApplications,
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';

const router = Router();

// All admin routes are protected and restricted to ADMIN role
router.use(protect);
router.use(restrictTo('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboard);

// Student management
router.get('/students', getStudents);
router.patch('/students/:userId/verify', updateStudentVerification);
router.patch('/users/:userId/status', toggleUserStatus);

// Company management
router.get('/companies', getCompanies);
router.patch('/companies/:userId/verify', updateCompanyVerification);

// Job management
router.get('/jobs', getJobs);
router.patch('/jobs/:jobId/status', toggleJobStatus);

// Application management
router.get('/applications', getApplications);

export default router;