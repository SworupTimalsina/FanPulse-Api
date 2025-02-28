require("dotenv").config({ path: "./config/config.env" });
const mongoose = require("mongoose");
const { expect } = require("chai");

// Importing the Article model
const Article = require("../models/Article");

describe("Article Model", () => {
    before(async () => {
        // Log the TEST_DB_URI for debugging
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
        await Article.deleteMany({});
    });

    it("should create and save an article successfully", async () => {
        const dummyAuthorId = new mongoose.Types.ObjectId();
        const dummyUserId = new mongoose.Types.ObjectId();

        const articleData = {
            title: "Test Article",
            content: "This is the content of the test article.",
            author: dummyAuthorId,
            likes: [dummyUserId],
            comments: [
                {
                    user: dummyUserId,
                    text: "Nice article!",
                },
            ],
        };

        const article = new Article(articleData);
        const savedArticle = await article.save();

        // Verify document properties
        expect(savedArticle._id).to.exist;
        expect(savedArticle.title).to.equal(articleData.title);
        expect(savedArticle.content).to.equal(articleData.content);
        // Default for image should be null if not provided
        expect(savedArticle.image).to.equal(null);
        expect(savedArticle.author.toString()).to.equal(dummyAuthorId.toString());
        expect(savedArticle.likes).to.have.lengthOf(1);
        expect(savedArticle.likes[0].toString()).to.equal(dummyUserId.toString());
        expect(savedArticle.comments).to.have.lengthOf(1);
        expect(savedArticle.comments[0].text).to.equal("Nice article!");
        expect(savedArticle.comments[0].createdAt).to.be.instanceof(Date);
        // Verify auto-added timestamps
        expect(savedArticle.createdAt).to.be.instanceof(Date);
        expect(savedArticle.updatedAt).to.be.instanceof(Date);
    });

    it("should trim the title field", async () => {
        const articleData = {
            title: "   Trimmed Title   ",
            content: "Content with trimmed title.",
        };

        const article = new Article(articleData);
        const savedArticle = await article.save();

        // The title should be trimmed automatically
        expect(savedArticle.title).to.equal("Trimmed Title");
    });

    it("should set default image to null if not provided", async () => {
        const articleData = {
            title: "No Image Article",
            content: "Article content with no image provided.",
        };

        const article = new Article(articleData);
        const savedArticle = await article.save();

        expect(savedArticle.image).to.equal(null);
    });

    it("should not save an article if required fields are missing", async () => {
        const articleData = {
            image: "http://example.com/image.png",
        };

        try {
            const article = new Article(articleData);
            await article.save();
            throw new Error("Article saved without required fields");
        } catch (err) {
            expect(err).to.exist;
            expect(err.message).to.include("title");
            expect(err.message).to.include("content");
        }
    });
});
