import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryItems,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { isAuthenticated, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can access
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:id/items', getCategoryItems);

// Protected routes - only authenticated users can access
router.post('/', isAuthenticated, createCategory);
router.put('/:id', isAuthenticated, updateCategory);

// Admin-only routes
router.delete('/:id', isAuthenticated, restrictTo('admin'), deleteCategory);

export default router;
