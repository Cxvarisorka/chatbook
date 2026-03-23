const FriendRequest = require("../models/friendRequest.model");
const Friendship = require("../models/friendship.model");
const Group = require("../models/group.model");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createFriendRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;

    // Check if user sends request to himslef
    if (req.user._id.toString() == to) {
        return next(new AppError("You cant send friend request to yourself!", 400));
    }

    const friendRequestExsist = await FriendRequest.findOne({ to, from: req.user._id });

    // Check if user have already created friend request
    if (friendRequestExsist) {
        return next(new AppError("You have already sent friend request to this user!", 400));
    }

    const user = await User.findById(to);

    // Check if user exsists
    if (!user) {
        return next(new AppError("User cant be found!", 404));
    }

    const friendRequest = await FriendRequest.create({ from: req.user._id, to: user._id });

    res.status(201).json({
        status: 'success',
        message: 'Friend request sent!',
        data: {
            friendRequest
        }
    });
});

const getFriendRequests = catchAsync(async (req, res) => {
    const friendRequests = await FriendRequest.find({ to: req.user._id }).populate('from');

    res.status(200).json({
        status: 'success',
        message: 'Succesfully returned friend requests',
        data: {
            friendRequests
        }
    });
});

// returns friend request which was created by current user
const getSentFriendRequests = catchAsync(async (req, res) => {
    const friendRequests = await FriendRequest.find({ from: req.user._id }).populate('to');

    res.status(200).json({
        status: 'success',
        message: 'Succesfully returned sent friend requests',
        data: {
            friendRequests
        }
    });
});

const cancelFriendRequest = catchAsync(async (req, res, next) => {
    const { to } = req.params;

    const friendRequest = await FriendRequest.findOneAndDelete({
        from: req.user._id,
        to
    });

    if (!friendRequest) {
        return next(new AppError('Friend request not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Friend request canceled!'
    });
});

const acceptFriendRequest = catchAsync(async (req, res, next) => {
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest) {
        return next(new AppError("Friend request dont exsist!", 404));
    }


    if(friendRequest.to != req.user._id.toString()) {
        return next(new AppError("You dont have permission to accept this request!", 404));
    }

    const friendship = await Friendship.create({
        user1: req.user._id,
        user2: friendRequest.from
    });

    // Create group for the new friendship
    await Group.create({members: [req.user._id, friendRequest.from]});

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({
        status: 'success',
        message: 'Friend request accepted!',
        data: {
            friendship
        }
    });
});

const rejectFriendRequest = catchAsync(async (req, res, next) => {
    const { requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest) {
        return next(new AppError("Friend request dont exsist!", 404));
    }

    if(friendRequest.to != req.user._id.toString()) {
        return next(new AppError("You dont have permission to accept this request!", 404));
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({
        status: 'success',
        message: 'Friend request rejected!'
    });
});

const getFriendships = catchAsync(async (req, res) => {
    const friendships = await Friendship.find({
        $or: [
            { user1: req.user._id },
            { user2: req.user._id }
        ]
    });

    res.status(200).json({
        status: 'success',
        message: 'Succesfully returned friendships!',
        data: {
            friendships
        }
    });
});

const removeFriend = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const friendship = await Friendship.findOneAndDelete({
        $or: [
            {user1: req.user._id, user2: userId},
            {user1: userId, user2: req.user._id}
        ]
    });

    if(!friendship) {
        return next(new AppError("Friendship dont exsist!", 400));
    }

    res.status(200).json({
        status: "success",
        message: "Friend deleted succesfully"
    });
});

module.exports = {
    createFriendRequest,
    getFriendRequests,
    getSentFriendRequests,
    cancelFriendRequest,
    acceptFriendRequest,
    getFriendships,
    removeFriend,
    rejectFriendRequest
};
