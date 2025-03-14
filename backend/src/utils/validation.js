// Validate category input
export const validateCategory = (category) => {
  const errors = [];
  
  if (!category.name) {
    errors.push('Category name is required');
  } else if (category.name.length < 2) {
    errors.push('Category name must be at least 2 characters long');
  }
  
  return errors;
};

// Validate item input
export const validateItem = (item) => {
  const errors = [];
  
  if (!item.name) {
    errors.push('Item name is required');
  } else if (item.name.length < 2) {
    errors.push('Item name must be at least 2 characters long');
  }
  
  if (!item.price && item.price !== 0) {
    errors.push('Item price is required');
  } else if (isNaN(parseFloat(item.price)) || parseFloat(item.price) < 0) {
    errors.push('Item price must be a non-negative number');
  }
  
  if (!item.quantity && item.quantity !== 0) {
    errors.push('Item quantity is required');
  } else if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 0) {
    errors.push('Item quantity must be a non-negative integer');
  }
  
  if (!item.category_id) {
    errors.push('Category ID is required');
  } else if (!Number.isInteger(Number(item.category_id)) || Number(item.category_id) <= 0) {
    errors.push('Category ID must be a positive integer');
  }
  
  return errors;
};

// Validate user registration input
export const validateUser = (user) => {
  const errors = [];
  
  // Validate username
  if (!user.username) {
    errors.push('Username is required');
  } else if (user.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  // Validate email
  if (!user.email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      errors.push('Please provide a valid email address');
    }
  }
  
  // Validate password
  if (!user.password) {
    errors.push('Password is required');
  } else if (user.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Validate password confirmation
  if (user.passwordConfirm !== undefined && user.password !== user.passwordConfirm) {
    errors.push('Passwords do not match');
  }
  
  return errors;
};

// Validate login input
export const validateLogin = (credentials) => {
  const errors = [];
  
  if (!credentials.username) {
    errors.push('Username is required');
  }
  
  if (!credentials.password) {
    errors.push('Password is required');
  }
  
  return errors;
};

// Validate password change
export const validatePasswordChange = (passwords) => {
  const errors = [];
  
  if (!passwords.currentPassword) {
    errors.push('Current password is required');
  }
  
  if (!passwords.newPassword) {
    errors.push('New password is required');
  } else if (passwords.newPassword.length < 8) {
    errors.push('New password must be at least 8 characters long');
  }
  
  if (passwords.newPassword !== passwords.confirmNewPassword) {
    errors.push('New passwords do not match');
  }
  
  if (passwords.currentPassword === passwords.newPassword) {
    errors.push('New password must be different from current password');
  }
  
  return errors;
};
