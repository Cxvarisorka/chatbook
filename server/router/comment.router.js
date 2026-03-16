const express = require('express');
const { getPostComments, addComment } = require('../controllers/comments.controller');
const { protect } = require('../middlewares/auth.middleware');

const commentRouter = express.Router();

commentRouter.get('/:postId', protect, getPostComments);
commentRouter.post('/:postId', protect, addComment);

module.exports = commentRouter;