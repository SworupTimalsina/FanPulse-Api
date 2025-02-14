const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
    updateSettings,
    getSettings,
} = require("../controllers/settingsController");

const SettingsValidation = require("../validations/settingsValidation");

router.route("/")
    .get(protect, getSettings)
    .put(protect, SettingsValidation, updateSettings); // Apply validation here

module.exports = router;
