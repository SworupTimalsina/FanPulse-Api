const asyncHandler = require("../middleware/async");
const Settings = require("../models/Settings");

// @desc    Update user settings
// @route   PUT /api/v1/settings
// @access  Private
exports.updateSettings = asyncHandler(async (req, res, next) => {
    let settings = await Settings.findOne({ user: req.user.id });

    if (!settings) {
        settings = await Settings.create({ user: req.user.id, ...req.body });
    } else {
        settings = await Settings.findOneAndUpdate({ user: req.user.id }, req.body, { new: true, runValidators: true });
    }

    res.status(200).json({ success: true, data: settings });
});

// @desc    Get user settings
// @route   GET /api/v1/settings
// @access  Private
exports.getSettings = asyncHandler(async (req, res, next) => {
    const settings = await Settings.findOne({ user: req.user.id });

    if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json({ success: true, data: settings });
});
