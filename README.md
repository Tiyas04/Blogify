<div align="center">

# 📰 Blogify

### *The Brain Dump — A Modern Full-Stack Blogging Platform*

Write beautifully. Read effortlessly.

Built with **React**, **FastAPI**, **MongoDB**, and **Cloudinary**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 About

**Blogify** is a modern full-stack blogging platform inspired by premium digital publications. It provides an elegant writing experience, powerful content management, secure authentication, and a beautiful editorial interface optimized for both desktop and mobile devices.

The project follows a clean separation between the frontend and backend while implementing modern authentication, responsive UI, and scalable REST APIs. :contentReference[oaicite:0]{index=0}

---

# ✨ Features

## 👤 Authentication

- User Registration
- Secure Login
- JWT Authentication
- HTTPOnly Cookies
- Refresh Token Authentication
- Protected Routes
- Profile Management

---

## ✍️ Blog Management

- Create Blog
- Edit Blog
- Delete Blog
- Upload Cover Images
- Categories
- Tags
- Search Blogs
- Pagination
- Sorting

---

## ❤️ Community Features

- Like Blogs
- Unlike Blogs
- Comment System
- Edit Comments
- Delete Comments
- Author Profiles

---

## 🎨 User Experience

- Editorial-inspired UI
- Light / Dark Theme
- Responsive Design
- Beautiful Typography
- Loading Skeletons
- Smooth Animations
- Infinite Marquee
- Search Experience

---

# 🏗 Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router
- TanStack React Query
- Axios
- React Hook Form
- Zod
- Framer Motion
- Lucide React

---

## Backend

- FastAPI
- Python
- MongoDB
- Motor (Async MongoDB)
- JWT
- Bcrypt
- Cloudinary
- Pydantic

---

## Database

- MongoDB Atlas

---

## Storage

- Cloudinary

---

# 📁 Project Structure

```text
Blogify/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── README.md
│
└── README.md
```

---

# ⚙️ Architecture

```text
                 React + Vite
                      │
                Axios + React Query
                      │
             HTTPOnly Cookie Authentication
                      │
                  FastAPI Backend
                      │
        ┌─────────────┼──────────────┐
        │             │              │
    MongoDB      Cloudinary      JWT Auth
```

---

# 🚀 Core Features

### Authentication

- Register
- Login
- Logout
- Profile Update
- Automatic Session Refresh

### Blogs

- CRUD Operations
- Category Filtering
- Search
- Pagination
- Image Upload

### Comments

- Create
- Update
- Delete
- View Comments

### Likes

- Like / Unlike
- Like Count
- Check Like Status

---

# 🎨 UI Highlights

- Editorial Digital Journal Design
- Glass-inspired Interface
- Responsive Layout
- Smooth Animations
- Dark Mode
- Beautiful Typography
- Infinite Marquee Banner

---

# 🔐 Authentication Flow

```
User Login
      │
      ▼
JWT Access Token
      │
HTTPOnly Cookie
      │
Authenticated Requests
      │
Access Token Expired
      │
Refresh Token
      │
New Access Token Generated
```

---

# 🌐 REST API

## Authentication

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/profile
PATCH  /auth/update-profile
```

---

## Blogs

```
POST    /blogs/create-blog
GET     /blogs/get-all-blogs
GET     /blogs/{id}
PATCH   /blogs/update-blog/{id}
DELETE  /blogs/delete-blog/{id}
```

---

## Comments

```
POST    /comments/blog/{blogId}
GET     /comments/blog/{blogId}
PUT     /comments/{commentId}
DELETE  /comments/{commentId}
```

---

## Likes

```
POST   /likes/blog/{blogId}
GET    /likes/blog/{blogId}
GET    /likes/blog/{blogId}/liked
```

---

# 🖥 Local Setup

## Clone Repository

```bash
git clone https://github.com/Tiyas04/Blogify.git

cd Blogify
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on

```
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run server

```bash
fastapi dev app/main.py
```

or

```bash
uvicorn app.main:app --reload
```

Runs on

```
http://localhost:8000
```

---

# 🔑 Environment Variables

## Backend

Create

```
backend/.env
```

```env
HOST=127.0.0.1
PORT=8000

MONGODB_URI=

DATABASE_NAME=Blogify

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=30

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=7

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

LIVE_URL=http://localhost:5173
```

---

## Frontend

Create

```
frontend/.env
```

```env
VITE_API_URL=http://localhost:8000
```

---

# 🚀 Deployment

### Frontend

- Vercel

### Backend

- Render / Railway / VPS

### Database

- MongoDB Atlas

### Media Storage

- Cloudinary

---

# 📷 Screenshots

Add screenshots here.

```
assets/

Home.png

Explore.png

Blog.png

Write.png

Profile.png
```

---

# 🔮 Future Improvements

- Rich Text Editor
- Markdown Support
- Drafts
- Bookmarks
- Notifications
- Reading History
- AI Writing Assistant
- User Following
- Trending Blogs
- Email Verification
- Password Reset
- Admin Dashboard

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

### **Tiyas Mandal**

GitHub

> https://github.com/Tiyas04

LinkedIn

> https://linkedin.com/in/Tiyas04

---

<div align="center">

### ⭐ Star this repository if you found it useful!

Made with ❤️ using React, FastAPI & MongoDB.

</div>