const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    createArticle,
    getArticles,
    getArticle,
    updateArticle,
    deleteArticle,
} = require("../controllers/articleController");

const ArticleValidation = require("../validations/articleValidation");

router.route("/")
    .post(protect, ArticleValidation, createArticle) // Apply validation here
    .get(getArticles);

router.route("/:id")
    .get(getArticle)
    .put(protect, ArticleValidation, updateArticle) // Apply validation here
    .delete(protect, deleteArticle);

module.exports = router;
