const Resume = require("../models/Resume");
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "../../uploads/resumes");

const validateFilePath = (filePath) => {
  const safePath = path.resolve(UPLOADS_DIR, path.basename(filePath));
  if (!safePath.startsWith(UPLOADS_DIR)) {
    throw new Error("Invalid file path detected");
  }
  return safePath;
};

// Upload Resume
const uploadResume = async (req, res) => {
  try {
    // Check file exists
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    // Save resume data in MongoDB
    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Get User Resumes
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete Resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // ===== SECURITY: Validate file path before deletion =====
    let safeFilePath;
    try {
      safeFilePath = validateFilePath(resume.filePath);
    } catch (error) {
      return res.status(400).json({ message: "Invalid resume file path" });
    }

    // Delete file from filesystem
    try {
      fs.unlinkSync(safeFilePath);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error('File deletion warning:', e.message);
      }
    }

    await Resume.findByIdAndDelete(id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  deleteResume,
};