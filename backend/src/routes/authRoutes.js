import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updatePassword
} from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getCurrentUser);
router.patch('/update-password', isAuthenticated, updatePassword);

export default router; 