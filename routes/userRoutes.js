import express from 'express';
import { getUserStats, getAllUser, getUserDetails } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user statistics
router.get('/', protect, restrictTo('admin'), getAllUser);
router.get('/stats', protect, restrictTo('admin'), getUserStats);
router.get('/:id', protect, restrictTo('admin'), getUserDetails);

export default router;