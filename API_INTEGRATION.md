# API Integration Documentation

## Overview
This frontend connects to the FixItNow Backend API hosted at:
`https://fixitnow-backend-eosin.vercel.app/api`

---

## Authentication
All protected endpoints send cookies automatically via `withCredentials: true`.

| Component | Endpoint | Method |
|---|---|---|
| `app/auth/login/page.tsx` | `/auth/login` | POST |
| `app/auth/register/page.tsx` | `/auth/register` | POST |
| `lib/auth.ts → getCurrentUser()` | `/auth/me` | GET |
| `lib/auth.ts → logout()` | `/auth/logout` | POST |

---

## Public Pages

| Component | Endpoint | Method |
|---|---|---|
| `app/page.tsx` (Home) | `/services` | GET |
| `app/services/page.tsx` | `/services` | GET |
| `app/services/page.tsx` | `/categories` | GET |
| `app/technicians/[id]/page.tsx` | `/technicians/:id` | GET |

---

## Customer Dashboard

| Component | Endpoint | Method |
|---|---|---|
| `app/auth/dashboard/customer/page.tsx` | `/bookings` | GET |
| `app/auth/dashboard/customer/page.tsx` | `/bookings/:id/cancel` | PATCH |
| `app/auth/dashboard/customer/pay/[id]/page.tsx` | `/payments/create` | POST |
| `app/auth/dashboard/customer/pay/[id]/page.tsx` | `/payments/test-confirm` | POST |
| `app/auth/dashboard/customer/review/[id]/page.tsx` | `/reviews` | POST |

---

## Technician Dashboard

| Component | Endpoint | Method |
|---|---|---|
| `app/auth/dashboard/technician/page.tsx` | `/technician/bookings` | GET |
| `app/auth/dashboard/technician/page.tsx` | `/technician/profile` | GET |
| `app/auth/dashboard/technician/page.tsx` | `/technician/bookings/:id` | PATCH |
| `app/auth/dashboard/technician/page.tsx` | `/technician/availability` | PUT |
| `app/auth/dashboard/technician/page.tsx` | `/services` | GET, POST |
| `app/auth/dashboard/technician/page.tsx` | `/services/:id` | DELETE |
| `app/technicians/[id]/page.tsx` | `/bookings` | POST |

---

## Admin Dashboard

| Component | Endpoint | Method |
|---|---|---|
| `app/auth/dashboard/admin/page.tsx` | `/admin/users` | GET |
| `app/auth/dashboard/admin/page.tsx` | `/admin/users/:id` | PATCH |
| `app/auth/dashboard/admin/page.tsx` | `/admin/bookings` | GET |
| `app/auth/dashboard/admin/page.tsx` | `/admin/categories` | GET, POST |

---

## Error Handling
All API errors are handled via `getErrorMessage()` in `lib/api-client.ts` and displayed as toast notifications using Sonner.

## Authentication Flow
1. User logs in → backend sets httpOnly cookie
2. Every request sends cookie automatically via `withCredentials: true`
3. Logout → backend clears cookie via `res.clearCookie()`
4. Next.js Middleware reads cookie to protect dashboard routes