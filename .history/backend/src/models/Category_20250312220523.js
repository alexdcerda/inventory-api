import db from '../config/database.js';

class Category {
  // Get all categories
  static async getAll() {
    try {
      const result = await db.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a category by ID
  static async getById(id) {
    try {
      const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new category
  static async create(category) {
    const { name, description } = category;
    try {
      const result = await db.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update a category
  static async update(id, category) {
    const { name, description } = category;
    try {
      const result = await db.query(
        'UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [name, description, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a category
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default Category;
