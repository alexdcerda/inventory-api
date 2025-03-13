import Item from '../models/Item.js';
import Category from '../models/Category.js';
import { validateItem } from '../utils/validation.js';

// Get all items
export const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.getAll();
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get an item by ID
export const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.getById(id);
    
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: `Item with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new item
export const createItem = async (req, res, next) => {
  try {
    const errors = validateItem(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    // Check if category exists
    const category = await Category.getById(req.body.category_id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${req.body.category_id} not found`
      });
    }
    
    const newItem = await Item.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        item: newItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update an item
export const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if item exists
    const item = await Item.getById(id);
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: `Item with ID ${id} not found`
      });
    }
    
    const errors = validateItem(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    // Check if category exists
    const category = await Category.getById(req.body.category_id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${req.body.category_id} not found`
      });
    }
    
    const updatedItem = await Item.update(id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if item exists
    const item = await Item.getById(id);
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: `Item with ID ${id} not found`
      });
    }
    
    await Item.delete(id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
