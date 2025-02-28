const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    conversationId: {
        type: String, // Unique ID for a conversation between two users
        required: true,
      },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // ✅ Auto adds createdAt & updatedAt timestamps
);

module.exports = mongoose.model("Message", messageSchema);
