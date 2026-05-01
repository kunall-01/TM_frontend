# TeamTask — Team Task Manager

A full-stack task management app with JWT auth, role-based access, and a clean dark UI.

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt  
**Frontend:** React (Vite), Zustand, React Query, Axios, Tailwind CSS

---

## Local Setup

### 1. Clone & install

```bash
# Backend
cd backend
npm install
cp .env.example .env    # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env    # fill in your values
```

### 2. Configure environment

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/teamtask
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App runs at: http://localhost:5173

---

## Roles

| Role   | Can create projects | Can create tasks | Can update task status |
|--------|---------------------|------------------|------------------------|
| Admin  | ✅                  | ✅               | ✅                     |
| Member | ❌                  | ❌               | ✅ (own tasks only)    |

---

## API Reference

### Auth
| Method | Endpoint           | Auth | Description     |
|--------|--------------------|------|-----------------|
| POST   | /api/auth/signup   | No   | Register user   |
| POST   | /api/auth/login    | No   | Login           |
| GET    | /api/auth/me       | Yes  | Get current user|

### Projects
| Method | Endpoint            | Role  | Description        |
|--------|---------------------|-------|--------------------|
| GET    | /api/projects       | Any   | List projects      |
| POST   | /api/projects       | Admin | Create project     |
| GET    | /api/projects/users | Any   | List all users     |

### Tasks
| Method | Endpoint         | Role        | Description        |
|--------|------------------|-------------|--------------------|
| GET    | /api/tasks       | Any         | List tasks         |
| GET    | /api/tasks/stats | Any         | Dashboard stats    |
| POST   | /api/tasks       | Admin       | Create task        |
| PATCH  | /api/tasks/:id   | Admin/Owner | Update status      |

---

## Deployment on Railway

### Backend

1. Push `backend/` folder to a GitHub repo (or monorepo)
2. Create a new Railway project → **Deploy from GitHub**
3. Set environment variables in Railway dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random secret
   - `JWT_EXPIRES_IN` — `7d`
   - `CLIENT_URL` — your frontend Railway URL (set after frontend deploys)
4. Railway auto-detects Node.js and runs `npm start`

### Frontend

1. Create another Railway service → **Deploy from GitHub** (same repo, root = `frontend/`)
2. Set build command: `npm run build`
3. Set start command: `npx serve dist -s -l 3000`
4. Set environment variable:
   - `VITE_API_URL` — your backend Railway URL + `/api`

### MongoDB Atlas (free tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist `0.0.0.0/0` in Network Access (for Railway)
5. Copy the connection string into `MONGO_URI`

---

## Project Structure

```
teamtask/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── utils/
│   │   └── jwt.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── hooks/
        │   └── useApi.js
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   └── Tasks.jsx
        ├── store/
        │   └── authStore.js
        ├── App.jsx
        └── main.jsx
```
