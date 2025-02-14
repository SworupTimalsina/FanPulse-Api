const multer = require("multer");
const maxSize = 2 * 1024 * 1024; // 2MB
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, `IMG-${Date.now()}${ext}`);
  },
});

// File Type Filter
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("File format not supported."), false);
  }
  cb(null, true);
};

// Multer Upload Instance
const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload; // Export multer instance
