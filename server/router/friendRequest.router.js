const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const {
    createFriendRequest,
    getFriendRequests,
    getSentFriendRequests,
    cancelFriendRequest,
    acceptFriendRequest,
    getFriendships,
    removeFriend
} = require('../controllers/friendRequest.controller');

const friendRequestRouter = express.Router();

friendRequestRouter.get('/sent', protect, getSentFriendRequests);
friendRequestRouter.post('/:to', protect, createFriendRequest);
friendRequestRouter.delete('/:to', protect, cancelFriendRequest);
friendRequestRouter.get('/', protect, getFriendRequests);

friendRequestRouter.post('/accept/:requestId', protect, acceptFriendRequest);
friendRequestRouter.get('/friendships', protect, getFriendships);
friendRequestRouter.delete('/friendships/:userId', protect, removeFriend);

module.exports = friendRequestRouter;
