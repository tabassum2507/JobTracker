# Job Tracker

A full-stack job application tracker with a Kanban board, application stats, and AI-powered tools (cover letter generator, interview prep, and job search insights) powered by Groq + Llama 3.3.

## Features

- **Kanban board** — drag jobs across 7 stages: Saved → Applied → Phone Screen → Interview → Offer → Rejected → Ghosted
- **Stats bar** — live response rate, interview count, offer count
- **AI Assistant** — generate cover letters, interview questions, and search insights per job
- **Auth** — JWT-based register/login, all data scoped per user

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router v6, React Hot Toast |
| Backend | Node.js, Express, Mongoose, bcryptjs, jsonwebtoken |
| AI | Groq SDK (`llama-3.3-70b-versatile`) |
| Database | MongoDB 7 |
| Infrastructure | Docker, Docker Compose, Nginx |

---

## Environment Variables

Create `backend/.env` (for local/Docker) and set these variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string. Use `mongodb://mongo:27017/jobtracker` for Docker, or your Atlas URI for production |
| `JWT_SECRET` | Random secret string for signing JWTs — use a long random value |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |
| `PORT` | Port the backend listens on (default `5000`) |
| `FRONTEND_URL` | Your deployed frontend URL for CORS (e.g. `https://job-tracker.vercel.app`) |

For the frontend, set `VITE_API_URL` to your backend's URL (in Vercel dashboard or a local `.env` file):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000` or your Railway URL) |

### Getting a Groq API key

1. Go to [console.groq.com](https://console.groq.com) and sign in
2. Click **API Keys** in the left sidebar
3. Click **Create API key**, give it a name, and copy the key
4. Paste it as `GROQ_API_KEY` in your `.env`

---

## Local Development

### With Docker (recommended)

```bash
# 1. Copy and fill in env vars
cp .env.example backend/.env
# Edit backend/.env with your JWT_SECRET and GROQ_API_KEY

# 2. Start everything
docker compose up --build
```

- Frontend: http://localhost:80
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Without Docker

```bash
# Terminal 1 — Backend
cd backend
cp ../.env.example .env        # then fill in JWT_SECRET and GROQ_API_KEY
npm install
npm run dev                    # starts on :5000 with --watch

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                    # starts on :5173, proxies /api → :5000
```

The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically, so no CORS issues during local development without Docker.

---

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL` = your Railway backend URL
5. Deploy — the `vercel.json` handles SPA routing automatically

### Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select the repo and set **Root Directory** to `backend`
3. Add a **MongoDB** plugin (or use MongoDB Atlas and set `MONGO_URI` manually)
4. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `FRONTEND_URL` (your Vercel URL, e.g. `https://job-tracker.vercel.app`)
5. Railway auto-detects Node and runs `npm start`

> After deploying both, update `FRONTEND_URL` in Railway and `VITE_API_URL` in Vercel with the real URLs, then redeploy each once.

---

## Screenshots

_Coming soon_

---

## Project Structure

```
job-tracker/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/     # Login, Register, Dashboard
│   │   ├── components/# JobForm, JobCard, StatsBar, KanbanBoard, AIPanel
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── api.js     # Axios instance with auth interceptor
│   ├── Dockerfile
│   └── vercel.json
├── backend/           # Express API
│   ├── models/        # User.js, Job.js
│   ├── routes/        # auth.js, jobs.js, ai.js
│   ├── middleware/    # verifyToken.js
│   ├── server.js
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```
