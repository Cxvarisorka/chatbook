const express = require('express');

// Model
const Post = require('../models/post.model');

// Controllers
const { getPosts, getPost, createPost, deletePost, updatePost } = require('../controllers/post.controllers');
const {protect} = require('../middlewares/auth.middleware');

const postRouter = express.Router();

// Get all posts
postRouter.get('/', protect, getPosts);

// Get post by ID
postRouter.get('/:id', getPost);

// Create post
postRouter.post('/', protect, createPost);

// Delete post by ID
postRouter.delete('/:id', protect, deletePost);

// Update post by ID
postRouter.patch('/:id', protect, updatePost);


module.exports = postRouter;