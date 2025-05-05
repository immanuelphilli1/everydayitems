import express from 'express';
import { getUserStats } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user statistics
router.get('/stats', protect,restrictTo('admin'), getUserStats);

export default router;