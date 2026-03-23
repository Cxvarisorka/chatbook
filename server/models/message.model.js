const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Text is required!"]
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: [true, "Sender id is required"]
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Groups',
        required: [true, "Group id is required"]
    }
}, { 
    timestamps: true
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;