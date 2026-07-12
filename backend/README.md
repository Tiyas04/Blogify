# 🚀 Blogify Backend

A modern, scalable RESTful backend for **Blogify**, a full-stack blogging platform built with **FastAPI**, **MongoDB**, and **Cloudinary**.

The backend provides secure JWT authentication, blog management, comments, likes, image uploads, and follows a clean modular architecture for easy maintenance and scalability.

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- User Logout
- JWT Authentication
- HTTP-Only Cookie Authentication
- Password Hashing using Bcrypt
- User Profile Retrieval
- Update User Profile
- Avatar Upload to Cloudinary

---

### 📝 Blog Management
- Create Blog
- Update Blog
- Delete Blog
- Get Blog by ID
- Get All Blogs
- Search Blogs
- Category Filtering
- Pagination
- Cover Image Upload

---

### 💬 Comments
- Add Comment
- Get All Comments of a Blog
- Update Comment
- Delete Comment

---

### ❤️ Likes
- Toggle Like / Unlike
- Get Blog Like Count
- Check Whether Current User Liked a Blog

---

### ☁️ Media Uploads
- User Avatar Upload
- Blog Cover Image Upload
- Cloudinary Integration

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | FastAPI |
| Language | Python |
| Database | MongoDB |
| ODM | Motor (Async MongoDB Driver) |
| Authentication | JWT + HTTPOnly Cookies |
| Password Hashing | Passlib (Bcrypt) |
| Image Storage | Cloudinary |
| Validation | Pydantic |
| Server | Uvicorn |
| Environment | python-dotenv |

---

# 📁 Project Structure

```text
backend/
│
├── app/
│   ├── config/
│   │   ├── db.py
│   │   ├── security.py
│   │   └── settings.py
│   │
│   ├── dependencies/
│   │   └── auth_dependency.py
│   │
│   ├── models/
│   │   ├── user_model.py
│   │   ├── blog_model.py
│   │   ├── comment_model.py
│   │   └── likes_model.py
│   │
│   ├── schemas/
│   │   ├── user_schema.py
│   │   ├── blog_schema.py
│   │   ├── comment_schema.py
│   │   └── likes_schema.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── blog_service.py
│   │   ├── comments_service.py
│   │   └── likes_service.py
│   │
│   ├── routes/
│   │   ├── auth_route.py
│   │   ├── blog_route.py
│   │   ├── comment_route.py
│   │   └── likes_route.py
│   │
│   ├── utils/
│   │   └── cloudinary.py
│   │
│   └── main.py
│
├── requirements.txt
└── .gitignore
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=

DATABASE_NAME=

HOST=

PORT=

ACCESS_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=

REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/blogify-backend.git
```

Move into the project

```bash
cd blogify-backend
```

Create a virtual environment

```bash
python -m venv venv
```

Activate the virtual environment

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

Run the development server

```bash
uvicorn app.main:app --reload
```

---

# 📚 API Documentation

After running the server

Swagger UI

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |
| POST | /auth/logout |
| GET | /auth/profile |
| PATCH | /auth/update-profile |

---

## Blogs

| Method | Endpoint |
|---------|----------|
| POST | /blogs/create-blog |
| GET | /blogs/get-all-blogs |
| GET | /blogs/{blog_id} |
| PATCH | /blogs/update-blog/{blog_id} |
| DELETE | /blogs/delete-blog/{blog_id} |

---

## Comments

| Method | Endpoint |
|---------|----------|
| POST | /comments/blog/{blog_id} |
| GET | /comments/blog/{blog_id} |
| PUT | /comments/{comment_id} |
| DELETE | /comments/{comment_id} |

---

## Likes

| Method | Endpoint |
|---------|----------|
| POST | /likes/blog/{blog_id} |
| GET | /likes/blog/{blog_id} |
| GET | /likes/blog/{blog_id}/liked |

---

# 🔒 Authentication

Authentication uses:

- JWT Access Token
- JWT Refresh Token
- HTTPOnly Cookies
- Password Hashing using Bcrypt

Protected routes require a valid authenticated session.

---

# 🖼️ Image Uploads

Images are uploaded using Cloudinary.

Supported uploads include:

- User Avatars
- Blog Cover Images

---

# 🗄️ Database Collections

```text
users

blogs

comments

likes
```

---

# 🚀 Deployment

The backend can be deployed on:

- Render
- Railway
- Fly.io
- Docker
- AWS EC2
- DigitalOcean

Production server command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

# 🔮 Future Improvements

- Refresh Token Rotation
- Password Reset
- Email Verification
- User Following System
- Bookmarks
- Nested Comments
- Notifications
- Admin Dashboard
- Redis Caching
- WebSocket Support
- Docker Support
- Unit & Integration Tests

---

# 👨‍💻 Author

**Tiyas Mandal**

- GitHub: https://github.com/Tiyas04
- LinkedIn: https://linkedin.com/in/tiyasmandal

---

## ⭐ If you found this project helpful, consider giving it a star!