import { Router } from 'express';
import {
  uploadDoc,
  fetchStudentDocuments,
  removeDocument,
} from '../controllers/document.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Student only routes
router.post(
  '/upload',
  protect,
  restrictTo('STUDENT'),
  upload.single('file'),
  uploadDoc,
);

router.get(
  '/',
  protect,
  restrictTo('STUDENT'),
  fetchStudentDocuments,
);

router.delete(
  '/:id',
  protect,
  restrictTo('STUDENT'),
  removeDocument,
);

export default router;