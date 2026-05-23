const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");


dotenv.config();

// Connect Database
connectDB();

const app = express();

// Security Middleware (MUST BE FIRST)
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};
app.use(cors(corsOptions));

app.use(express.json());

// Cookie Parser Middleware (for httpOnly cookies)
app.use(cookieParser());

// Rate Limiting on Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/interview", interviewRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "DepthLimit Backend Running",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running on port ${PORT}`);
  }
});