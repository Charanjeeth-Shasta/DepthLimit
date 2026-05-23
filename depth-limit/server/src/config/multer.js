const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },

  filename: (req, file, cb) => {
    // Unique filename with user ID and random string
    cb(
      null,
      `${req.user._id}-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
    );
  },
});

// File Filter with MIME type validation
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error("Only PDF, DOC, DOCX, TXT files are allowed"));
  }

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new Error("Invalid file MIME type"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

module.exports = upload;