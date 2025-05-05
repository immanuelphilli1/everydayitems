import express from 'express';
import { getUserStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// Get user statistics
router.get('/stats', getUserStats);

export default router;