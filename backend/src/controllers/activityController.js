const ActivityLog = require('../models/ActivityLog');

const activityController = {
  async getByTaskId(req, res) {
    try {
      const activities = await ActivityLog.findByTaskId(req.params.taskId);
      res.json(activities);
    } catch (error) {
      console.error('Get activities error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getRecent(req, res) {
    try {
      const limit = req.query.limit || 20;
      const activities = await ActivityLog.getRecent(limit);
      res.json(activities);
    } catch (error) {
      console.error('Get recent activities error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = activityController;
