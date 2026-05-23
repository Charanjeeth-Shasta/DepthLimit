# DepthLimit

A Smart AI Interview Practice Platform with resume upload, JD-based question generation, and real-time scoring.

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) - free tier)
- Python 3.8+ (for NLP service)

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/Charanjeeth-Shasta/DepthLimit.git
cd DepthLimit/depth-limit

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies (new terminal)
cd ../client
npm install

# 4. Install NLP service dependencies (new terminal)
cd ../nltk-service
pip install -r requirements.txt
```

---

## Environment Variables

### Server — `server/.env`

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/depthlimit

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets (use strong random 32+ char strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Frontend origin (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

### Client — `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## Running in Development

Open **3 terminals** and run:

**Terminal 1 — Backend**
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 — NLP Service**
```bash
cd nltk-service
python app.py
# Runs on http://localhost:8000
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns httpOnly cookie)
- `GET  /api/auth/profile` — Get user profile (protected)
- `POST /api/auth/logout` — Logout (clears cookie)
- `POST /api/auth/refresh` — Refresh access token

### Resume
- `POST /api/resume/upload` — Upload resume (PDF/DOCX/DOC, max 5MB)
- `GET  /api/resume` — Get all resumes
- `DELETE /api/resume/:id` — Delete resume

### Interview
- `POST /api/interview/generate` — Generate interview questions
- `POST /api/interview/submit-answer/:sessionId` — Submit and score answer
- `GET  /api/interview/sessions` — Get all interview sessions

---

## Project Structure

```
depth-limit/
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   ├── config/          # Database, file upload
│   │   └── app.js           # Express entry point
│   ├── .env
│   └── package.json
│
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # UI components
│   │   ├── context/         # Auth state
│   │   ├── services/        # API client
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── nltk-service/            # Python NLP service
    ├── app.py
    └── requirements.txt
```

---

## Common Issues

**MongoDB connection failed**
- Local: run `mongod` in a separate terminal
- Atlas: whitelist your IP, verify connection string and credentials

**CORS error**
- Ensure `CLIENT_ORIGIN` in `server/.env` exactly matches the frontend URL including protocol and port

**Port already in use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Module not found**
```bash
cd server   # or client
rm -rf node_modules package-lock.json
npm install
```

**NLP service not responding**
- Ensure Python service is running on `http://localhost:8000`
- Run `pip install -r requirements.txt` inside `nltk-service/`

---

## Security

- JWT access tokens expire in **15 minutes**, refresh tokens in **7 days**
- Tokens stored in **httpOnly cookies** (XSS-proof)
- File uploads restricted to PDF/DOCX/DOC, max **5MB**, MIME-validated
- Auth endpoints rate-limited to **10 requests per 15 minutes** per IP
- All inputs validated with `express-validator`
- Security headers applied via `helmet`

---

## Production Deployment

```bash
# Build frontend
cd client
npm run build

# Run backend
cd ../server
NODE_ENV=production node src/app.js
```

Before deploying:
1. Set real secrets in `server/.env.production`
2. Set production API URL in `client/.env.production`
3. Enable HTTPS (required for secure cookies)
4. Set `CLIENT_ORIGIN` to your production domain
5. Configure MongoDB with backups enabled

---

## Tech Stack

- **Backend:** Express.js, MongoDB, Mongoose, JWT, Multer
- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS
- **NLP:** Python, NLTK
- **Security:** Helmet, express-rate-limit, express-validator, bcryptjs

---

## License

MIT