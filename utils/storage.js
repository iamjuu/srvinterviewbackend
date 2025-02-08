const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define your storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, './../Public/images'); // Path to save files
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create directory and parent directories if necessary
    }
    cb(null, uploadPath); // Pass the directory path to Multer
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique file name
  }
});

module.exports = storage;
