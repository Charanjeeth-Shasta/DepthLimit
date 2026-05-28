const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');


const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");


dotenv.config();

// Connect Database
connectDB();

const app = express();
app.set('trust proxy', 1);

// Security Middleware (MUST BE FIRST)
app.use(helmet());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// Request Timeout Middleware (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Rate Limiting on Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health Check Endpoint (for load balancers and orchestration)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    uptime: process.uptime(), 
    timestamp: new Date().toISOString() 
  });
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

// Global Error Handler (MUST BE LAST)
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  res.status(err.status || 500).json({ 
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server running on port ${PORT}`);
  }
});

// Graceful Shutdown Handlers
process.on("SIGTERM", () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("SIGTERM received, closing gracefully...");
  }
  server.close(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Server closed");
    }
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("SIGINT received, closing gracefully...");
  }
  server.close(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Server closed");
    }
    process.exit(0);
  });
});