const Article = require("../models/Article");
const asyncHandler = require("../middleware/async");

// @desc    Create a new article
// @route   POST /api/v1/articles
// @access  Public (No authentication middleware)

exports.addArticle = asyncHandler(async (req, res, next) => {
    console.log(req.body); // Debugging

    const { title, content, image, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content, and author are required" });
    }

    // Create article
    await Article.create({
        title,
        content,
        image: image || null, // Image is optional
        author,
    });

    res.status(201).json({
        success: true,
        message: "Article created successfully",
    });
});

// ✅ GET ALL ARTICLES
// @route   GET /api/v1/articles
// @access  Public
exports.getArticles = asyncHandler(async (req, res) => {
    const articles = await Article.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: articles.length,
        data: articles,
    });
});

// ✅ GET SINGLE ARTICLE BY ID
// @route   GET /api/v1/articles/:id
// @access  Public
exports.getArticleById = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
        success: true,
        data: article,
    });
});

// ✅ UPDATE ARTICLE
// @route   PUT /api/v1/articles/:id
// @access  Public
exports.updateArticle = asyncHandler(async (req, res) => {
    let article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    const { title, content, image } = req.body;

    article.title = title || article.title;
    article.content = content || article.content;
    article.image = image !== undefined ? image : article.image;

    await article.save();

    res.status(200).json({
        success: true,
        message: "Article updated successfully",
        data: article,
    });
});

// ✅ DELETE ARTICLE
// @route   DELETE /api/v1/articles/:id
// @access  Public
exports.deleteArticle = asyncHandler(async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    await article.deleteOne();

    res.status(200).json({
        success: true,
        message: "Article deleted successfully",
    });
});

// ✅ GET ALL ARTICLES BY A SPECIFIC USER
// @route   GET /api/v1/articles/user/:userId
// @access  Public
exports.getUserArticles = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const articles = await Article.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: articles.length,
        data: articles || [], // ✅ Ensure an array is returned
    });
});