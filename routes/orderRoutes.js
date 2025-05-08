import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  getUserOrderDetails,
  updateOrderStatus,
  deleteOrder,
  updateOrder
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();



// User routes
router.post('/', createOrder);

// All order routes require authentication
router.use(protect);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderDetails);
router.delete('/:id', deleteOrder);
router.post('/reference', updateOrder);

// Admin routes
router.get('/', restrictTo('admin'), getAllOrders);
router.get('/admin/:id', restrictTo('admin'), getUserOrderDetails);
router.patch('/:id/status', restrictTo('admin'), updateOrderStatus);

export default router;