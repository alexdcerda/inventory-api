/**
 * @jest-environment node
 */

import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../../src/controllers/itemController.js';
import Item from '../../src/models/Item.js';
import Category from '../../src/models/Category.js';

// Mock the Item and Category models
jest.mock('../../src/models/Item.js', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/Category.js', () => ({
  getById: jest.fn()
}));

describe('Item Controller', () => {
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

  describe('getAllItems', () => {
    it('should get all items', async () => {
      const mockItems = [
        { id: 1, name: 'Smartphone', category_id: 1 },
        { id: 2, name: 'Laptop', category_id: 1 }
      ];
      
      Item.getAll.mockResolvedValue(mockItems);
      
      await getAllItems(req, res, next);
      
      expect(Item.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: 2,
        data: {
          items: mockItems
        }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Item.getAll.mockRejectedValue(error);
      
      await getAllItems(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getItemById', () => {
    it('should get an item by ID', async () => {
      const mockItem = { id: 1, name: 'Smartphone', category_id: 1 };
      req.params.id = 1;
      
      Item.getById.mockResolvedValue(mockItem);
      
      await getItemById(req, res, next);
      
      expect(Item.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          item: mockItem
        }
      });
    });

    it('should return 404 if item not found', async () => {
      req.params.id = 999;
      
      Item.getById.mockResolvedValue(null);
      
      await getItemById(req, res, next);
      
      expect(Item.getById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Item with ID 999 not found'
      });
    });
  });
});
