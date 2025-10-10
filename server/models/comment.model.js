const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Users'
    // },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Posts'
    },
    text: {
        type: String,
        required: [true, "Comment must have text!"],
        minLength: 10
    }
});

const Comment = mongoose.model('Comments', commentSchema);