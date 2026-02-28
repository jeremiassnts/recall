# 🧠 Recall

## Technical Planning & Architecture Document (Pre-Implementation)

> ⚠️ This document defines the complete system architecture and development plan.
> This is strictly a **planning document**.
> No code should be generated at this stage.

---

# 1. 📌 Product Identity

## Name

**Recall**

### Meaning

* Represents remembering progress
* Tracking interviews
* Keeping your job search organized
* Professional, minimal, focused

---

# 2. 🎯 Product Overview

Recall is a fullstack SaaS platform for tracking job applications.

UX inspiration:

* Trello
* Linear

The system is designed for professionals (especially developers) applying to multiple jobs and needing:

* Clear stage visibility
* Interview calendar tracking
* Resume management
* Pipeline analytics

---

# 3. 🖥 Entry Experience (No Landing Page)

There will be **no marketing landing page**.

The first route (`/`) will be the login screen.

## Split-Screen Layout

```
-------------------------------------
| Left Side      | Right Side      |
|----------------|-----------------|
| Login Form     | App Information |
-------------------------------------
```

### Left Side (Authentication Panel)

* Recall logo (minimal wordmark)
* "Login with Google" button
* Subtle description:
  *"Track your job applications with clarity."*
* Dark/light mode toggle (small, top corner)
* Minimal UI

### Right Side (Information Panel)

Contains:

* App name: Recall
* Short explanation:

  * Visual pipeline tracking
  * Interview calendar
  * Resume storage
  * Analytics overview
* Simple illustration or abstract background
* Subtle dark blue accent gradients

This screen sets a professional tone immediately.

---

# 4. 🎨 Design System

## Design Philosophy

* Minimal
* Calm
* Professional
* Zero clutter
* Clear spacing hierarchy

## Color Strategy

Primary palette:

* Neutral base (white / near-black)
* Subtle gray layers

Accent color:

* **Dark Blue** (used sparingly)

  * Buttons
  * Active stage indicator
  * Focus states
  * Links
  * Graph highlights

Dark blue should never dominate the interface.
It is used only for intentional emphasis.

---

## Light & Dark Mode

* Tailwind class strategy (`class="dark"`)
* Persist preference in localStorage
* Detect system preference
* Dark mode uses deep charcoal background with dark blue highlights

---

## Animations

* Subtle column transitions
* Card drag feedback
* Smooth modal open/close
* Loading skeleton shimmer
* No exaggerated motion

Framer Motion recommended for controlled micro-animations.

---

# 5. 🧱 Technical Stack

## Authentication

* Auth0
* Google login enabled
* JWT validation in backend
* Secure session handling

## Frontend

* React 18
* Next.js 16 (App Router)
* TypeScript
* TailwindCSS
* shadcn/ui
* TanStack Query
* React Hook Form + Zod
* Framer Motion

## Backend

* Node.js
* Express
* MongoDB (Atlas recommended)
* Mongoose for schema enforcement

## Storage

* Cloudflare R2 (resume PDFs)
* Signed URL strategy

## Monorepo

* Turborepo

## Testing

* Backend: Jest
* Frontend: Vitest + React Testing Library
* Optional E2E: Playwright

## Infrastructure

* Docker (multi-stage builds)
* GitHub Actions CI/CD
* Deployment target: Coolify

---

# 6. 🏗 High-Level Architecture

```
Client (Next.js)
        |
        | HTTPS + JWT
        v
Express API
        |
        v
MongoDB Atlas

File Upload:
Client → API → R2 (Signed URL)
```

---

# 7. 🔐 Authentication Flow

1. User clicks "Login with Google"
2. Auth0 handles OAuth
3. JWT issued
4. Token stored securely (httpOnly cookie preferred)
5. Backend middleware validates token
6. User record synced/created in MongoDB

No unauthenticated access to any internal route.

---

# 8. 📦 Monorepo Structure

```
apps/
  web/      → Next.js app
  api/      → Express backend

packages/
  ui/       → Shared UI components
  config/   → Shared config
  types/    → Shared types
```

---

# 9. 📊 Core Features

## 9.1 Job Application CRUD

Each application includes:

* Company name
* Job title
* Job URL
* Description
* Stage
* Status
* Applied date
* Notes
* Resume reference
* Interviews array

---

## 9.2 Kanban Board

Columns represent stages:

* Wishlist
* Applied
* Screening
* Technical
* Final Interview
* Offer
* Rejected

Requirements:

* Drag and drop between columns
* Persistent order
* Optimistic UI
* Smooth animation
* Mobile responsive

Library: `@dnd-kit/core`

Order Strategy:

* Numeric indexing
* Or recalculated array order

---

## 9.3 Calendar View

Features:

* Monthly view
* Weekly view
* Click event → open job detail
* Google Calendar add-event button
* Timezone aware (store UTC)

---

## 9.4 Resume Storage

* Upload PDF only
* Max file size limit
* Replace resume
* Associate resume with job application
* Signed R2 access URLs

---

## 9.5 Dashboard

Metrics:

* Total applications
* Active
* Rejected
* Offers
* Applications per stage
* Conversion rates

Aggregation via Mongo pipelines.

---

# 10. 🗃 Database Models

## User

* auth0Id (unique)
* name
* email

## JobApplication

* userId
* companyName
* jobTitle
* jobUrl
* description
* stage
* order
* status
* appliedDate
* notes
* resumeId
* interviews[]

Indexes:

* userId
* stage
* appliedDate

---

## Resume

* userId
* r2Key
* fileName
* size

---

# 11. 🔒 Security Strategy

* JWT middleware
* Rate limiting
* Helmet headers
* CORS strict configuration
* Zod validation backend
* Mongo injection prevention
* Signed R2 URLs
* File type validation

---

# 12. ⚡ Performance Strategy

* Pagination
* Indexed queries
* Lazy-loaded columns
* Code splitting
* Avoid overfetching
* Debounced search
* Optimistic updates

---

# 13. 🐳 Docker Strategy

Backend:

* Multi-stage build
* TypeScript compile → dist
* Slim runtime image

Frontend:

* Next standalone build
* Optimized production output

---

# 14. 🚀 CI/CD Strategy

## Branching

* main → production
* develop → staging
* feature/* → PR

## GitHub Actions Pipeline

1. Install
2. Lint
3. Type check
4. Run tests
5. Build
6. Docker build
7. Push image
8. Deploy to Coolify

Environments:

* Dev
* Staging
* Production

---

# 15. 🗺 Development Phases

Phase 1 – Auth + User Sync
Phase 2 – Job CRUD
Phase 3 – Kanban Board
Phase 4 – Calendar
Phase 5 – Resume Upload
Phase 6 – Dashboard Analytics
Phase 7 – Hardening + Testing

---

# 16. ⚠️ Risks

| Risk                | Mitigation         |
| ------------------- | ------------------ |
| Drag lag            | Virtualization     |
| Calendar complexity | Mature library     |
| Token issues        | Use official SDK   |
| Storage growth      | Size limits        |
| Query slowdown      | Index optimization |

---

# 17. 📌 Future Improvements

* Customizable pipeline stages
* Tag system
* AI resume feedback
* Chrome extension
* Mobile app
* Team collaboration mode

---

# Final Statement

Recall is designed to be:

* Minimal
* Professional
* Calm
* Focused
* Structured

The login-first experience immediately communicates purpose and clarity.

Development should only begin after architectural validation.
