import Category from '../models/Category.js';
import Item from '../models/Item.js';
import { validateCategory } from '../utils/validation.js';

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.getById(id);
    
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all items in a category
export const getCategoryItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${id} not found`
      });
    }
    
    const items = await Item.getByCategoryId(id);
    
    res.status(200).json({
      status: 'success',
      results: items.length,
      data: {
        category,
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const errors = validateCategory(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    const newCategory = await Category.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${id} not found`
      });
    }
    
    const errors = validateCategory(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    const updatedCategory = await Category.update(id, req.body);
    
    res.status(200).json({
      status: 'success',
      data: {
        category: updatedCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if category exists
    const category = await Category.getById(id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: `Category with ID ${id} not found`
      });
    }
    
    await Category.delete(id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
