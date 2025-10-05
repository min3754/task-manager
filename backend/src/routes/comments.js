const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/:taskId/comments',
  [
    body('content').notEmpty().withMessage('Comment content is required')
  ],
  commentController.create
);

router.get('/:taskId/comments', commentController.getByTaskId);

router.delete('/comments/:id', commentController.delete);

module.exports = router;
