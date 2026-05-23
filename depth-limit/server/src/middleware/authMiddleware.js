const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check httpOnly cookie first (preferred)
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from token ID
      req.user = await User.findById(decoded.id).select("-password");

      next();
      return;
    } catch (error) {
      res.status(401).json({
        message: "Not authorized, token failed",
      });
      return;
    }
  }

  // Fallback to Authorization header (for compatibility)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from token ID
      req.user = await User.findById(decoded.id).select("-password");

      next();
      return;
    } catch (error) {
      res.status(401).json({
        message: "Not authorized, token failed",
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Not authorized, no token",
    });
    return;
  }
};

module.exports = { protect };