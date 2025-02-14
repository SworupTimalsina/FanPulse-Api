const Joi = require("joi");

const userSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    image: Joi.string().optional(),
    username: Joi.string().optional(),
    password: Joi.string().min(6).required(),
});

function UserValidation(req, res, next) {
    const { name, phone, email, image, username, password } = req.body;
    const { error } = userSchema.validate({ name, phone, email, image, username, password });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = UserValidation;
