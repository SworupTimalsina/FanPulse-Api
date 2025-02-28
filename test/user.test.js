require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { expect } = require("chai");

// Import your User model
const User = require("../models/User");

describe("User Model", () => {
    before(async () => {
        // Log the TEST_DB_URI for debugging purposes
        console.log("TEST_DB_URI:", process.env.TEST_DB_URI);
        await mongoose.connect(process.env.TEST_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    after(async () => {
        // Clean up and disconnect after all tests
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear the collection before each test
        await User.deleteMany({});
    });

    it("should hash the password before saving", async () => {
        const userData = {
            name: "Sworup Timalsina",
            phone: "9849918515",
            email: "sworup.work@example.com",
            username: "testuser",
            password: "password123",
        };

        const user = new User(userData);
        await user.save();


        expect(user.password).to.not.equal("password123");


        const isMatch = await bcrypt.compare("password123", user.password);
        expect(isMatch).to.be.true;
    });

    it("should generate a valid JWT token", async () => {
        const userData = {
            name: "Rojan Shrestha",
            phone: "9841380909",
            email: "rojan.user@example.com",
            username: "jwtuser",
            password: "password123",
        };

        const user = new User(userData);
        await user.save();

        const token = user.getSignedJwtToken();
        expect(token).to.be.a("string");

        // Verify the token using the JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).to.equal(user._id.toString());
    });

    it("should correctly match passwords", async () => {
        const userData = {
            name: "Rupa Baniya",
            phone: "9851084844",
            email: "rupa.user@example.com",
            username: "matchuser",
            password: "password123",
        };

        const user = new User(userData);
        await user.save();


        const isMatch = await user.matchPassword("password123");
        expect(isMatch).to.be.true;


        const isNotMatch = await user.matchPassword("wrongpassword");
        expect(isNotMatch).to.be.false;
    });

    it("should generate and hash a reset password token", async () => {
        const userData = {
            name: "Aashrit ",
            phone: "5566778899",
            email: "aashrit.user@example.com",
            username: "resetuser",
            password: "password123",
        };

        const user = new User(userData);
        await user.save();

        const resetToken = user.getResetPasswordToken();
        expect(resetToken).to.be.a("string");


        expect(user.resetPasswordToken).to.be.a("string");
        expect(user.resetPasswordExpire).to.be.a("number");


        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        expect(user.resetPasswordToken).to.equal(hashedToken);
    });
});
