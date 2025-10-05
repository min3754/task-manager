const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

const taskController = {
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, assignee_id, due_date } = req.body;

      const task = await Task.create({
        title,
        description,
        status: status || 'TODO',
        assignee_id,
        created_by: req.userId,
        due_date
      });

      await ActivityLog.create({
        task_id: task.id,
        user_id: req.userId,
        action: 'CREATED',
        description: `Task created: ${title}`
      });

      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getAll(req, res) {
    try {
      const { status, assignee_id, created_by, due_date, my_tasks } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (assignee_id) filters.assignee_id = assignee_id;
      if (created_by) filters.created_by = created_by;
      if (due_date) filters.due_date = due_date;
      if (my_tasks === 'true') filters.assignee_id = req.userId;

      const tasks = await Task.getAll(filters);
      res.json(tasks);
    } catch (error) {
      console.error('Get all tasks error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getById(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Get task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, assignee_id, due_date } = req.body;

      const existingTask = await Task.findById(req.params.id);
      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const task = await Task.update(req.params.id, {
        title,
        description,
        status,
        assignee_id,
        due_date
      });

      if (existingTask.status !== status) {
        await ActivityLog.create({
          task_id: task.id,
          user_id: req.userId,
          action: 'STATUS_CHANGED',
          description: `Status changed from ${existingTask.status} to ${status}`
        });
      }

      if (existingTask.assignee_id !== assignee_id) {
        await ActivityLog.create({
          task_id: task.id,
          user_id: req.userId,
          action: 'ASSIGNEE_CHANGED',
          description: `Assignee changed`
        });
      }

      res.json({
        message: 'Task updated successfully',
        task
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async delete(req, res) {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      await Task.delete(req.params.id);

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getStats(req, res) {
    try {
      const stats = await Task.getStats();
      const total = parseInt(stats.total);
      const done = parseInt(stats.done);
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      res.json({
        ...stats,
        progress
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = taskController;
