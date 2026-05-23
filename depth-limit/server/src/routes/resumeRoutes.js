const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../config/multer");

const {
  uploadResume,
  getUserResumes,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

// Protected Resume Upload Route
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/list", protect, getUserResumes);

router.delete("/:id", protect, deleteResume);

module.exports = router;