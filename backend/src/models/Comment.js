const pool = require('../config/database');

const Comment = {
  async create(commentData) {
    const { task_id, user_id, content } = commentData;
    const result = await pool.query(
      'INSERT INTO comments (task_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [task_id, user_id, content]
    );
    return result.rows[0];
  },

  async findByTaskId(taskId) {
    const result = await pool.query(`
      SELECT c.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at DESC
    `, [taskId]);
    return result.rows;
  },

  async delete(id) {
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Comment;
