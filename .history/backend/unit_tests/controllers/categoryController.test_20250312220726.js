import {
  getAllCategories,
  getCategoryById,
  getCategoryItems,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../src/controllers/categoryController.js';
import Category from '../../src/models/Category.js';
import Item from '../../src/models/Item.js';

// Mock the Category and Item models
jest.mock('../../src/models/Category.js');
jest.mock('../../src/models/Item.js');

describe('Category Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Clothing' }
      ];
      
      Category.getAll.mockResolvedValue(mockCategories);
      
      await getAllCategories(req, res, next);
      
      expect(Category.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: {
          categories: mockCategories
        }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Category.getAll.mockRejectedValue(error);
      
      await getAllCategories(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getCategoryById', () => {
    it('should get a category by ID', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      req.params.id = 1;
      
      Category.getById.mockResolvedValue(mockCategory);
      
      await getCategoryById(req, res, next);
      
      expect(Category.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          category: mockCategory
        }
      });
    });

    it('should return 404 if category not found', async () => {
      req.params.id = 999;
      
      Category.getById.mockResolvedValue(null);
      
      await getCategoryById(req, res, next);
      
      expect(Category.getById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Category with ID 999 not found'
      });
    });
  });

  describe('getCategoryItems', () => {
    it('should get all items in a category', async () => {
      const mockCategory = { id: 1, name: 'Electronics' };
      const mockItems = [
        { id: 1, name: 'Smartphone', category_id: 1 },
        { id: 2, name: 'Laptop', category_id: 1 }
      ];
      
      req.params.id = 1;
      
      Category.getById.mockResolvedValue(mockCategory);
      Item.getByCategoryId.mockResolvedValue(mockItems);
      
      await getCategoryItems(req, res, next);
      
      expect(Category.getById).toHaveBeenCalledWith(1);
      expect(Item.getByCategoryId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: {
          category: mockCategory,
          items: mockItems
        }
      });
    });

    it('should return 404 if category not found', async () => {
      req.params.id = 999;
      
      Category.getById.mockResolvedValue(null);
      
      await getCategoryItems(req, res, next);
      
      expect(Category.getById).toHaveBeenCalledWith(999);
      expect(Item.getByCategoryId).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Category with ID 999 not found'
      });
    });
  });
});
