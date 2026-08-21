<p align="center">
  <h1 align="center">🏠 EstateX — Modern Real Estate Platform</h1>
  <p align="center">
    A full-stack MERN application for browsing, listing, and managing real estate properties with role-based dashboards, real-time chat, Stripe payments, and more.
  </p>
</p>

---

## 📋 Table of Contents

- [About](#about)
- [Problem, Solution & Impact](#-problem-solution--impact)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [License](#license)

---

## 🏗 About

**EstateX** is a premium real estate platform built with the MERN stack. It supports three distinct user roles — **User**, **Agent**, and **Admin** — each with a dedicated dashboard. Users can browse and save properties, submit inquiries, and leave reviews. Agents can list and manage properties with analytics. Admins have full control over users, properties, blogs, and reviews.

---

## 🎯 Problem, Solution & Impact

EstateX solves the fragmentation and trust gap in real estate discovery by unifying search, verified agent communication, and secure payments into one role-based platform.

| Stakeholder | Problem | Solution (EstateX Feature) | Impact |
|---|---|---|---|
| **🏠 Buyers / Renters** | Listings scattered across brokers, WhatsApp groups, and outdated classifieds. No real filtering. No record of agent conversations. | Advanced search & filters (location, price, type, bedrooms) + interactive Leaflet map view + Socket.io real-time chat with persistent history | A single trustworthy place to search, compare, and message agents directly — no more juggling ten disconnected channels |
| **🏢 Agents** | No centralized tool to manage listings. No visibility into performance. Leads lost across calls, texts, and walk-ins. | Agent dashboard with full property CRUD, structured inquiry pipeline, and Recharts-powered listing analytics | A free, lightweight CRM — manage listings, capture leads, and track what's converting, all in one place |
| **🛡 Admins / Platform Operators** | No way to moderate listing quality, fake agents, or unmoderated reviews. No platform-wide visibility. | Admin dashboard with RBAC-backed control over users, properties, blogs, and reviews + platform-wide analytics | Real moderation power to keep the marketplace clean, which keeps buyers and agents confident in using the platform |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HTTP-only cookies
- Role-based access control (User / Agent / Admin)
- Protected routes on both frontend and backend

### 🏘 Property Management
- Full CRUD operations for property listings
- Multi-image upload via **Cloudinary**
- Advanced filtering & search (location, price, type, bedrooms, etc.)
- Interactive map view with **Leaflet**
- Save / bookmark properties

### 💬 Real-Time Chat
- Socket.io–powered real-time messaging between users and agents
- Persistent chat history

### 💳 Payments
- Secure payments via **Stripe** integration
- Webhook support for payment verification

### 📝 Blog System
- Full CRUD blog management for admins
- Public blog listing with individual post pages

### ⭐ Reviews & Inquiries
- Users can review properties
- Inquiry system for contacting agents about listings

### 📊 Dashboards & Analytics
- **User Dashboard** — saved properties, inquiries, account settings
- **Agent Dashboard** — property listings, analytics, add/edit properties
- **Admin Dashboard** — manage users, agents, properties, blogs, reviews, and site analytics via **Recharts**

### 📧 Email Notifications
- Transactional emails via **Nodemailer** (SMTP)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| Redux Toolkit | Global state management |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| Socket.io Client | Real-time communication |
| Leaflet / React-Leaflet | Interactive maps |
| Recharts | Dashboard analytics charts |
| Swiper | Image carousels |
| Stripe.js | Payment UI |
| React Hot Toast | Toast notifications |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 9 | Database & ODM |
| Socket.io | Real-time WebSocket server |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image upload & storage |
| Multer | File upload middleware |
| Stripe | Payment processing |
| Nodemailer | Email service |
| express-validator | Request validation |
| cookie-parser | Cookie handling |

---

## 📁 Project Structure

```
Real_State/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── chatController.js
│   │   ├── paymentController.js
│   │   ├── blogController.js
│   │   ├── reviewController.js
│   │   ├── inquiryController.js
│   │   ├── savedController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/        # Auth, error handling, validation
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Chat.js
│   │   ├── Blog.js
│   │   ├── Review.js
│   │   ├── Inquiry.js
│   │   └── SavedProperty.js
│   ├── routes/            # Express route definitions
│   ├── socket/            # Socket.io initialization
│   ├── utils/             # Helper utilities
│   ├── server.js          # App entry point
│   └── vercel.json        # Vercel deployment config
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/           # Axios instance & config
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable UI components
│   │   │   ├── home/      # Homepage sections
│   │   │   ├── layout/    # Navbar, Footer, Sidebar
│   │   │   └── property/  # Property card component
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── agent/     # Agent dashboard pages
│   │   │   ├── auth/      # Login, Register, Forgot Password
│   │   │   ├── public/    # Home, Browse, Blog, About, Contact, FAQ
│   │   │   ├── user/      # User dashboard pages
│   │   │   └── shared/    # Shared pages
│   │   ├── store/         # Redux store & slices
│   │   └── utils/         # Frontend utilities
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas cluster)
- **Cloudinary** account (for image uploads)
- **Stripe** account (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/adityasharma0723/ESTATE.git
cd ESTATE
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then:

```bash
# Development
npm run dev

# Production
npm start
```

The API will run on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`.

---

## 🔑 Environment Variables

Create a `backend/.env` file with the following:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/estatex
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx

CLIENT_URL=http://localhost:5173
```

> A `.env.example` file is included in the backend directory for reference.

---

## 🌐 API Endpoints

| Route Prefix | Description |
|---|---|
| `POST /api/auth` | Register, Login, Logout, Forgot Password |
| `GET/PUT /api/users` | User profile & management |
| `GET/POST/PUT/DELETE /api/properties` | Property CRUD & search |
| `GET/POST /api/inquiries` | Property inquiries |
| `GET/POST/DELETE /api/reviews` | Property reviews |
| `GET/POST/PUT/DELETE /api/blogs` | Blog management |
| `GET/POST/DELETE /api/saved` | Saved/bookmarked properties |
| `GET/POST /api/chat` | Real-time chat messages |
| `POST /api/payments` | Stripe payment processing |
| `GET/PUT/DELETE /api/admin` | Admin operations |
| `GET /api/health` | Health check |

---

## 🚢 Deployment

Both the frontend and backend include `vercel.json` configs for easy deployment on **Vercel**:

1. Deploy the **backend** as a Vercel serverless function
2. Deploy the **frontend** as a Vite static site on Vercel
3. Set all environment variables in the Vercel dashboard
4. Update `CLIENT_URL` to point to your deployed frontend URL

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ using the MERN Stack
</p>
