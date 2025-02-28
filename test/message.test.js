require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const { expect } = require("chai");

// Importing  Message model
const Message = require("../models/Message");

describe("Message Model", () => {
    before(async () => {
        console.log("TEST_DB_URI:", process.env.TEST_DB_URI);
        await mongoose.connect(process.env.TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Message.deleteMany({});
    });

    it("should create and save a message successfully", async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();

        const messageData = {
            senderId: senderId,
            receiverId: receiverId,
            conversationId: "conv1",
            text: "Hello, how are you?",
        };

        const message = new Message(messageData);
        const savedMessage = await message.save();

        expect(savedMessage._id).to.exist;
        expect(savedMessage.senderId.toString()).to.equal(senderId.toString());
        expect(savedMessage.receiverId.toString()).to.equal(receiverId.toString());
        expect(savedMessage.conversationId).to.equal("conv1");
        expect(savedMessage.text).to.equal("Hello, how are you?");
        // Verify that timestamps are automatically added
        expect(savedMessage.createdAt).to.be.instanceof(Date);
        expect(savedMessage.updatedAt).to.be.instanceof(Date);
    });

    it("should trim the text field", async () => {
        const senderId = new mongoose.Types.ObjectId();
        const receiverId = new mongoose.Types.ObjectId();

        const messageData = {
            senderId,
            receiverId,
            conversationId: "conv2",
            text: "   Hello, world!   ",
        };

        const message = new Message(messageData);
        const savedMessage = await message.save();

        // The text field should be trimmed automatically
        expect(savedMessage.text).to.equal("Hello, world!");
    });

    it("should not save a message if a required field is missing", async () => {
        const messageData = {
            receiverId: new mongoose.Types.ObjectId(),
            conversationId: "conv3",
            text: "Missing senderId",
        };

        try {
            const message = new Message(messageData);
            await message.save();
            throw new Error("Message saved without required senderId");
        } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.include("senderId");
        }
    });
});
