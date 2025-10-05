const pool = require('../config/database');

const ActivityLog = {
  async create(activityData) {
    const { task_id, user_id, action, description } = activityData;
    const result = await pool.query(
      'INSERT INTO activity_logs (task_id, user_id, action, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [task_id, user_id, action, description]
    );
    return result.rows[0];
  },

  async findByTaskId(taskId) {
    const result = await pool.query(`
      SELECT al.*, u.name as user_name
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.task_id = $1
      ORDER BY al.created_at DESC
      LIMIT 50
    `, [taskId]);
    return result.rows;
  },

  async getRecent(limit = 20) {
    const result = await pool.query(`
      SELECT al.*, u.name as user_name, t.title as task_title
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      JOIN tasks t ON al.task_id = t.id
      ORDER BY al.created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }
};

module.exports = ActivityLog;
