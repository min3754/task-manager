const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

const commentController = {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;
      const taskId = req.params.taskId;

      const comment = await Comment.create({
        task_id: taskId,
        user_id: req.userId,
        content
      });

      await ActivityLog.create({
        task_id: taskId,
        user_id: req.userId,
        action: 'COMMENT_ADDED',
        description: 'Added a comment'
      });

      res.status(201).json({
        message: 'Comment added successfully',
        comment
      });
    } catch (error) {
      console.error('Create comment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getByTaskId(req, res) {
    try {
      const comments = await Comment.findByTaskId(req.params.taskId);
      res.json(comments);
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      await Comment.delete(req.params.id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Delete comment error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = commentController;
