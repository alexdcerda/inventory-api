import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // Find user by ID
  static async findById(id) {
    try {
      const result = await db.query(
        'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const result = await db.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
        [username, email, hashedPassword, role]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users (admin only)
  static async getAll() {
    try {
      const result = await db.query(
        'SELECT id, username, email, role, created_at FROM users ORDER BY username'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    const { username, email, role } = userData;
    
    try {
      const result = await db.query(
        `UPDATE users 
         SET username = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4 
         RETURNING id, username, email, role, created_at, updated_at`,
        [username, email, role, id]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update password
  static async updatePassword(id, newPassword) {
    try {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const result = await db.query(
        `UPDATE users 
         SET password = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING id, username, email, role, created_at, updated_at`,
        [hashedPassword, id]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const result = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id, username, email, role',
        [id]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default User; 