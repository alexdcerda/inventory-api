import {
  register,
  login,
  logout,
  getCurrentUser,
  updatePassword
} from '../../src/controllers/authController.js';
import User from '../../src/models/User.js';
import passport from 'passport';

// Mock the User model
jest.mock('../../src/models/User.js', () => ({
  findByUsername: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  verifyPassword: jest.fn(),
  updatePassword: jest.fn()
}));

// Mock passport
jest.mock('passport', () => ({
  authenticate: jest.fn(() => jest.fn())
}));

describe('Auth Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      login: jest.fn((user, callback) => callback()),
      logout: jest.fn((callback) => callback()),
      user: { id: 1, username: 'testuser' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      req.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };
      
      User.findByUsername.mockResolvedValue(null);
      User.findByEmail.mockResolvedValue(null);
      
      const newUser = {
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
        role: 'user'
      };
      
      User.create.mockResolvedValue(newUser);
      
      await register(req, res, next);
      
      expect(User.findByUsername).toHaveBeenCalledWith('newuser');
      expect(User.findByEmail).toHaveBeenCalledWith('new@example.com');
      expect(User.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      });
      expect(req.login).toHaveBeenCalledWith(newUser, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: newUser
        }
      });
    });
    
    it('should return validation errors', async () => {
      req.body = {
        username: 'a', // too short
        email: 'invalid-email',
        password: 'short',
        passwordConfirm: 'different'
      };
      
      await register(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: expect.any(Array)
      });
      expect(User.create).not.toHaveBeenCalled();
    });
    
    it('should handle existing username', async () => {
      req.body = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };
      
      User.findByUsername.mockResolvedValue({ id: 3, username: 'existinguser' });
      
      await register(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Username already in use'
      });
      expect(User.create).not.toHaveBeenCalled();
    });
    
    it('should handle existing email', async () => {
      req.body = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      };
      
      User.findByUsername.mockResolvedValue(null);
      User.findByEmail.mockResolvedValue({ id: 3, email: 'existing@example.com' });
      
      await register(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Email already in use'
      });
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should validate login input', () => {
      req.body = {};
      
      login(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation error',
        errors: expect.any(Array)
      });
      expect(passport.authenticate).not.toHaveBeenCalled();
    });
    
    it('should call passport authenticate', () => {
      req.body = {
        username: 'testuser',
        password: 'password123'
      };
      
      login(req, res, next);
      
      expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function));
    });
  });

  describe('logout', () => {
    it('should log out the user', () => {
      logout(req, res);
      
      expect(req.logout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', () => {
      getCurrentUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: req.user
        }
      });
    });
    
    it('should return 401 if not logged in', () => {
      req.user = null;
      
      getCurrentUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'You are not logged in'
      });
    });
  });
}); 