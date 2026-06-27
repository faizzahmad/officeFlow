\newpage

# CHAPTER 5
# SYSTEM DESIGN

## 5.1 Introduction

System design translates requirements into a technical blueprint. This chapter describes the architecture, component structure, module interactions, and design patterns used in Office Flow.

## 5.2 Architectural Overview

Office Flow follows a **monolithic full-stack architecture** built on Next.js 16 App Router. Unlike traditional three-tier architectures with separate frontend, backend, and database servers, Next.js unifies these layers in a single deployable application.

### 5.2.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   React     │  │   Client    │  │   shadcn/   │  │  Recharts   │    │
│  │ Components  │  │  Components │  │     ui      │  │   Charts    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        App Router (src/app/)                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │   (auth)/    │  │ (dashboard)/ │  │       api/           │  │   │
│  │  │ login        │  │ dashboard    │  │ auth/[...all]        │  │   │
│  │  │ register     │  │ employees    │  │ uploadthing          │  │   │
│  │  │ signup       │  │ attendance   │  │ payslips/[id]/pdf    │  │   │
│  │  │ pending      │  │ leave        │  └──────────────────────┘  │   │
│  │  └──────────────┘  │ payroll      │                             │   │
│  │                    │ tasks        │                             │   │
│  │                    │ ...          │                             │   │
│  │                    └──────────────┘                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Server Layer (src/)                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │   │
│  │  │   Actions    │  │     lib/     │  │      middleware.ts   │  │   │
│  │  │ (mutations)  │  │ auth,session │  │   (route protection) │  │   │
│  │  └──────────────┘  │ permissions  │  └──────────────────────┘  │   │
│  │                    └──────────────┘                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Drizzle   │  │ PostgreSQL  │  │ UploadThing │  │   Resend    │  │
│  │     ORM     │  │   (Neon)    │  │   (Files)   │  │   (Email)   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2.2 Request Flow

1. **Browser Request** — User navigates to a URL or submits a form
2. **Middleware** — Checks session cookie; redirects to /login if unauthenticated
3. **Route Handler** — App Router matches URL to page or API route
4. **Server Component** — Fetches data via Server Actions or direct DB queries
5. **Client Component** — Hydrates interactive elements (forms, buttons)
6. **Server Action** — Handles mutations; validates permissions; updates database
7. **Response** — HTML streamed to browser; toasts show success/error

## 5.3 Design Patterns

### 5.3.1 Server Components vs Client Components

Next.js App Router distinguishes between:

| Type | Directive | Use Case |
|------|-----------|----------|
| Server Component | (default) | Data fetching, static content, SEO |
| Client Component | `"use client"` | Interactivity, hooks, browser APIs |

**Example:** Dashboard page is a Server Component that fetches stats. The chart component is a Client Component because Recharts requires browser rendering.

### 5.3.2 Server Actions Pattern

Mutations use the Server Actions pattern instead of REST APIs:

```typescript
// src/actions/attendance.ts
"use server";

export async function checkIn() {
  const workspace = await requireWorkspace();
  // Validate, insert record, revalidate cache
  revalidatePath("/attendance");
  return actionSuccess({ message: "Checked in" });
}
```

**Benefits:**
- Type-safe function calls from client
- Automatic CSRF protection
- Colocated with related components
- Progressive enhancement (works without JS)

### 5.3.3 Repository Pattern (via Drizzle)

Database access is centralized in schema definitions and accessed through Drizzle ORM:

```
src/db/
├── index.ts          # Connection pool
└── schema/
    ├── auth.ts       # user, session, account
    ├── employees.ts  # employees table
    ├── attendance.ts # attendance_records
    └── ...
```

### 5.3.4 Permission Guard Pattern

Authorization uses layered guards:

```typescript
// Layer 1: Middleware (cookie exists)
// Layer 2: requireSession() (valid user)
// Layer 3: requireWorkspace() (org membership)
// Layer 4: requirePermission("manageEmployees")
// Layer 5: RoleGate component (UI conditional render)
```

### 5.3.5 Action Result Pattern

Consistent error handling across all server actions:

```typescript
// Success: { success: true, data: {...} }
// Error:   { success: false, error: "Message" }
```

## 5.4 Module Design

### 5.4.1 Authentication Module

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────►│ Better Auth │────►│  PostgreSQL │
│ authClient  │     │  /api/auth  │     │ user,session│
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ middleware  │ ──► Redirect if no session cookie
└─────────────┘
```

**Components:**
- `src/lib/auth.ts` — Server-side Better Auth config
- `src/lib/auth-client.ts` — Client-side auth hooks
- `src/lib/session.ts` — Session helpers (getSession, requireWorkspace)
- `src/middleware.ts` — Route protection

### 5.4.2 Workspace Module

On registration, the workspace bootstrap creates:

```
setupWorkspace()
    │
    ├── organizations (1 row)
    ├── organization_members (admin role)
    ├── departments ("General")
    ├── employees (EMP001, admin)
    ├── work_settings (defaults)
    ├── leave_types (Casual, Sick, Earned)
    └── leave_balances (for admin)
```

### 5.4.3 Attendance Module

```
┌──────────────────────────────────────────────────────────┐
│                    Attendance Flow                        │
│                                                          │
│  checkIn() ──► Read work_settings ──► Insert record    │
│                                          │               │
│                                          ▼               │
│                              Calculate status:           │
│                              - checkIn <= start+grace    │
│                                → present                 │
│                              - checkIn > start+grace     │
│                                → late                    │
│                                                          │
│  checkOut() ──► Update record ──► Calculate work_hours  │
│                                                          │
│  Multiple sessions per day supported                     │
└──────────────────────────────────────────────────────────┘
```

### 5.4.4 Payroll Module

```
generatePayroll(month, year)
    │
    ├── Create payroll_run record
    │
    └── For each active employee:
            │
            ├── Get base_salary
            ├── Count late days in month
            ├── late_deduction = base * 0.01 * late_days
            ├── net_salary = base - late_deduction
            └── Create payslip with slip_number
```

### 5.4.5 Task Module

Kanban board with three columns:

| Column | Status Value | Transitions |
|--------|--------------|-------------|
| Pending | `pending` | → in_progress |
| In Progress | `in_progress` | → completed, → pending |
| Completed | `completed` | → in_progress |

Task detail sheet provides: comments, collaborators, links, metadata editing.

## 5.5 Component Architecture

### 5.5.1 Folder Structure

```
src/components/
├── ui/                    # shadcn primitives (Button, Card, Dialog...)
├── dashboard/             # Dashboard-specific widgets
├── attendance/            # Attendance module components
├── employees/             # Employee management
├── leave/                 # Leave forms and tables
├── payroll/               # Payslip components
├── tasks/                 # Kanban board, task detail
├── performance/           # Reports and reviews
├── profile/               # Self-service profile
├── settings/              # Organization settings
├── data-table/            # Reusable table components
├── app-sidebar.tsx        # Navigation sidebar
├── dashboard-header.tsx   # Top header bar
├── auth-shell.tsx         # Auth page layout
└── page-header.tsx        # Page title component
```

### 5.5.2 Layout Hierarchy

```
RootLayout (src/app/layout.tsx)
├── ThemeProvider
├── UploadThingProvider
├── Toaster (Sonner)
│
├── (auth) routes — AuthShell layout
│   └── Centered form with brand panel
│
└── (dashboard) routes — DashboardLayout
    ├── SidebarProvider
    │   ├── AppSidebar (role-filtered nav)
    │   └── SidebarInset
    │       ├── DashboardHeader
    │       └── Page Content
```

## 5.6 API Design

### 5.6.1 REST Endpoints (Minimal)

| Endpoint | Methods | Handler |
|----------|---------|---------|
| `/api/auth/[...all]` | GET, POST | Better Auth catch-all |
| `/api/uploadthing` | GET, POST | File upload handler |
| `/api/payslips/[id]/pdf` | GET | PDF generation |

### 5.6.2 Server Actions (Primary API)

| Module | File | Key Actions |
|--------|------|-------------|
| Onboarding | `onboarding.ts` | setupWorkspace |
| Employees | `employees.ts` | createEmployee, getEmployees |
| Attendance | `attendance.ts` | checkIn, checkOut, getAttendanceRecords |
| Leave | `leave.ts` | applyLeave, reviewLeave |
| Payroll | `payroll.ts` | generatePayroll, getPayslips |
| Tasks | `tasks.ts` | createTask, updateTaskStatus |
| Projects | `projects.ts` | createProject, logTimeEntry |
| Dashboard | `dashboard.ts` | getDashboardStats, getDashboardCharts |

## 5.7 Navigation Design

Sidebar navigation is filtered by role using `canAccessRoute()`:

| Route | Admin | HR | Manager | Employee |
|-------|-------|-----|---------|----------|
| /dashboard | ✓ | ✓ | ✓ | ✓ |
| /employees | ✓ | ✓ | ✗ | ✗ |
| /departments | ✓ | ✓ | ✗ | ✗ |
| /employee-records | ✓ | ✓ | ✗ | ✗ |
| /attendance | ✓ | ✓ | ✓ | ✓ |
| /leave | ✓ | ✓ | ✓ | ✓ |
| /payroll | ✓ | ✓ | ✓ | ✓ |
| /tasks | ✓ | ✓ | ✓ | ✓ |
| /projects | ✓ | ✓ | ✓ | ✗ |
| /performance | ✓ | ✓ | ✓ | ✓ |
| /reports | ✓ | ✓ | ✓ | ✗ |
| /settings | ✓ | ✗ | ✗ | ✗ |
| /profile | ✓ | ✓ | ✓ | ✓ |

## 5.8 Error Handling Design

| Layer | Strategy |
|-------|----------|
| Form validation | Client-side + server-side checks |
| Server actions | Return actionError() with message |
| API routes | HTTP status codes (401, 403, 404, 500) |
| UI feedback | Sonner toast notifications |
| Not found | Next.js not-found.tsx pages |
| Loading | Suspense boundaries + skeleton components |

## 5.9 Summary

Office Flow's design leverages modern Next.js patterns—Server Components, Server Actions, and middleware-based auth—to create a maintainable, type-safe application. The monolithic architecture simplifies deployment while the modular folder structure enables independent feature development.
