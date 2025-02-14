const asyncHandler = require("../middleware/async");
const Article = require("../models/Article");

// @desc    Create new article
// @route   POST /api/v1/articles
// @access  Private
exports.createArticle = asyncHandler(async (req, res, next) => {
    req.body.author = req.user.id;
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, data: article });
});

// @desc    Get all articles
// @route   GET /api/v1/articles
// @access  Public
exports.getArticles = asyncHandler(async (req, res, next) => {
    const articles = await Article.find().populate("author", "name email");
    res.status(200).json({ success: true, data: articles });
});

// @desc    Get single article
// @route   GET /api/v1/articles/:id
// @access  Public
exports.getArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id).populate("author", "name email");

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ success: true, data: article });
});

// @desc    Update article
// @route   PUT /api/v1/articles/:id
// @access  Private
exports.updateArticle = asyncHandler(async (req, res, next) => {
    let article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }

    article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: article });
});

// @desc    Delete article
// @route   DELETE /api/v1/articles/:id
// @access  Private
exports.deleteArticle = asyncHandler(async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    if (article.author.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized" });
    }

    await article.remove();
    res.status(200).json({ success: true, message: "Article deleted" });
});
