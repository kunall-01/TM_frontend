 # Team Task Manager – Frontend

A simple and clean task management web application where users can manage projects, assign tasks, and track progress.

---

## 🚀 Live Demo

👉 [https://project-payjb.vercel.app](https://project-payjb.vercel.app/)

---

## 📌 Features

* User Authentication (Login / Signup)
* Role-based access (Admin / Member)
* Create and manage projects
* Create, assign, and update tasks
* Task status tracking (Pending, In Progress, Done)
* Simple dashboard overview

---

## ⚙️ Tech Stack

* React (Vite)
* Zustand (State Management)
* React Query (API handling & caching)
* Axios
* Tailwind CSS

---

## 📁 Folder Structure

```
src/
  ├── api/          # API calls
  ├── components/   # Reusable components
  ├── pages/        # Main pages
  ├── store/        # Zustand store
  ├── hooks/        # Custom hooks
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```
git clone [https://github.com/kunall-01/TM_frontend.git](https://github.com/kunall-01/TM_frontend.git)
cd frontend
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=https://your-backend-url.com/api
```

---

### 4. Run locally

```
npm run dev
```

---

### 5. Build

```
npm run build
```

---

## 🔗 API Integration

All API calls are handled using Axios and React Query.
Base URL is configured using environment variables.

---

## 📦 Deployment

Frontend is deployed on **Vercel**.

---

## 🎯 Notes

* UI is intentionally kept simple and clean
* Focus is on functionality and proper state management
* Authentication handled using JWT

---

## 👨‍💻 Author

Kunal
