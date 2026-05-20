# Blog Full-Stack Monorepo

This project is a full-stack blogging application organized as a **monorepo**. It keeps the frontend, backend, and shared code in one repository for easier development and maintenance.

## About the Monorepo

A monorepo stores multiple related projects in a single codebase. In this setup:

- `frontend` contains the frontend application
- `backend` contains the backend API
- `packages/shared` contains reusable shared code

Benefits of this structure:

- shared types and utilities across apps
- simpler dependency management
- consistent tooling and scripts
- easier collaboration across the stack

## Project Structure

```text
Blog/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## Features

- User authentication
- Create, edit, and delete blog posts
- View blog post listings and details
- REST API backend
- Shared types and utilities

## Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Node.js / Express
- **Database:** MongoDB / PostgreSQL
- **Monorepo Tooling:** pnpm workspaces

## Getting Started

### Prerequisites

- Node.js installed
- pnpm installed
- A running database instance

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create environment files in the required folders:

```bash
frontend/.env
backend/.env
```

Example backend variables:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

Example frontend variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Running the Project

### Start All Apps

```bash
npm dev
```

### Run Frontend Only

```bash
npm dev:frontend
```

### Run Backend Only

```bash
npm dev:backend
```

## Build

```bash
npm run build
```

## Notes

- Update package names and script names to match your actual setup.
- Make sure the frontend API URL matches the backend port.

## License

This project is for learning and development purposes.
