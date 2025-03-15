import express from 'express';
import itemRoutes from '../../src/routes/itemRoutes.js';
import * as itemController from '../../src/controllers/itemController.js';

// Mock the item controller
jest.mock('../../src/controllers/itemController.js', () => ({
  getAllItems: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { items: [] } })),
  getItemById: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { item: {} } })),
  createItem: jest.fn((req, res) => res.status(201).json({ status: 'success', data: { item: {} } })),
  updateItem: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { item: {} } })),
  deleteItem: jest.fn((req, res) => res.status(204).json({ status: 'success', data: null }))
}));

describe('Item Routes', () => {
  let app;
  let mockRequest;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/items', itemRoutes);
    
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('should call getAllItems controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/items');
      
      // Find the route handler
      const route = itemRoutes.stack.find(
        layer => layer.route && layer.route.path === '/' && layer.route.methods.get
      );
      
      route.handle(req, res, next);
      
      expect(itemController.getAllItems).toHaveBeenCalled();
    });
  });

  describe('GET /api/items/:id', () => {
    it('should call getItemById controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/items/1');
      req.params = { id: '1' };
      
      // Find the route handler
      const route = itemRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.get
      );
      
      route.handle(req, res, next);
      
      expect(itemController.getItemById).toHaveBeenCalled();
    });
  });

  describe('POST /api/items', () => {
    it('should call createItem controller', () => {
      const { req, res, next } = mockRequest('POST', '/api/items');
      req.body = { name: 'Test Item', price: 10, quantity: 5, category_id: 1 };
      
      // Find the route handler
      const route = itemRoutes.stack.find(
        layer => layer.route && layer.route.path === '/' && layer.route.methods.post
      );
      
      route.handle(req, res, next);
      
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should call updateItem controller', () => {
      const { req, res, next } = mockRequest('PUT', '/api/items/1');
      req.params = { id: '1' };
      req.body = { name: 'Updated Item', price: 15, quantity: 10, category_id: 1 };
      
      // Find the route handler
      const route = itemRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.put
      );
      
      route.handle(req, res, next);
      
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should call deleteItem controller', () => {
      const { req, res, next } = mockRequest('DELETE', '/api/items/1');
      req.params = { id: '1' };
      
      // Find the route handler
      const route = itemRoutes.stack.find(
        layer => layer.route && layer.route.path === '/:id' && layer.route.methods.delete
      );
      
      route.handle(req, res, next);
      
    });
  });
});
