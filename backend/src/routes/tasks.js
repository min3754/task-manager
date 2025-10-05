const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status')
  ],
  taskController.create
);

router.get('/', taskController.getAll);

router.get('/stats', taskController.getStats);

router.get('/:id', taskController.getById);

router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage('Invalid status')
  ],
  taskController.update
);

router.delete('/:id', taskController.delete);

module.exports = router;
