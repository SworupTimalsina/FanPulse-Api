const express = require("express");
const router = express.Router();
const { register, login, uploadImage, getAllUsers } = require("../controllers/userController");
const upload = require("../middleware/uploads");
const UserValidation = require("../validations/userValidation");

router.post("/register", UserValidation, register); // Apply validation here
router.post("/login", login);
router.post("/uploadImage", upload.single("profilePicture"), uploadImage);
router.get("/users", getAllUsers); 

module.exports = router;
