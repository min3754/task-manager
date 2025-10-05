const pool = require('../config/database');

const User = {
  async create(userData) {
    const { name, email, password, avatar } = userData;
    const result = await pool.query(
      'INSERT INTO users (name, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar, created_at',
      [name, email, password, avatar]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT id, name, email, avatar, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, userData) {
    const { name, avatar } = userData;
    const result = await pool.query(
      'UPDATE users SET name = $1, avatar = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, avatar, updated_at',
      [name, avatar, id]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT id, name, email, avatar FROM users ORDER BY name');
    return result.rows;
  }
};

module.exports = User;
