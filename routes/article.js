const express = require("express");
const {
    addArticle,
    getArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getUserArticles
} = require("../controllers/articleController");

const router = express.Router();

// ✅ CREATE ARTICLE (POST)
router.post("/add", addArticle);

// ✅ GET ALL ARTICLES (GET)
router.get("/", getArticles);

// ✅ GET SINGLE ARTICLE BY ID (GET)
router.get("/:id", getArticleById);

// ✅ UPDATE ARTICLE (PUT)
router.put("/:id", updateArticle);

// ✅ DELETE ARTICLE (DELETE)
router.delete("/:id", deleteArticle);

router.get("/user/:userId", getUserArticles); 

module.exports = router;
