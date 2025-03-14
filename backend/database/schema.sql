-- Drop tables if they exist
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data for categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Clothing', 'Apparel and fashion items'),
  ('Books', 'Books and publications'),
  ('Home & Kitchen', 'Home and kitchen appliances and accessories');

-- Insert some sample data for items
INSERT INTO items (name, description, price, quantity, category_id, sku) VALUES
  ('Smartphone', 'Latest model smartphone with advanced features', 699.99, 50, 1, 'ELEC-001'),
  ('Laptop', 'High-performance laptop for work and gaming', 1299.99, 25, 1, 'ELEC-002'),
  ('T-shirt', 'Cotton t-shirt, available in various colors', 19.99, 100, 2, 'CLOTH-001'),
  ('Jeans', 'Denim jeans, slim fit', 49.99, 75, 2, 'CLOTH-002'),
  ('Novel', 'Bestselling fiction novel', 14.99, 200, 3, 'BOOK-001'),
  ('Cookbook', 'Collection of gourmet recipes', 24.99, 50, 3, 'BOOK-002'),
  ('Blender', 'High-speed blender for smoothies and more', 89.99, 30, 4, 'HOME-001'),
  ('Coffee Maker', 'Programmable coffee maker with timer', 59.99, 40, 4, 'HOME-002');

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
  ('admin', 'admin@example.com', '$2a$10$rRsVdYs.u/YrKXgRjX5JkOL.raxtTRhJA1r9ByXXBVTjg/ezzAA/y', 'admin');

-- Insert sample regular user (password: user123)
INSERT INTO users (username, email, password, role) VALUES
  ('user', 'user@example.com', '$2a$10$rrwKcOoGYFRF2SZ1UgvUd.xQJEyN3ACEJk3eeGz9xwm35KI5XpTXi', 'user');
