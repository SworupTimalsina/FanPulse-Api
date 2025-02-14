const Joi = require("joi");

const articleSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
});

function ArticleValidation(req, res, next) {
    const { title, content, author } = req.body;
    const { error } = articleSchema.validate({ title, content, author });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = ArticleValidation;
