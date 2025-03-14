import express from 'express';
import authRoutes from '../../src/routes/authRoutes.js';
import * as authController from '../../src/controllers/authController.js';
import { isAuthenticated } from '../../src/middleware/auth.js';

// Mock the auth controller
jest.mock('../../src/controllers/authController.js', () => ({
  register: jest.fn((req, res) => res.status(201).json({ status: 'success' })),
  login: jest.fn((req, res) => res.status(200).json({ status: 'success' })),
  logout: jest.fn((req, res) => res.status(200).json({ status: 'success' })),
  getCurrentUser: jest.fn((req, res) => res.status(200).json({ status: 'success' })),
  updatePassword: jest.fn((req, res) => res.status(200).json({ status: 'success' }))
}));

// Mock the auth middleware
jest.mock('../../src/middleware/auth.js', () => ({
  isAuthenticated: jest.fn((req, res, next) => next())
}));

describe('Auth Routes', () => {
  let app;
  let mockRequest;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    
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

  describe('POST /api/auth/register', () => {
    it('should call register controller', () => {
      const { req, res, next } = mockRequest('POST', '/api/auth/register');
      req.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };
      
      // Find the register route handler
      const registerRoute = authRoutes.stack.find(
        layer => layer.route && layer.route.path === '/register' && layer.route.methods.post
      );
      
      registerRoute.handle(req, res, next);
      
      expect(authController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should call login controller', () => {
      const { req, res, next } = mockRequest('POST', '/api/auth/login');
      req.body = {
        username: 'testuser',
        password: 'password123'
      };
      
      // Find the login route handler
      const loginRoute = authRoutes.stack.find(
        layer => layer.route && layer.route.path === '/login' && layer.route.methods.post
      );
      
      loginRoute.handle(req, res, next);
      
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should use isAuthenticated middleware and call logout controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/auth/logout');
      
      // Find the logout route handler
      const logoutRoute = authRoutes.stack.find(
        layer => layer.route && layer.route.path === '/logout' && layer.route.methods.get
      );
      
      // Call all middleware in the stack
      for (const handler of logoutRoute.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(authController.logout).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should use isAuthenticated middleware and call getCurrentUser controller', () => {
      const { req, res, next } = mockRequest('GET', '/api/auth/me');
      
      // Find the me route handler
      const meRoute = authRoutes.stack.find(
        layer => layer.route && layer.route.path === '/me' && layer.route.methods.get
      );
      
      // Call all middleware in the stack
      for (const handler of meRoute.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(authController.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/auth/update-password', () => {
    it('should use isAuthenticated middleware and call updatePassword controller', () => {
      const { req, res, next } = mockRequest('PATCH', '/api/auth/update-password');
      req.body = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
        confirmNewPassword: 'newpassword'
      };
      
      // Find the update-password route handler
      const updatePasswordRoute = authRoutes.stack.find(
        layer => layer.route && layer.route.path === '/update-password' && layer.route.methods.patch
      );
      
      // Call all middleware in the stack
      for (const handler of updatePasswordRoute.route.stack) {
        handler.handle(req, res, next);
      }
      
      expect(isAuthenticated).toHaveBeenCalled();
      expect(authController.updatePassword).toHaveBeenCalled();
    });
  });
}); 