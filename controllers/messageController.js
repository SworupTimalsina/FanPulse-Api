const Message = require("../models/Message");

// @desc    Send a message
// @route   POST /api/v1/message/send
// @access  Public (No authentication required)
exports.sendMessage = async (req, res) => {
    try {
      const { senderId, receiverId, text } = req.body;
  
      if (!senderId || !receiverId || !text) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create a unique conversation ID
      const conversationId =
        senderId < receiverId
          ? `${senderId}_${receiverId}`
          : `${receiverId}_${senderId}`;
  
      const message = await Message.create({ senderId, receiverId, text, conversationId });
  
      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  

exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // ✅ Get selected user ID from params
        const { currentUserId } = req.query; // ✅ Get logged-in user ID from query params

        if (!userId || !currentUserId) {
            return res.status(400).json({ message: "Both user IDs are required" });
        }

        // ✅ Fetch messages where either user is the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: currentUserId },
                { senderId: currentUserId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
