const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },

        fullname: {
            type: String,
            required: true,
        },

        profilePhoto: String,
        
        postImage: String,

        title: {
            type: String,
            required: [true, 'Title is required'],
            minLength: [3, 'Title must be at least 3 characters'],
            maxLength: [20, 'Title must be at most 20 characters'],
            unique: [true, 'Title must be unique']
        },
        content: {
            type: String,
            required: true
        },
        likesCount: {
            type: Number,
            default: 0
        },
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Comment' 
            }
        ],
        tags: [{
            type: String
        }]
    }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
