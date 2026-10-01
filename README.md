# 🔧 FixItNow — Home Services Marketplace

<p align="center">
  <strong>Your Trusted Home Service Platform</strong>
</p>

<p align="center">
  A production-ready home services marketplace where customers can discover and book technicians, make secure online payments, track bookings, and leave reviews — while technicians manage services, availability, and jobs through role-based dashboards.
</p>

<p align="center">
  <a href="https://fixitnow-frontend-xi.vercel.app/">🌐 Live Demo</a> •
  <a href="https://github.com/mmahadi-ahmedd/FixItNow-Backend">⚙️ Backend Repository</a>
</p>

---

## 🚀 About The Project

**FixItNow** is a full-stack home services marketplace designed to connect customers with qualified service technicians.

Instead of building a simple CRUD application, the project focuses on solving real application-level problems:

* Role-based authentication and authorization
* Customer, technician, and admin workflows
* Booking lifecycle management
* Real Stripe payment processing
* Server-side validation
* Protected routes and API requests
* Responsive dashboards
* Error handling and loading states
* Relational database design
* Transaction-safe backend operations
* Production deployment

The application contains **three distinct user experiences**:

| Role               | Main Responsibilities                                                              |
| ------------------ | ---------------------------------------------------------------------------------- |
| 👤 **Customer**    | Discover services, book technicians, make payments, track jobs, review technicians |
| 🛠️ **Technician** | Manage profile, services, availability, and incoming bookings                      |
| 🛡️ **Admin**      | Manage users, bookings, categories, and platform activity                          |

---

# ✨ Core Features

## 👤 Customer Experience

* Register and login as a customer
* Google authentication
* Browse available services
* Search services and technicians
* Filter services by category
* View technician profiles
* View technician ratings and reviews
* Check service pricing
* Create bookings
* Track booking status
* Pay for accepted bookings through Stripe
* View payment history
* Leave reviews after completed jobs
* Manage personal profile
* Responsive customer dashboard

### Customer Booking Flow

```text
Browse Services
      ↓
Select Technician
      ↓
View Profile
      ↓
Book Service
      ↓
Technician Accepts
      ↓
Stripe Payment
      ↓
Payment Confirmation
      ↓
Job In Progress
      ↓
Completed
      ↓
Leave Review
```

---

## 🛠️ Technician Experience

Technicians have a dedicated dashboard for managing their professional activity.

### Features

* Technician registration
* Profile management
* Service management
* Skills and experience
* Pricing management
* Availability management
* Incoming booking requests
* Accept / decline bookings
* Update job status
* Track completed jobs
* View customer information
* Responsive technician dashboard

### Technician Booking Flow

```text
New Booking Request
        ↓
   Accept / Decline
        ↓
      ACCEPTED
        ↓
       PAID
        ↓
   IN_PROGRESS
        ↓
     COMPLETED
```

---

## 🛡️ Admin Experience

The admin dashboard provides platform-level management.

### Features

* View all users
* View customers and technicians
* Ban / unban users
* View platform-wide bookings
* Manage service categories
* Monitor booking activity
* Dashboard statistics
* Data visualization
* Protected admin routes

---

# 💳 Real Stripe Payment Integration

Payments are handled through **Stripe**, not simulated frontend buttons.

### Payment Flow

```text
Customer
   │
   ▼
Accepted Booking
   │
   ▼
Create Stripe Checkout Session
   │
   ▼
Stripe Hosted Checkout
   │
   ▼
Successful Payment
   │
   ▼
Stripe Webhook
   │
   ▼
Backend Verification
   │
   ▼
Database Transaction
   │
   ├── Payment → COMPLETED
   │
   └── Booking → PAID
```

The backend uses Stripe webhooks to verify successful payments and synchronize payment and booking state.

### Test Card

For local/demo testing:

```text
Card Number: 4242 4242 4242 4242
Expiry:      Any future date
CVC:         Any 3 digits
ZIP:         Any valid ZIP
```

---

# 🧠 Booking State Management

The booking system follows a controlled lifecycle rather than allowing arbitrary status updates.

```text
REQUESTED
    │
    ├───────────────┐
    │               │
    ▼               ▼
ACCEPTED         DECLINED
    │
    ▼
  PAID
    │
    ▼
IN_PROGRESS
    │
    ▼
COMPLETED
```

Customers can cancel eligible bookings before the job reaches `IN_PROGRESS`.

Invalid transitions are rejected by the backend instead of relying only on frontend validation.

This keeps business rules enforced at the API/service layer.

---

# 🏗️ Architecture

```text
┌──────────────────────────────────────────┐
│                Next.js                   │
│             App Router UI                │
└───────────────────┬──────────────────────┘
                    │
                    │ Axios
                    ▼
┌──────────────────────────────────────────┐
│          Next.js API Rewrites             │
│          Same-Origin API Proxy            │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│           Express REST API               │
│                                          │
│  Authentication                          │
│  Authorization                           │
│  Validation                              │
│  Business Logic                          │
│  Payment Processing                      │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│              Prisma ORM                  │
└───────────────────┬──────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│             PostgreSQL                   │
└──────────────────────────────────────────┘

                    │
                    ▼
             ┌──────────────┐
             │    Stripe    │
             └──────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

| Technology          | Purpose                                   |
| ------------------- | ----------------------------------------- |
| **Next.js 16**      | React framework & App Router              |
| **TypeScript**      | Type safety                               |
| **Tailwind CSS**    | Styling & responsive design               |
| **shadcn/ui**       | Reusable UI components                    |
| **Radix UI**        | Accessible UI primitives                  |
| **TanStack Query**  | Server-state management & synchronization |
| **React Hook Form** | Form management                           |
| **Zod**             | Client-side validation                    |
| **Recharts**        | Dashboard data visualization              |
| **Firebase Auth**   | Google OAuth                              |
| **next-themes**     | Dark/light mode                           |
| **Axios**           | HTTP client & interceptors                |
| **Sonner**          | Toast notifications                       |
| **Lucide React**    | Icons                                     |

## Backend

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| **Node.js**       | Runtime                     |
| **Express.js**    | REST API                    |
| **TypeScript**    | Type safety                 |
| **Prisma ORM**    | Database access & relations |
| **PostgreSQL**    | Relational database         |
| **JWT**           | Authentication              |
| **bcryptjs**      | Password hashing            |
| **Stripe**        | Payment processing          |
| **Zod**           | Server-side validation      |
| **cookie-parser** | Cookie handling             |
| **CORS**          | Cross-origin configuration  |
| **tsup**          | TypeScript bundling         |

## Infrastructure

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| **Vercel**           | Frontend & backend deployment |
| **Prisma Postgres**  | Cloud PostgreSQL              |
| **Git**              | Version control               |
| **GitHub**           | Source control                |
| **Next.js Rewrites** | Same-origin API proxy         |

---

# 🔐 Authentication & Authorization

FixItNow implements role-based authentication with:

* JWT access tokens
* JWT refresh tokens
* HTTP-only cookies
* Password hashing with bcrypt
* Protected routes
* Role-based authorization
* Admin authorization
* Technician authorization
* Customer authorization
* Account status validation

### Role Structure

```text
                    ┌─────────────┐
                    │    USER     │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        CUSTOMER      TECHNICIAN       ADMIN
```

Frontend route protection improves UX, while authorization is ultimately enforced by the backend.

---

# 🔒 Security Considerations

The project was designed with production-oriented security practices:

* Passwords hashed with bcrypt
* JWT-based authentication
* HTTP-only authentication cookies
* Role-based authorization
* Server-side validation
* Protected API endpoints
* Stripe webhook verification
* Environment variables for secrets
* CORS configuration
* User status checks
* Backend-controlled business rules
* No sensitive credentials committed to Git

---

# 📡 API Integration

The frontend communicates with the Express backend through a centralized Axios client.

Example API areas:

```text
/api/auth
/api/services
/api/categories
/api/technicians
/api/bookings
/api/payments
/api/reviews
/api/technician
/api/admin
```

Axios interceptors handle common authentication and API behaviors centrally instead of duplicating request logic across components.

---

# 🔄 Server State Management

**TanStack Query** is used for server-state management.

Important patterns used throughout the application include:

* Query keys
* Conditional queries
* Refetching
* Cache synchronization
* Query invalidation
* Loading states
* Error states
* Mutation handling

```text
User Action
    ↓
Mutation
    ↓
Backend API
    ↓
Database Update
    ↓
Invalidate Related Query
    ↓
Fresh Server Data
    ↓
Updated UI
```

---

# 🗄️ Database Model

The backend uses PostgreSQL with Prisma.

Core entities include:

```text
User
 │
 ├── TechnicianProfile
 │        │
 │        └── Services
 │
 ├── Bookings
 │        │
 │        └── Payments
 │
 └── Reviews

Category
 │
 └── Services
```

### Main Models

* Users
* Technician Profiles
* Categories
* Services
* Bookings
* Payments
* Reviews

Prisma handles:

* Relations
* Migrations
* Transactions
* Querying
* Seeding
* Type-safe database access

---

# 📱 Responsive Design

The interface is designed for:

* 📱 Mobile
* 📱 Tablet
* 💻 Laptop
* 🖥️ Desktop

The UI uses reusable components and responsive Tailwind utilities.

---

# 🌓 Dark Mode

FixItNow supports:

```text
☀️ Light Mode
🌙 Dark Mode
```

Theme preferences are handled using `next-themes`.

---

# 📊 Dashboard & Data Visualization

Admin dashboards use **Recharts** to visualize platform data.

Examples include:

* User growth
* Booking statistics
* Booking status distribution
* Platform activity
* Service/category statistics

Charts are generated from application data rather than hardcoded visual elements.

---

# 🧩 Frontend Structure

```text
src/
├── app/
│   ├── (public)/
│   ├── auth/
│   ├── dashboard/
│   ├── services/
│   ├── technicians/
│   ├── bookings/
│   └── payments/
│
├── components/
│   ├── ui/
│   ├── shared/
│   ├── navbar/
│   ├── footer/
│   └── dashboard/
│
├── hooks/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── utils/
│   └── validations/
│
├── providers/
│
└── types/
```

---

# ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> Never commit real secrets or production credentials to GitHub.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/mmahadi-ahmedd/FixItNow-Frontend.git
```

## 2. Move into the project

```bash
cd FixItNow-Frontend
```

## 3. Install dependencies

```bash
npm install
```

## 4. Configure environment variables

Create:

```text
.env.local
```

and add the required Firebase and API configuration.

## 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📦 Available Scripts

```bash
npm run dev
```

Start the development server.

```bash
npm run build
```

Create a production build.

```bash
npm run start
```

Run the production build.

```bash
npm run lint
```

Run ESLint checks.

---

# 🌐 Deployment

The production frontend is deployed on Vercel:

**Live Application:**
https://fixitnow-frontend-xi.vercel.app/

The backend is also deployed through Vercel serverless functions.

**Backend Repository:**
https://github.com/mmahadi-ahmedd/FixItNow-Backend

Next.js rewrites are used to proxy API requests through the frontend origin, helping avoid cross-origin authentication-cookie issues in production.

---

# 🧪 Testing The Application

A complete demo can be performed using three roles.

### Customer

```text
Register/Login
     ↓
Browse Services
     ↓
View Technician
     ↓
Create Booking
     ↓
Wait For Acceptance
     ↓
Pay With Stripe
     ↓
Track Booking
     ↓
Review Technician
```

### Technician

```text
Login
 ↓
Manage Profile
 ↓
Manage Services
 ↓
Set Availability
 ↓
View Booking
 ↓
Accept Booking
 ↓
Start Job
 ↓
Complete Job
```

### Admin

```text
Login
 ↓
Dashboard
 ↓
View Users
 ↓
Manage User Status
 ↓
View Bookings
 ↓
Manage Categories
 ↓
Monitor Platform
```

---

# 📚 Backend & API Documentation

The frontend consumes a RESTful backend API.

**Backend Repository:**
https://github.com/mmahadi-ahmedd/FixItNow-Backend

**Live Frontend:**
https://fixitnow-frontend-xi.vercel.app/

> API documentation link will be added here when the Postman/Swagger documentation is published.

---

# 🧠 Engineering Challenges Solved

## 1. Cross-Origin Authentication

During production deployment, authentication cookies created challenges because the frontend and backend were initially hosted on different Vercel origins.

The solution was to use **Next.js rewrites** so browser API requests could operate through the same frontend origin.

```text
Browser
   │
   ▼
Next.js Origin
   │
   │ Rewrite
   ▼
Backend API
```

---

## 2. Payment State Synchronization

Payment status cannot be trusted solely from the frontend.

The application uses:

```text
Stripe
   ↓
Webhook
   ↓
Backend Verification
   ↓
Database Transaction
   ↓
Payment + Booking Update
```

This keeps payment state controlled by the backend.

---

## 3. Booking State Transitions

The booking lifecycle is enforced by backend business logic.

```text
REQUESTED → ACCEPTED
ACCEPTED  → PAID
PAID      → IN_PROGRESS
IN_PROGRESS → COMPLETED
```

Invalid transitions are rejected instead of relying only on frontend controls.

---

## 4. Server-Side Validation

Frontend validation improves user experience, but it is not trusted as a security boundary.

Important input validation is also performed on the backend using Zod.

```text
Frontend Validation
       ↓
User Experience

Backend Validation
       ↓
Security + Data Integrity
```

---

# 🧱 Error Handling

API errors follow a predictable structure:

```json
{
  "success": false,
  "message": "Booking cannot be accepted in its current state.",
  "errorDetails": {}
}
```

This allows the frontend to provide meaningful error messages instead of exposing raw server errors.

---

# 📈 Project Highlights

| Area             | Implementation                 |
| ---------------- | ------------------------------ |
| Authentication   | JWT + HTTP-only cookies        |
| OAuth            | Firebase Google Authentication |
| Authorization    | Role-based access control      |
| Database         | PostgreSQL                     |
| ORM              | Prisma                         |
| Payments         | Stripe Checkout + Webhooks     |
| Validation       | Zod                            |
| API Client       | Axios                          |
| Server State     | TanStack Query                 |
| UI               | Tailwind + shadcn/ui           |
| Charts           | Recharts                       |
| Deployment       | Vercel                         |
| Theme            | Dark / Light                   |
| Type Safety      | TypeScript                     |
| API Architecture | REST                           |
| Version Control  | Git + GitHub                   |

---

# 🧑‍💻 Development Practices

The project follows several engineering practices:

* TypeScript across the application
* Reusable UI components
* Centralized API communication
* Environment-based configuration
* Server-side validation
* Protected routes
* Role-based authorization
* Meaningful Git commits
* Separation of UI and business logic
* Consistent loading/error states
* Responsive-first development
* Production-oriented error handling

---

# 📝 Git Commit History

The project was developed incrementally using conventional commits.

The repository contains **30+ meaningful commits** documenting the development process.

Example commit style:

```text
feat: implement customer booking flow
feat: add technician booking management
feat: integrate Stripe checkout
feat: implement Stripe webhook handling
feat: add admin user management
feat: add technician availability
fix: resolve authentication cookie issue
fix: synchronize booking payment state
fix: handle protected route redirects
refactor: centralize API client configuration
```

---

# 🎯 What I Learned

Building FixItNow helped me work with several concepts beyond basic CRUD:

* Designing REST APIs
* Role-based authorization
* JWT authentication
* HTTP-only cookies
* PostgreSQL relational modeling
* Prisma relations and transactions
* Stripe payment architecture
* Webhook processing
* Server-side validation
* State-machine-style business logic
* TanStack Query cache management
* Next.js App Router
* Production deployment
* Cross-origin authentication
* Debugging production-specific issues

---

# 🔮 Future Improvements

Potential future improvements include:

* Real-time booking notifications with WebSockets
* Technician location/map integration
* Email and SMS notifications
* Advanced technician search
* Availability conflict detection
* Service favorites
* Customer cancellation policies
* Refund management
* Technician verification workflow
* Automated review moderation
* More advanced analytics
* Automated testing with Vitest/Jest and Playwright

---

# 👨‍💻 Developer

## Mahadi Mahbub Ahmed

Frontend Developer | Full-Stack Developer

I enjoy building practical web applications that combine clean interfaces with reliable backend architecture and real-world business logic.

<p>
  <a href="https://github.com/mmahadi-ahmedd">💻 GitHub</a> •
  <a href="https://www.linkedin.com/in/mahadi-ahmed/">💼 LinkedIn</a> •
  <a href="https://mahadi-ahmed-portfolio-67a1e.web.app/">🌐 Portfolio</a> •
  <a href="mailto:ahmedmahadi2003@gmail.com">📧 Email</a>
</p>

---

# 🔗 Project Links

| Resource               | Link                                                          |
| ---------------------- | ------------------------------------------------------------- |
| 🌐 Live Application    | https://fixitnow-frontend-xi.vercel.app/                      |
| 💻 Frontend Repository | https://github.com/mmahadi-ahmedd/FixItNow-Frontend           |
| ⚙️ Backend Repository  | https://github.com/mmahadi-ahmedd/FixItNow-Backend            |
| 💼 LinkedIn            | https://www.linkedin.com/in/mahadi-ahmed/                     |
| 🐙 GitHub              | https://github.com/mmahadi-ahmedd                             |
| 🌐 Portfolio           | https://mahadi-ahmed-portfolio-67a1e.web.app/                 |
| 📧 Email               | [ahmedmahadi2003@gmail.com](mailto:ahmedmahadi2003@gmail.com) |

---

# ⭐ Project

**FixItNow** demonstrates a complete full-stack workflow combining:

**Next.js + TypeScript + Express + Prisma + PostgreSQL + JWT + Firebase + Stripe + TanStack Query + Vercel**

with real authentication, authorization, booking workflows, payment processing, database relationships, validation, and production deployment.

<p align="center">
  <strong>🔧 FixItNow — Your Trusted Home Service Platform</strong>
</p>
