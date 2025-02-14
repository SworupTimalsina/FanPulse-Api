const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    sendMessage,
    getMessages,
} = require("../controllers/messageController");

const MessageValidation = require("../validations/messageValidation");

router.route("/")
    .post(protect, MessageValidation, sendMessage) // Apply validation here
    .get(protect, getMessages);

module.exports = router;
