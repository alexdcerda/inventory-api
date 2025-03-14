import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
import { isAuthenticated, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can access
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes - only authenticated users can access
router.post('/', isAuthenticated, createItem);
router.put('/:id', isAuthenticated, updateItem);

// Admin-only routes
router.delete('/:id', isAuthenticated, restrictTo('admin'), deleteItem);

export default router;
