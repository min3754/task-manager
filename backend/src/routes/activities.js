const express = require('express');
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/tasks/:taskId', activityController.getByTaskId);

router.get('/recent', activityController.getRecent);

module.exports = router;
