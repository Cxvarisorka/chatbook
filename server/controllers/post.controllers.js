const Post = require("../models/post.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// second problem is that we need class to create error objects in static way

const formatMongoQuery = (query) => {
    const mongoQuery = {};

    for (const [key, value] of Object.entries(query)) {
        const match = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
        if (match) {
            const [, field, op] = match;
            mongoQuery[field] = {
                ...mongoQuery[field],
                [`$${op}`]: isNaN(value) ? value : Number(value)
            };
        } else {
            mongoQuery[key] = isNaN(value) ? value : Number(value);
        }
    }

    return mongoQuery;
}

const getPosts = async (req, res) => {
    const { sort, tags, ...filters } = req.query;
    const mongoQuery = formatMongoQuery(filters);

    if(tags) {
        mongoQuery.tags = { $all: tags.split(",") }
    }
    
    const posts = await Post.find(mongoQuery).sort(sort);

    res.status(200).json({
        status: "success",
        length: posts.length,
        data: {
            posts
        }
    });  
};
// Rejected promises

const getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
       return next(new AppError('No post found with that ID', 404));
    }
    
    res.json(post)
});

const createPost = catchAsync(async (req, res) => {
    const { title, content, tags } = req.body;

    const newPost = await Post.create({
        userId: req.user._id,
        fullname: req.user.fullname,
        title,
        content,
        tags
    });

    res.status(201).json(newPost);
});

const deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if(!post) {
        return next(new AppError("Post cant be found!", 404))
    }

    if(req.user._id.toString() != post.userId){
        return next(new AppError("You dont have permission to delete others posts!", 401))
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(204).send();
});

const updatePost = catchAsync(async (req, res, next) => {
    const { title, content } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post) {
       return next(new AppError("Post cant be found!", 404));
    }

    if(title) post.title = title;
    if(content) post.content = content;

    await post.save();

    res.json(post)
});

module.exports = { getPosts, getPost, createPost, deletePost, updatePost };