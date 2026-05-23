const express = require("express");

const {
  generateInterview,
  submitAnswer,
  getUserSessions,
  getSessionDetails
} = require("../controllers/interviewController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// GENERATE UNIQUE INTERVIEW
// ==============================

router.post(
  "/generate",
  protect,
  generateInterview
);


// ==============================
// SUBMIT ANSWER
// ==============================

router.post(
  "/submit-answer/:sessionId",
  protect,
  submitAnswer
);

router.get("/sessions", protect, getUserSessions);

router.get("/:sessionId", protect, getSessionDetails);

module.exports = router;