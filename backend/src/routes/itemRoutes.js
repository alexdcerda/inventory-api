import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

const router = express.Router();

// GET all items
router.get('/', getAllItems);

// GET a specific item
router.get('/:id', getItemById);

// POST create a new item
router.post('/', createItem);

// PUT update an item
router.put('/:id', updateItem);

// DELETE an item
router.delete('/:id', deleteItem);

export default router;
