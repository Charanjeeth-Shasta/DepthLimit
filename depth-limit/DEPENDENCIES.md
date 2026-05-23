# DepthLimit - Complete Project Dependencies

# This file documents all dependencies needed for the full-stack application

# Install backend and frontend dependencies with npm, Python NLP service with pip

# ============================================================

# BACKEND (Node.js/Express) - Install with: cd server && npm install

# ============================================================

# Production Dependencies:

# - express@5.2.1 - Web framework

# - mongoose@9.6.2 - MongoDB ORM

# - jsonwebtoken@9.0.3 - JWT authentication

# - bcryptjs@3.0.3 - Password hashing

# - cors@2.8.6 - CORS middleware

# - dotenv@17.4.2 - Environment variables

# - helmet@7.2.0 - Security headers

# - cookie-parser@1.4.7 - HTTP cookie parsing

# - express-rate-limit@7.5.1 - Rate limiting on auth routes

# - express-validator@7.3.2 - Input validation

# - multer@2.1.1 - File upload handling

# - pdf-parse@1.1.1 - PDF parsing

# - mammoth@1.8.0 - DOCX parsing

# - axios@1.16.1 - HTTP client for NLP service calls

#

# Dev Dependencies:

# - nodemon@3.1.14 - Auto-reload server on file changes

# ============================================================

# FRONTEND (React/Vite) - Install with: cd client && npm install

# ============================================================

# Production Dependencies:

# - react@18.x - UI library

# - react-dom@18.x - React DOM rendering

# - react-router-dom@6.x - Client-side routing

# - axios@1.x - HTTP client

# - tailwindcss@3.x - CSS utility framework

# - lucide-react@0.x - Icon library

#

# Dev Dependencies:

# - vite@5.x - Build tool

# - @vitejs/plugin-react@4.x - Vite React plugin

# - eslint@8.x - Code linting

# - postcss@8.x - CSS processing

# - autoprefixer@10.x - Browser prefix support

# ============================================================

# NLP SERVICE (Python/FastAPI) - Install with: cd nltk-service && pip install -r requirements.txt

# ============================================================

# See nltk-service/requirements.txt for Python dependencies

# ============================================================

# QUICK START GUIDE

# ============================================================

# 1. Install Backend:

# cd server

# npm install

#

# 2. Install Frontend:

# cd client

# npm install

#

# 3. Install NLP Service (Python):

# cd nltk-service

# pip install -r requirements.txt

#

# 4. Configure Environment:

# - Create server/.env with MongoDB and JWT secrets

# - Create client/.env with VITE_API_URL

#

# 5. Run All Services (open 3 terminals):

# Terminal 1: cd server && npm run dev (runs on :5000)

# Terminal 2: cd client && npm run dev (runs on :5173)

# Terminal 3: cd nltk-service && python app.py (runs on :8000)

#

# 6. Open browser: http://localhost:5173

# ============================================================

# SECURITY NOTES

# ============================================================

# - JWT tokens stored in httpOnly cookies (XSS-proof)

# - File uploads: PDF/DOCX/DOC only, max 5MB

# - Rate limiting: 10 auth attempts per 15 minutes

# - Input validation on all user inputs

# - Password hashing with bcryptjs

# - CORS restricted to CLIENT_ORIGIN

# - Security headers via Helmet middleware

# ============================================================

# VERSION NOTES

# ============================================================

# - Node.js: v18.0.0+

# - npm: v9.0.0+

# - Python: 3.8+

# - MongoDB: 4.0+ (local or Atlas)