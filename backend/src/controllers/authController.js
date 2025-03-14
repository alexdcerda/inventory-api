import passport from 'passport';
import User from '../models/User.js';
import { validateUser, validateLogin, validatePasswordChange } from '../utils/validation.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    
    // Validate user input
    const errors = validateUser({ username, email, password, passwordConfirm });
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        status: 'fail',
        message: 'Username already in use'
      });
    }
    
    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password
    });
    
    // Log in the user after registration
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = (req, res, next) => {
  // Validate login input
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors
    });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: info.message || 'Invalid credentials'
      });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    });
  })(req, res, next);
};

// Logout user
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Error logging out'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  });
};

// Get current user
export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in'
    });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
};

// Update password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
    // Validate password change input
    const errors = validatePasswordChange({ 
      currentPassword, 
      newPassword, 
      confirmNewPassword 
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    
    // Get user with password
    const user = await User.findByUsername(req.user.username);
    
    // Check if current password is correct
    const isMatch = await User.verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    await User.updatePassword(user.id, newPassword);
    
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 