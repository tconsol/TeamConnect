# TCON Solutions Full-Stack SaaS Website System

A production-ready, cinematic, multi-page SaaS website system for **TCON Solutions** built with React, Node.js, Express, and MongoDB.

## Architecture

```
TeamConnect/
├── client/          # Public website (React + TypeScript + Vite)
├── admin/           # Admin dashboard (React + TypeScript + Vite)
├── server/          # Backend API (Node.js + Express + MongoDB)
└── README.md
```

## Tech Stack

### Client (Port 5173)
- React 18, TypeScript, Vite
- Tailwind CSS (custom cinematic design system)
- GSAP + ScrollTrigger (animations)
- React Three Fiber + Three.js (3D hero)
- Lenis (smooth scrolling)
- React Query, React Router 6, Framer Motion

### Admin (Port 5174)
- React 18, TypeScript, Vite
- Tailwind CSS (admin dark theme)
- React Query, React Router 6
- react-hot-toast

### Server (Port 5000)
- Node.js, Express
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Multer + GCP Storage (file uploads)
- Nodemailer (emails)
- Zod (validation), Winston (logging)
- Helmet, CORS, express-rate-limit

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) GCP Storage bucket for file uploads

### 1. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secrets, etc.
npm install
npm run seed    # Seeds admin user + CMS content
npm run dev     # Starts on port 5000
```

**Default admin credentials:**
- Email: `admin@tconsolutions.com`
- Password: `Admin@123456`

### 2. Client Setup

```bash
cd client
npm install
npm run dev     # Starts on port 5173
```

### 3. Admin Setup

```bash
cd admin
npm install
npm run dev     # Starts on port 5174
```

## API Endpoints

Base URL: `/api/v1`

| Module       | Endpoints                              |
|-------------|----------------------------------------|
| Auth        | POST /auth/login, /auth/refresh, /auth/logout, GET /auth/me |
| CMS         | GET /cms/:page, GET /cms, PUT /cms/:page |
| Services    | CRUD /services, GET /services/:slug    |
| Portfolio   | CRUD /portfolio, GET /portfolio/:slug  |
| Jobs        | CRUD /jobs                             |
| Applications| GET /applications, POST /applications, PATCH /applications/:id/status |
| Leads       | GET /leads, POST /leads, PATCH /leads/:id/status, DELETE /leads/:id |
| Dashboard   | GET /dashboard/stats                   |

## Pages

### Client
- Home (3D hero, stats, services, portfolio, process, CTA)
- About (story, mission/vision, values, team)
- Services (service cards with features)
- Solutions (industry solutions)
- Portfolio (filterable project grid)
- Portfolio Details (dynamic slug-based)
- Careers (job listings + apply modal)
- Contact (form with service/budget)

### Admin
- Dashboard (stats, lead status, activity log)
- CMS (JSON content editor per page)
- Services (CRUD with image upload)
- Portfolio (CRUD with thumbnail upload)
- Careers (CRUD for job listings)
- Applications (status management)
- Leads (search, filter, status management)

## Design System

- Background: `#050505`
- Secondary: `#0B0B0F`
- Accent Indigo: `#6366F1`
- Accent Blue: `#3B82F6`
- Font: Inter
- Effects: Glassmorphism, gradient borders, glow shadows, noise texture