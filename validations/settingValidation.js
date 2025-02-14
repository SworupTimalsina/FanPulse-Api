const Joi = require("joi");

const settingsSchema = Joi.object({
    user: Joi.string().required(),
    theme: Joi.string().valid("light", "dark").default("light"),
    notifications_enabled: Joi.boolean().default(true),
});

function SettingsValidation(req, res, next) {
    const { user, theme, notifications_enabled } = req.body;
    const { error } = settingsSchema.validate({ user, theme, notifications_enabled });

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = SettingsValidation;
