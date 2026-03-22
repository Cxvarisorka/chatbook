const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        require: [true, "Text is required!"]
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        require: [true, "Sender id is required"]
    },
    groupId: {
        type: mongoose.Types.ObjectId,
        ref: 'Groups',
        require: [true, "Group id is required"]
    }
}, { 
    timestamps: true
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;