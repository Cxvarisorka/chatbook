const express = require('express');
const { getUsers, getUserById } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

const userRouter = express.Router();

userRouter.get('/', protect, getUsers);
userRouter.get('/:userId', protect, getUserById);

module.exports = userRouter;