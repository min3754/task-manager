const pool = require('../config/database');

const Task = {
  async create(taskData) {
    const { title, description, status, assignee_id, created_by, due_date } = taskData;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, assignee_id, created_by, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, status || 'TODO', assignee_id, created_by, due_date]
    );
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT t.*, 
        u1.name as assignee_name, u1.email as assignee_email, u1.avatar as assignee_avatar,
        u2.name as creator_name, u2.email as creator_email
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0];
  },

  async update(id, taskData) {
    const { title, description, status, assignee_id, due_date } = taskData;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, assignee_id = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [title, description, status, assignee_id, due_date, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  },

  async getAll(filters = {}) {
    let query = `
      SELECT t.*, 
        u1.name as assignee_name, u1.email as assignee_email, u1.avatar as assignee_avatar,
        u2.name as creator_name, u2.email as creator_email
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.assignee_id) {
      query += ` AND t.assignee_id = $${paramCount}`;
      params.push(filters.assignee_id);
      paramCount++;
    }

    if (filters.created_by) {
      query += ` AND t.created_by = $${paramCount}`;
      params.push(filters.created_by);
      paramCount++;
    }

    if (filters.due_date) {
      query += ` AND t.due_date <= $${paramCount}`;
      params.push(filters.due_date);
      paramCount++;
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo,
        COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'DONE' THEN 1 END) as done
      FROM tasks
    `);
    return result.rows[0];
  }
};

module.exports = Task;
