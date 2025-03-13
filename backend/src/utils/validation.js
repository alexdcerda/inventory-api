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
