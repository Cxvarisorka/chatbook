const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const addComment = catchAsync(async (req, res, next) => {
    const { text } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if(!post) {
        return next(new AppError('Post cant be found!', 404));
    }

    const comment = await Comment.create({
        text,
        postId,
        userId: req.user._id
    });

    post.comments.push(comment._id);

    await post.save();

    res.status(201).json({
        status: 'success',
        message: 'Comment added succesfully!',
        data: {
            comment
        }
    })
});

const getPostComments = catchAsync(async (req, res, next) => {
    const { postId } = req.params;

    const comments = await Comment.find({postId});

    res.json({
        status: 'success',
        message: 'Comment returned succesfully!',
        data: {
            comments
        }
    })
});

module.exports = { addComment, getPostComments };