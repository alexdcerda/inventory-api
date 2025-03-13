import db from '../config/database.js';

class Item {
  // Get all items
  static async getAll() {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.id
        ORDER BY i.name
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get items by category ID
  static async getByCategoryId(categoryId) {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.id
        WHERE i.category_id = $1
        ORDER BY i.name
      `, [categoryId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get an item by ID
  static async getById(id) {
    try {
      const result = await db.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.id
        WHERE i.id = $1
      `, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new item
  static async create(item) {
    const { name, description, price, quantity, category_id, sku, image_url } = item;
    try {
      const result = await db.query(
        `INSERT INTO items (name, description, price, quantity, category_id, sku, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [name, description, price, quantity, category_id, sku, image_url]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update an item
  static async update(id, item) {
    const { name, description, price, quantity, category_id, sku, image_url } = item;
    try {
      const result = await db.query(
        `UPDATE items 
         SET name = $1, description = $2, price = $3, quantity = $4, 
             category_id = $5, sku = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 
         RETURNING *`,
        [name, description, price, quantity, category_id, sku, image_url, id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete an item
  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default Item;
