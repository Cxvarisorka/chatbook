const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    user2: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
});

const Friendship = mongoose.model('Friendships', friendshipSchema);

module.exports = Friendship;