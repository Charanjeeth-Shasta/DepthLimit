const express = require("express");

const {
  registerUser,
  loginUser,
  getUserProfile,
  changePassword,
  deleteAccount,
  updateProfile,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register Route with validation
router.post("/register", validateRegister, registerUser);

// Login Route with validation
router.post("/login", validateLogin, loginUser);

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Protected Profile Route
router.get("/profile", protect, getUserProfile);

// Update Profile Route
router.put("/profile", protect, validateUpdateProfile, updateProfile);

// Change Password Route
router.post("/change-password", protect, validateChangePassword, changePassword);

// Delete Account Route
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;