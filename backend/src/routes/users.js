const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', userController.getAll);

router.get('/:id', userController.getById);

module.exports = router;
