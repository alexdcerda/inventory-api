import request from 'supertest';
import express from 'express';
import categoryRoutes from '../../src/routes/categoryRoutes.js';
import * as categoryController from '../../src/controllers/categoryController.js';

// Mock the category controller
jest.mock('../../src/controllers/categoryController.js', () => ({
  getAllCategories: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { categories: [] } })),
  getCategoryById: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { category: {} } })),
  getCategoryItems: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { items: [] } })),
  createCategory: jest.fn((req, res) => res.status(201).json({ status: 'success', data: { category: {} } })),
  updateCategory: jest.fn((req, res) => res.status(200).json({ status: 'success', data: { category: {} } })),
  deleteCategory: jest.fn((req, res) => res.status(204).json({ status: 'success', data: null }))
}));

describe('Category Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/categories', categoryRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should call getAllCategories controller', async () => {
      await request(app).get('/api/categories');
      expect(categoryController.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should call getCategoryById controller', async () => {
      await request(app).get('/api/categories/1');
      expect(categoryController.getCategoryById).toHaveBeenCalled();
    });
  });

  describe('GET /api/categories/:id/items', () => {
    it('should call getCategoryItems controller', async () => {
      await request(app).get('/api/categories/1/items');
      expect(categoryController.getCategoryItems).toHaveBeenCalled();
    });
  });

  describe('POST /api/categories', () => {
    it('should call createCategory controller', async () => {
      await request(app)
        .post('/api/categories')
        .send({ name: 'Test Category', description: 'Test Description' });
      expect(categoryController.createCategory).toHaveBeenCalled();
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should call updateCategory controller', async () => {
      await request(app)
        .put('/api/categories/1')
        .send({ name: 'Updated Category', description: 'Updated Description' });
      expect(categoryController.updateCategory).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should call deleteCategory controller', async () => {
      await request(app).delete('/api/categories/1');
      expect(categoryController.deleteCategory).toHaveBeenCalled();
    });
  });
});
