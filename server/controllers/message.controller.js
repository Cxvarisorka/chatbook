const Group = require("../models/group.model");
const Message = require("../models/message.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


const sendMessage = catchAsync(async (req, res, next) => {
    const { groupId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    const group = await Group.findById(groupId);

    if(!group) {
        return next(new AppError("Group doesnot exsists!", 404))
    }

    const isMember = group.members.some(id => id.toString() == senderId.toString());

    if (!isMember) {
        return next(new AppError("You are not memeber of this group!", 404))
    }

    const message = await Message.create({senderId, text, groupId});

    const io = req.app.get('io');
    io.to(`group:${groupId}`).emit('group-message', {
        message
    });

    await Group.findByIdAndUpdate(groupId, {
        lastMessage: message._id
    });

    res.status(201).json({
        status: "success",
        message: "Message sent succesfully!",
        data: {
            message
        }
    });
});


const getMessages = catchAsync(async (req, res) => {
    const { groupId } = req.params;

    const messages = await Message.find({groupId});

    res.status(200).json({
        status: "success",
        message: "Message sent succesfully!",
        data: {
            messages
        }
    })
});

const getGroups = catchAsync(async (req, res) => {
    const groups = await Group.find({members: req.user._id});

    res.status(200).json({
        status: "success",
        message: "Succesfully returned groups!",
        data: {
            groups
        }
    })
});

module.exports = {sendMessage, getMessages, getGroups}