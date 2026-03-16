const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
    createFriendRequest,
    getFriendRequests,
    getSentFriendRequests,
    cancelFriendRequest
} = require('../controllers/friendRequest.controller');

const friendRequestRouter = express.Router();

friendRequestRouter.get('/sent', protect, getSentFriendRequests);
friendRequestRouter.post('/:to', protect, createFriendRequest);
friendRequestRouter.delete('/:to', protect, cancelFriendRequest);
friendRequestRouter.get('/', protect, getFriendRequests);

module.exports = friendRequestRouter;
