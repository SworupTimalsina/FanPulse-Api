const Joi = require("joi");

const messageSchema = Joi.object({
    sender: Joi.string().required(),
    receiver: Joi.string().required(),
    content: Joi.string().required(),
});

function MessageValidation(req, res, next) {
    const { sender, receiver, content } = req.body;
    const { error } = messageSchema.validate({ sender, receiver, content });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = MessageValidation;
