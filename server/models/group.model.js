const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "Users",
        require: true
    }],
    lastMessage: {
        type: mongoose.Types.ObjectId,
        ref: "Messages"
    }
}, { 
    timestamps: true
});

const Group = mongoose.model("Groups", groupSchema);

module.exports = Group;