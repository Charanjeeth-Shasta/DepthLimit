# DepthLimit

A Smart AI Interview Practice Platform with resume upload, JD-based question generation, and real-time scoring.

---

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free tier)
- **Python** 3.8+ (for NLP service)

---

## Installation

### 1. Clone and Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in another terminal)
cd client
npm install

# NLP Service (in another terminal)
cd nltk-service
pip install -r requirements.txt
```

---

## Environment Variables

### Server (`server/.env`)

```env
# MongoDB
MONGO_URI=mongodb://username:password@cluster.mongodb.net/depthlimit?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets (generate strong random 32+ char strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-this!
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change!

# Frontend Origin (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

**For local MongoDB:**

```env
MONGO_URI=mongodb://localhost:27017/depthlimit
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## Running in Development

Open 3 terminals and run:

### Terminal 1: Backend

```bash
cd server
npm run dev
```

Runs on `http://localhost:5000`

### Terminal 2: Frontend

```bash
cd client
npm run dev
```

Runs on `http://localhost:5173`

### Terminal 3: NLP Service

```bash
cd nltk-service
python app.py
```

Runs on `http://localhost:8000`

Then open **http://localhost:5173** in your browser.

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login (returns httpOnly cookie)
- `GET /api/auth/profile` — Get user profile (protected)
- `POST /api/auth/logout` — Logout (clears cookie)

### Resume

- `POST /api/resume/upload` — Upload resume (PDF/DOCX/DOC, max 5MB)
- `GET /api/resume` — Get all resumes
- `DELETE /api/resume/:id` — Delete resume

### Interview

- `POST /api/interview/generate` — Generate interview questions
- `POST /api/interview/submit-answer/:sessionId` — Submit and score answer
- `GET /api/interview/sessions` — Get all interview sessions

---

## Project Structure

```
depth-limit/
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation
│   │   ├── config/      # Database, file upload
│   │   └── app.js       # Express app
│   ├── .env
│   └── package.json
│
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # UI components
│   │   ├── context/     # Auth state
│   │   ├── services/    # API client
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── nltk-service/        # Python NLP service
    ├── app.py
    └── requirements.txt
```

---

## Common Issues

### MongoDB Connection Failed

- **Local:** Run `mongod` in a separate terminal
- **Atlas:** Check connection string, whitelist your IP, verify username/password encoding

### CORS Error

- Ensure `CLIENT_ORIGIN` in `server/.env` exactly matches frontend URL (including protocol/port)

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Module Not Found

```bash
cd server  # or client
rm -rf node_modules package-lock.json
npm install
```

### NLP Service Not Responding

- Ensure Python NLP service is running on `http://localhost:8000`
- Install Python dependencies: `pip install -r requirements.txt`

---

## Security Notes

- **JWT:** Access tokens expire in 15 minutes, refresh tokens in 7 days
- **Cookies:** Tokens stored in httpOnly, secure cookies (XSS-proof)
- **File Upload:** Only PDF/DOCX/DOC allowed, max 5MB, validated MIME types
- **Rate Limiting:** 10 auth attempts per 15 minutes per IP
- **Input Validation:** All user inputs validated with express-validator

---

## Production Deployment

### Build Frontend

```bash
cd client
npm run build
```

### Run Backend

```bash
cd server
NODE_ENV=production node src/app.js
```

**Before deploying:**

1. Update `server/.env.production` with production secrets
2. Update `client/.env.production` with production API URL
3. Enable HTTPS (required for secure cookies)
4. Set `CLIENT_ORIGIN` to production domain
5. Configure MongoDB with backups

---

## Tech Stack

- **Backend:** Express.js, MongoDB, Mongoose, JWT, Multer
- **Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS
- **NLP:** Python, NLTK (question generation & scoring)
- **Security:** Helmet, express-rate-limit, express-validator, bcryptjs

---

## License

MIT

