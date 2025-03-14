import { isAuthenticated, restrictTo } from '../../src/middleware/auth.js';

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      isAuthenticated: jest.fn(),
      user: {
        id: 1,
        username: 'testuser',
        role: 'user'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('isAuthenticated', () => {
    it('should call next if user is authenticated', () => {
      req.isAuthenticated.mockReturnValue(true);
      
      isAuthenticated(req, res, next);
      
      expect(req.isAuthenticated).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 401 if user is not authenticated', () => {
      req.isAuthenticated.mockReturnValue(false);
      
      isAuthenticated(req, res, next);
      
      expect(req.isAuthenticated).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    });
  });

  describe('restrictTo', () => {
    it('should call next if user has required role', () => {
      const restrictToAdmin = restrictTo('admin', 'user');
      
      restrictToAdmin(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 403 if user does not have required role', () => {
      const restrictToAdmin = restrictTo('admin');
      
      restrictToAdmin(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    });
    
    it('should return 401 if user is not logged in', () => {
      const restrictToAdmin = restrictTo('admin');
      req.user = null;
      
      restrictToAdmin(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    });
  });
}); 