# Process Tracker 🚀

> **Futuristic, Instagram-Style Executive Delivery & Project Milestone Cockpit**  
> Built for Business Analysts, Digital Transformation Architects, and Enterprise Stakeholders to visualize daily delivery progress with absolute transparency and high-tech elegance.

---

## 🌟 Overview & Key Capabilities

- **Instagram-Style Daily Timeline**: Real-time chronological feed with author avatars, phase tags, sprint narratives, high-res prototype screenshots, interactive reactions (`🔥`, `👍`, `❤️`), and collapsible feedback threads.
- **Client Milestone HUD**:
  - Animated SVG circular progress ring indicating percentage complete with glowing gradients.
  - Pulsing glowing stage stepper tracking: `Planning` ➔ `In Progress` ➔ `Review` ➔ `Completed`.
  - Velocity & overview stats cards (Logged updates, discussion notes, phases remaining).
- **Strict Role Isolation & Security**:
  - **Admin**: Provision client & team accounts, create and assign projects to clients, delete users, and view platform metrics with an interactive activity velocity bar chart.
  - **Team Member**: Publish daily updates with stage selector, 0–100% progress slider, rich sprint description, and photo upload.
  - **Client**: Strict zero-leakage isolation. Clients log in and see **only** their assigned project(s), reactions, and comments. No self-registration.
- **Cross-Role System Notifications**:
  - Clients are automatically notified when new updates are published or new projects are initiated.
  - Team members are automatically notified when clients comment on project updates.
  - Interactive notification drawer with unread counter, "Mark read", and "Clear all".
- **Enterprise Security**:
  - JWT authentication with bcrypt-hashed passwords.
  - Server-side role enforcement middleware on every route.
  - Rate limiting on authentication routes.
  - File upload restrictions (images only, 5MB limit).
  - Password change capability for every user.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express
- **Database & ORM**: SQLite, Prisma ORM
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **File Uploads**: `multer` with static serving from `/uploads`
- **Rate Limiting**: `express-rate-limit`

---

## 📁 Project Architecture

```
process-tracker/
├── client/                     # Frontend React + Vite + Tailwind application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Navbar, CircularProgressRing, StageStepper, FeedPost, ChangePasswordModal
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── pages/              # LoginPage, ClientDashboard, TeamDashboard, AdminDashboard
│   │   ├── utils/              # api fetch helper
│   │   ├── App.jsx             # Role-based route controller & perspective switcher
│   │   ├── index.css           # Neon cyberpunk theme & glassmorphic styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend Node.js Express API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma models: User, Project, Update, Reaction, Comment, Notification
│   │   └── seed.js             # Seeder with demo accounts & sample deliverables
│   ├── src/
│   │   ├── controllers/        # auth, user, project, update, interaction, notification, admin
│   │   ├── middleware/         # auth, roles, upload, rateLimiter
│   │   ├── routes/             # authRoutes, userRoutes, projectRoutes, updateRoutes, etc.
│   │   ├── index.js            # Express application entry point
│   │   └── prisma.js           # Prisma client instance
│   ├── uploads/                # Statically served user & seed uploads
│   ├── .env.example
│   ├── .env
│   └── package.json
├── .env.example
└── README.md
```

---

## 🎈 Deploy to Streamlit Community Cloud (1-Click & Free)

This repository includes a standalone, high-performance Streamlit application (`app.py`) replicating the entire **BA Process Tracker** cockpit with interactive Plotly analytics, 10-step BABOK delivery lifecycle, requirements traceability matrix, and stakeholder 2x2 grid.

### Instant 1-Click Cloud Deployment Steps:
1. Go to **[share.streamlit.io](https://share.streamlit.io)** and log in with your GitHub account.
2. Click **"Create app"** / **"New app"**.
3. Select your repository: **`DhaneeshVijayanand/Process-Tracker-`**
4. Set Branch: **`main`**
5. Set Main file path: **`app.py`**
6. Click **"Deploy!"**
7. Your live public dashboard will instantly launch at a permanent `https://<your-app>.streamlit.app` URL!

### Run Streamlit Locally:
```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Initialize SQLite database with Prisma migrations
npx prisma db push

# Seed the database with demo accounts & sample project
npm run db:seed

# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

In a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

The database is pre-seeded with three demo accounts:

| Role | User ID | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Global control, user & project provisioning, velocity analytics bar chart |
| **Team Member** | `team` | `team123` | Publish daily milestone updates with photos, stages, and progress slider |
| **Client** | `client` | `client123` | Strictly view own project feed, animated circular gauge, reactions & comments |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/login` (Rate limited): Authenticate user ID & password, returns JWT token.
- `GET /api/auth/me`: Retrieve active profile session.
- `POST /api/auth/change-password`: Update account password.

### User Management (Admin Only)
- `GET /api/users`: List all platform users and statistics.
- `POST /api/users`: Provision a new client, team, or admin account.
- `DELETE /api/users/:id`: Remove user and cascade delete projects/updates.

### Projects
- `GET /api/projects`: List projects (filtered to client's own projects for Client role; all for Admin/Team).
- `POST /api/projects` (Admin): Create a project and assign it to a client.
- `GET /api/projects/:id`: Get project details.
- `DELETE /api/projects/:id` (Admin): Delete project.

### Daily Updates
- `GET /api/projects/:id/updates`: List chronological updates for a project (includes author, reactions, and comments).
- `POST /api/projects/:id/updates` (Team/Admin): Post a daily progress log with optional photo upload. Automatically updates project stage and progress, and notifies the client.

### Interactions
- `POST /api/updates/:id/react`: Toggle emoji reaction (`🔥`, `👍`, `❤️`).
- `POST /api/updates/:id/comments`: Post feedback comment (notifies team member if client commented).

### Notifications
- `GET /api/notifications`: Retrieve current user's alerts.
- `PATCH /api/notifications/read`: Mark notification(s) as read.
- `DELETE /api/notifications`: Clear all notifications.

### Admin Analytics
- `GET /api/admin/stats`: Aggregate system metrics and updates-per-project bar chart data.

---

## 🔒 Security Measures
- **Password Protection**: Salted bcrypt hashing with 10 rounds.
- **Strict Role Verification**: Role-based access control (RBAC) enforced on the server.
- **Client Data Isolation**: Query filters enforce that clients can never access or query other clients' projects.
- **Upload Restrictions**: Multer allows only valid MIME images up to 5MB.
- **Brute Force Protection**: IP rate limiting on login attempts.
