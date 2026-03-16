const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    to: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
});

const FriendRequest = mongoose.model('friendRequest', friendRequestSchema);

module.exports = FriendRequest;