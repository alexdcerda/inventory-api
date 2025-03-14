import express from 'express';
import categoryRoutes from '../../src/routes/categoryRoutes.js';
import * as categoryController from '../../src/controllers/categoryController.js';
import { isAuthenticated, restrictTo } from '../../src/middleware/auth.js';

// Mock the category controller
jest.mock('../../src/controllers/categoryController.js', () => ({
  getAllCategories: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { categories: [] } })),
  getCategoryById: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { category: {} } })),
  getCategoryItems: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { items: [] } })),
  createCategory: jest.fn((req, res) => res.status(201).json({ status: 'success', data: { category: {} } })),
  updateCategory: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { category: {} } })),
  deleteCategory: jest.fn((req, res) => res.status(204).json({ status: 'success', data: null }))
}));

// Mock the auth middleware
jest.mock('../../src/middleware/auth.js', () => ({
  isAuthenticated: jest.fn((req, res, next) => next()),
  restrictTo: jest.fn(() => (req, res, next) => next())
}));

describe('Category Routes', () => {
  let app;
  let mockRequest;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/categories', categoryRoutes);
    
    // Create a simple mock for request
    mockRequest = (method, url) => {
      const req = { method, url };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();
      
      return { req, res, next };
    };
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should call getAllCategories controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/categories');
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/' && layer.route.methods.get
      );
      
      route.handle(req, res, next);
      
      expect(categoryController.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should call getCategoryById controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/categories/1');
      req.params = { id: '1' };
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.get
      );
      
      route.handle(req, res, next);
      
      expect(categoryController.getCategoryById).toHaveBeenCalled();
    });
  });

  describe('GET /api/categories/:id/items', () => {
    it('should call getCategoryItems controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/categories/1/items');
      req.params = { id: '1' };
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id/items' && layer.route.methods.get
      );
      
      route.handle(req, res, next);
      
      expect(categoryController.getCategoryItems).toHaveBeenCalled();
    });
  });

  describe('POST /api/categories', () => {
    it('should use isAuthenticated middleware and call createCategory controller', () => {
      const { req, res, next } = mockRequest('POST', '/api/categories');
      req.body = { name: 'Test Category', description: 'Test Description' };
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/' && layer.route.methods.post
      );
      
      // Call all middleware in the stack
      for (const handler of route.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(categoryController.createCategory).toHaveBeenCalled();
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should use isAuthenticated middleware and call updateCategory controller', () => {
      const { req, res, next } = mockRequest('PUT', '/api/categories/1');
      req.params = { id: '1' };
      req.body = { name: 'Updated Category', description: 'Updated Description' };
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.put
      );
      
      // Call all middleware in the stack
      for (const handler of route.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(categoryController.updateCategory).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should use isAuthenticated and restrictTo middleware and call deleteCategory controller', () => {
      const { req, res, next } = mockRequest('DELETE', '/api/categories/1');
      req.params = { id: '1' };
      
      // Find the route handler
      const route = categoryRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.delete
      );
      
      // Call all middleware in the stack
      for (const handler of route.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(restrictTo).toHaveBeenCalledWith('admin');
      expect(categoryController.deleteCategory).toHaveBeenCalled();
    });
  });
});
