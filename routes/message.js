const express = require("express");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/auth"); // Ensure user is logged in

const router = express.Router();

router.post("/send", sendMessage); // ✅ Send message
router.get("/:userId", getMessages);


module.exports = router;
