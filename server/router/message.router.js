const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { sendMessage, getMessages, getGroups } = require('../controllers/message.controller');

const messageRouter = express.Router();

messageRouter.get('/groups', protect, getGroups);
messageRouter.post('/:groupId', protect, sendMessage);
messageRouter.get('/:groupId', protect, getMessages);

module.exports = messageRouter;