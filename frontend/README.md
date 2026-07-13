# 📰 Blogify Frontend

A modern editorial blogging platform built with **React**, **Vite**, and **Tailwind CSS**, inspired by premium digital journals and newspapers.

Blogify focuses on readability, elegant typography, and a distraction-free writing experience while providing a smooth, responsive interface for discovering, reading, and publishing articles.

---

## ✨ Features

### 🏠 Home Experience
- Editorial-style landing page
- Featured articles
- Latest posts
- Category highlights
- Responsive layout
- Smooth page transitions

---

### 🔐 Authentication
- User Registration
- User Login
- HTTPOnly Cookie Authentication
- Persistent Sessions
- Protected Routes
- Profile Management

---

### 📝 Blog Management
- Create New Blog
- Edit Existing Blog
- Delete Blog
- Rich Cover Image Upload
- Category Selection
- Live Form Validation

---

### 🔍 Explore
- Search Blogs
- Category Filtering
- Pagination
- Sorting
- Fast Client-side Navigation

---

### 📖 Reading Experience
- Beautiful Editorial Layout
- Responsive Typography
- Reading Time
- Author Information
- Like & Comment Support
- Related Articles

---

### 👤 User Profile
- View Profile
- Edit Profile
- Update Avatar
- User's Published Articles

---

### 🎨 UI & UX
- Editorial Digital Journal Theme
- Light & Dark Mode
- Responsive Design
- Premium Typography
- Skeleton Loading States
- Animated Page Transitions
- Interactive Search Modal
- Floating Editorial Background
- Infinite Marquee Banner

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Bundler | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM |
| Server State | TanStack React Query |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Forms | React Hook Form |
| Validation | Zod |
| Icons | Lucide React |

---

# 📁 Project Structure

```text
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── navbar.jsx
│   │   ├── footer.jsx
│   │   ├── background.jsx
│   │   └── TiltedMarquee.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Explore.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── WritePost.jsx
│   │   ├── Profile.jsx
│   │   └── Auth.jsx
│   │
│   ├── utils/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── vite.config.js
├── package.json
└── vercel.json
```

---

# 🎨 Design Philosophy

Blogify embraces an **Editorial Digital Journal** aesthetic inspired by premium publications.

### Theme Highlights

- Content-first interface
- Newspaper-inspired typography
- Spacious layouts
- Premium reading experience
- Minimal visual distractions
- Elegant animations
- Responsive across all devices

---

# 🌗 Theme

### ☀️ Light Mode

- Paper-inspired background
- Clean white surfaces
- Rich black typography
- Soft gray accents

### 🌙 Dark Mode

- Warm charcoal backgrounds
- Newspaper-inspired contrast
- Comfortable night reading
- Minimal blue-gray accents

---

# 🔤 Typography

| Purpose | Font |
|---------|------|
| Headings | Plus Jakarta Sans |
| Articles | Lora |
| UI Components | Outfit |
| Body Text | Mulish |

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/yourusername/blogify-frontend.git
```

Navigate into the project

```bash
cd blogify-frontend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_API_URL=http://localhost:8000
```

Start the development server

```bash
npm run dev
```

---

# 📦 Build for Production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🌐 Environment Variables

```env
VITE_API_URL=
```

Example

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

# 🔗 Backend Integration

The frontend communicates with the Blogify FastAPI backend using Axios.

Features include:

- HTTPOnly Cookie Authentication
- Automatic Cookie Handling
- Global Error Handling
- RESTful API Integration

---

# 📱 Pages

- Home
- Explore
- Blog Details
- Authentication
- Write Blog
- Edit Blog
- Profile

---

# ✨ UI Components

- Navbar
- Footer
- Featured Cards
- Blog Cards
- Category Badges
- Buttons
- Inputs
- Pagination
- Loading Skeletons
- Search Modal
- Background Pattern
- Tilted Marquee

---

# 🚀 Deployment

Deploy the frontend on **Vercel**.

```bash
npm run build
```

The included `vercel.json` ensures proper routing for React Router.

---

# 🔮 Future Improvements

- Rich Text Editor
- Draft Support
- Bookmarks
- Reading History
- Notifications
- Social Sharing
- Markdown Support
- Infinite Scrolling
- Progressive Web App (PWA)
- Offline Reading
- AI-powered Writing Assistant

---

# 👨‍💻 Author

**Tiyas Mandal**

- GitHub: https://github.com/Tiyas04
- LinkedIn: https://linkedin.com/in/tiyasmandal

---

## ⭐ If you like this project, consider giving it a star!