import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryItems,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// GET all categories
router.get('/', getAllCategories);

// GET a specific category
router.get('/:id', getCategoryById);

// GET all items in a category
router.get('/:id/items', getCategoryItems);

// POST create a new category
router.post('/', createCategory);

// PUT update a category
router.put('/:id', updateCategory);

// DELETE a category
router.delete('/:id', deleteCategory);

export default router;
