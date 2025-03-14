import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';

// Mock the database
jest.mock('../../src/config/database.js', () => ({
  query: jest.fn()
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn()
}));

describe('User Model', () => {
  let db;
  
  beforeEach(() => {
    db = require('../../src/config/database.js');
    db.query.mockClear();
    bcrypt.genSalt.mockClear();
    bcrypt.hash.mockClear();
    bcrypt.compare.mockClear();
  });
  
  describe('findById', () => {
    it('should find a user by ID', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      db.query.mockResolvedValue({ rows: [mockUser] });
      
      const user = await User.findById(1);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
      expect(user).toEqual(mockUser);
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);
      
      await expect(User.findById(1)).rejects.toThrow(error);
    });
  });
  
  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      db.query.mockResolvedValue({ rows: [mockUser] });
      
      const user = await User.findByUsername('testuser');
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['testuser']
      );
      expect(user).toEqual(mockUser);
    });
  });
  
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      db.query.mockResolvedValue({ rows: [mockUser] });
      
      const user = await User.findByEmail('test@example.com');
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['test@example.com']
      );
      expect(user).toEqual(mockUser);
    });
  });
  
  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        email: 'test@example.com',
        role: 'user'
      };
      db.query.mockResolvedValue({ rows: [mockUser] });
      
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = await User.create(userData);
      
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        ['testuser', 'test@example.com', 'hashedPassword', 'user']
      );
      expect(user).toEqual(mockUser);
    });
  });
  
  describe('verifyPassword', () => {
    it('should verify if password matches', async () => {
      bcrypt.compare.mockResolvedValue(true);
      
      const result = await User.verifyPassword('password123', 'hashedPassword');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toBe(true);
    });
    
    it('should return false if password does not match', async () => {
      bcrypt.compare.mockResolvedValue(false);
      
      const result = await User.verifyPassword('wrongpassword', 'hashedPassword');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
      expect(result).toBe(false);
    });
  });
}); 