const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.json({
        status: 'success',
        message: 'Succesfully returned users!',
        data: {
            users
        }
    });
});

const getUserById = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if(!user) {
        return next(new AppError('User cant be found!', 404));
    }

    res.json({
        status: 'success',
        message: 'Succesfully returned user!',
        data: {
            user
        }
    })
})

module.exports = { getUsers, getUserById };