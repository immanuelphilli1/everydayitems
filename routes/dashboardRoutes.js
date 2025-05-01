import express from 'express';
import { getDashboardStats, getRecentOrders, getRecentActivities } from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All dashboard routes require admin authentication
router.use(protect);
router.use(restrictTo('admin'));

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get recent orders
router.get('/orders/recent', getRecentOrders);

// Get recent activities
router.get('/activities', getRecentActivities);

export default router; 