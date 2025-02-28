const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String, 
            default: null,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Referencing the User model
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Users who liked the article
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Article", articleSchema);
