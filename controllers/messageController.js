const asyncHandler = require("../middleware/async");
const Message = require("../models/Message");

// @desc    Send message
// @route   POST /api/v1/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
    req.body.sender = req.user.id;
    const message = await Message.create(req.body);
    res.status(201).json({ success: true, data: message });
});

// @desc    Get messages for a user
// @route   GET /api/v1/messages
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({
        $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    }).populate("sender receiver", "name email");

    res.status(200).json({ success: true, data: messages });
});
