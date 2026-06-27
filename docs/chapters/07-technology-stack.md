\newpage

# CHAPTER 7
# TECHNOLOGY STACK

## 7.1 Introduction

Technology selection significantly impacts development velocity, maintainability, scalability, and user experience. This chapter justifies each technology choice in the Office Flow stack.

## 7.2 Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  React 19 │ TypeScript 5 │ Tailwind CSS 4 │ shadcn/ui │ Lucide  │
├─────────────────────────────────────────────────────────────────┤
│                        APPLICATION LAYER                         │
│  Next.js 16 App Router │ Server Actions │ Server Components      │
│  React Compiler │ Middleware │ API Route Handlers                │
├─────────────────────────────────────────────────────────────────┤
│                          DATA LAYER                              │
│  Drizzle ORM 0.45 │ PostgreSQL (Neon) │ Drizzle Kit             │
├─────────────────────────────────────────────────────────────────┤
│                       INTEGRATION LAYER                          │
│  Better Auth │ UploadThing │ Resend │ jsPDF                     │
└─────────────────────────────────────────────────────────────────┘
```

## 7.3 Frontend Technologies

### 7.3.1 Next.js 16

| Aspect | Details |
|--------|---------|
| **Version** | 16.2.9 |
| **Type** | React Framework |
| **License** | MIT (Open Source) |

**Why Next.js?**
1. **Full-stack in one codebase** — Eliminates separate backend server
2. **App Router** — Modern routing with layouts, loading states, error boundaries
3. **Server Components** — Reduce client JavaScript bundle size
4. **Server Actions** — Type-safe mutations without REST boilerplate
5. **Vercel deployment** — Zero-config production deployment
6. **Industry adoption** — Used by Netflix, TikTok, Nike, and thousands of companies

**Alternatives Considered:**
| Alternative | Why Not Chosen |
|-------------|----------------|
| Create React App | No SSR, deprecated, no backend |
| Remix | Smaller ecosystem, less mature |
| Angular | Steeper learning curve, heavier |
| Vue/Nuxt | Team familiarity with React |

### 7.3.2 React 19

| Aspect | Details |
|--------|---------|
| **Version** | 19.2.4 |
| **Type** | UI Library |

**Why React 19?**
1. **Component model** — Reusable, composable UI building blocks
2. **Hooks** — State and lifecycle management
3. **React Compiler** — Automatic memoization for performance
4. **Largest ecosystem** — Most third-party libraries and community support
5. **Server Components** — Native support in React 19

### 7.3.3 TypeScript

| Aspect | Details |
|--------|---------|
| **Version** | 5.x |
| **Type** | Typed superset of JavaScript |

**Why TypeScript?**
1. **Type safety** — Catch errors at compile time
2. **IDE support** — Autocomplete, refactoring, inline documentation
3. **Drizzle integration** — End-to-end type safety from DB to UI
4. **Maintainability** — Self-documenting code for team projects
5. **Industry standard** — Expected in professional development

### 7.3.4 Tailwind CSS 4

| Aspect | Details |
|--------|---------|
| **Version** | 4.x |
| **Type** | Utility-first CSS framework |

**Why Tailwind?**
1. **Rapid development** — Style directly in JSX without context switching
2. **Consistent design** — Design tokens via CSS variables
3. **Small production bundle** — Purges unused styles
4. **Dark mode** — Built-in dark: variant support
5. **shadcn/ui compatibility** — Designed to work together

### 7.3.5 shadcn/ui

| Aspect | Details |
|--------|---------|
| **Version** | 4.11.0 |
| **Style** | base-nova |
| **Type** | Component library (copy-paste) |

**Why shadcn/ui?**
1. **Ownership** — Components copied into codebase, fully customizable
2. **Accessibility** — Built on Radix/Base UI primitives
3. **Modern design** — Professional, polished appearance
4. **No runtime dependency** — Just copied source files
5. **50+ components** — Button, Card, Dialog, Table, Sidebar, etc.

### 7.3.6 Supporting UI Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Lucide React | 1.17.0 | Icon library (1000+ icons) |
| Recharts | 3.8.0 | Dashboard charts (bar, pie, line) |
| @tanstack/react-table | 8.21.3 | Sortable, filterable data tables |
| Sonner | 2.0.7 | Toast notifications |
| next-themes | 0.4.6 | Dark/light mode switching |
| date-fns | 4.4.0 | Date formatting and manipulation |
| react-day-picker | 10.0.1 | Calendar date picker |

## 7.4 Backend Technologies

### 7.4.1 Next.js Server Layer

Office Flow uses Next.js as both frontend and backend:

| Feature | Implementation |
|---------|----------------|
| Data fetching | Server Components with async/await |
| Mutations | Server Actions (`"use server"`) |
| REST APIs | Route Handlers in `src/app/api/` |
| Auth | Better Auth via `/api/auth/[...all]` |
| File uploads | UploadThing via `/api/uploadthing` |
| PDF generation | jsPDF via `/api/payslips/[id]/pdf` |

**Why no separate backend?**
1. Simpler deployment (single application)
2. Shared types between client and server
3. No CORS configuration needed
4. Reduced latency (no network hop between frontend and backend)
5. Lower infrastructure cost

### 7.4.2 Drizzle ORM

| Aspect | Details |
|--------|---------|
| **Version** | 0.45.2 |
| **Type** | TypeScript ORM |

**Why Drizzle?**
1. **Type-safe queries** — Full TypeScript inference
2. **SQL-like syntax** — Familiar for SQL developers
3. **Lightweight** — No heavy runtime like Prisma
4. **Schema as code** — TypeScript schema definitions
5. **Drizzle Kit** — Migration generation and Studio GUI
6. **Edge compatible** — Works with serverless databases

**Alternatives Considered:**
| Alternative | Why Not Chosen |
|-------------|----------------|
| Prisma | Heavier, slower cold starts |
| TypeORM | Less type-safe, older patterns |
| Raw SQL | No type safety, more boilerplate |
| Knex.js | No TypeScript-first design |

### 7.4.3 PostgreSQL (Neon)

| Aspect | Details |
|--------|---------|
| **Version** | PostgreSQL 15+ |
| **Hosting** | Neon (serverless) |
| **Driver** | @neondatabase/serverless |

**Why PostgreSQL?**
1. **ACID compliance** — Critical for payroll and financial data
2. **Rich data types** — UUID, ENUM, NUMERIC, TIMESTAMP
3. **Mature ecosystem** — 30+ years of development
4. **JSON support** — Future extensibility
5. **Open source** — No vendor lock-in

**Why Neon?**
1. **Serverless** — Scales to zero, pay per use
2. **Free tier** — Generous for development and small deployments
3. **Branching** — Database branches for preview environments
4. **WebSocket support** — Required for serverless connections
5. **Automatic backups** — Point-in-time recovery

## 7.5 Authentication

### 7.5.1 Better Auth

| Aspect | Details |
|--------|---------|
| **Version** | 1.6.16 |
| **Type** | Authentication library |

**Why Better Auth?**
1. **Framework agnostic** — Works with Next.js App Router
2. **Drizzle adapter** — Native integration with our ORM
3. **Email/password** — Built-in credential provider
4. **Session management** — HTTP-only cookies, secure by default
5. **Extensible** — OAuth providers can be added later
6. **Type-safe** — Full TypeScript support

**Features Used:**
- Email/password sign-up and sign-in
- Session creation and validation
- Password hashing (bcrypt)
- Password change
- User profile updates

**Alternatives Considered:**
| Alternative | Why Not Chosen |
|-------------|----------------|
| NextAuth/Auth.js | Complex configuration, v5 still beta |
| Clerk | Paid service, vendor lock-in |
| Supabase Auth | Tied to Supabase ecosystem |
| Custom JWT | Security risks, more code to maintain |

## 7.6 External Services

### 7.6.1 UploadThing

| Aspect | Details |
|--------|---------|
| **Version** | 7.7.4 |
| **Purpose** | File uploads (images) |

**Usage:**
- Profile avatar upload (max 4MB)
- Organization logo upload (max 2MB)

**Why UploadThing?**
1. Simple Next.js integration
2. Built-in auth middleware
3. CDN delivery
4. Free tier for development

### 7.6.2 Resend

| Aspect | Details |
|--------|---------|
| **Version** | 6.12.4 |
| **Purpose** | Transactional email |

**Usage:**
- Leave approval/rejection notifications
- Payslip ready notifications
- Task assignment notifications

**Why Resend?**
1. Developer-friendly API
2. React email templates support
3. Free tier (100 emails/day)
4. Good deliverability

### 7.6.3 jsPDF

| Aspect | Details |
|--------|---------|
| **Version** | 4.2.1 |
| **Purpose** | PDF generation |

**Usage:**
- Payslip PDF download

**Why jsPDF?**
1. Client and server-side generation
2. No external PDF service needed
3. Full control over layout

## 7.7 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.x | Code linting |
| eslint-config-next | 16.2.9 | Next.js ESLint rules |
| Drizzle Kit | 0.31.10 | Schema migrations, Studio |
| dotenv | 17.4.2 | Environment variable loading |
| babel-plugin-react-compiler | 1.0.0 | React Compiler optimization |

## 7.8 Complete Dependency List

### Production Dependencies (29 packages)

```
@base-ui/react          ^1.5.0      Headless UI primitives
@neondatabase/serverless ^1.1.0     Neon PostgreSQL driver
@tanstack/react-table   ^8.21.3     Data tables
@uploadthing/react      ^7.3.3      Upload components
better-auth             ^1.6.16     Authentication
class-variance-authority ^0.7.1     Component variants
clsx                    ^2.1.1      Class name utility
cmdk                    ^1.1.1      Command palette
date-fns                ^4.4.0      Date utilities
drizzle-orm             ^0.45.2     Database ORM
embla-carousel-react    ^8.6.0      Carousel component
input-otp               ^1.4.2      OTP input
jspdf                   ^4.2.1      PDF generation
lucide-react            ^1.17.0     Icons
next                    16.2.9      Framework
next-themes             ^0.4.6      Theme switching
react                   19.2.4      UI library
react-day-picker        ^10.0.1     Date picker
react-dom               19.2.4      React DOM
react-resizable-panels  ^4.11.2     Resizable panels
recharts                ^3.8.0      Charts
resend                  ^6.12.4     Email service
shadcn                  ^4.11.0     Component CLI
sonner                  ^2.0.7      Toast notifications
tailwind-merge          ^3.6.0      Tailwind class merging
tw-animate-css          ^1.4.0      Animation utilities
uploadthing             ^7.7.4      File upload service
vaul                    ^1.1.2      Drawer component
ws                      ^8.21.0     WebSocket (Neon)
```

### Development Dependencies (11 packages)

```
@tailwindcss/postcss    ^4          PostCSS plugin
@types/node             ^20         Node.js types
@types/react            ^19         React types
@types/react-dom        ^19         React DOM types
@types/ws               ^8.18.1     WebSocket types
babel-plugin-react-compiler 1.0.0   React Compiler
dotenv                  ^17.4.2     Env loading
drizzle-kit             ^0.31.10    Drizzle CLI
eslint                  ^9          Linter
eslint-config-next      16.2.9      Next.js ESLint
tailwindcss             ^4          CSS framework
typescript              ^5          Type checker
```

## 7.9 Technology Comparison Summary

| Layer | Selected | Runner-up | Key Differentiator |
|-------|----------|-----------|-------------------|
| Framework | Next.js 16 | Remix | Ecosystem size, Vercel integration |
| UI Library | React 19 | Vue 3 | Community, hiring pool |
| Language | TypeScript | JavaScript | Type safety, maintainability |
| CSS | Tailwind 4 | CSS Modules | Development speed |
| Components | shadcn/ui | MUI | Customization, bundle size |
| ORM | Drizzle | Prisma | Performance, edge compatibility |
| Database | PostgreSQL | MySQL | Feature richness, JSON support |
| Auth | Better Auth | Auth.js | Simplicity, Drizzle integration |
| Hosting | Vercel | Railway | Next.js optimization |

## 7.10 Summary

The Office Flow technology stack represents current best practices in full-stack web development (2025–2026). Every choice prioritizes developer experience, type safety, performance, and maintainability while keeping infrastructure costs low through serverless and open-source technologies.
