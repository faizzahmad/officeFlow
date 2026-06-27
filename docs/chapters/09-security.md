\newpage

# CHAPTER 9
# SECURITY & AUTHENTICATION

## 9.1 Introduction

Security is paramount in an HRMS system that handles sensitive employee data, salary information, and personal details. This chapter documents the security architecture, authentication mechanisms, authorization model, and data protection measures implemented in Office Flow.

## 9.2 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
│                                                                  │
│  Layer 1: NETWORK                                                │
│  ├── HTTPS/TLS encryption (production)                          │
│  └── Vercel edge network protection                             │
│                                                                  │
│  Layer 2: APPLICATION                                          │
│  ├── Middleware session validation                              │
│  ├── Server-side permission checks                              │
│  └── Input validation and sanitization                          │
│                                                                  │
│  Layer 3: AUTHENTICATION                                       │
│  ├── Better Auth session management                           │
│  ├── Password hashing (bcrypt)                                  │
│  └── HTTP-only secure cookies                                 │
│                                                                  │
│  Layer 4: AUTHORIZATION                                        │
│  ├── Role-based access control (RBAC)                           │
│  ├── Route-level access control                                 │
│  └── Permission-based action guards                             │
│                                                                  │
│  Layer 5: DATA                                                   │
│  ├── Parameterized queries (SQL injection prevention)           │
│  ├── Foreign key constraints                                    │
│  └── Organization data isolation                                │
└─────────────────────────────────────────────────────────────────┘
```

## 9.3 Authentication

### 9.3.1 Better Auth Configuration

Office Flow uses Better Auth for all authentication operations:

| Feature | Implementation |
|---------|----------------|
| Provider | Email/password (credential) |
| Password hashing | bcrypt with salt |
| Session storage | PostgreSQL `session` table |
| Session token | Cryptographically secure random |
| Cookie settings | HTTP-only, Secure (production), SameSite |
| Session expiration | Configurable (default: 7 days) |

### 9.3.2 Authentication Flow

```
┌──────────┐    ┌─────────────┐    ┌──────────────┐    ┌────────────┐
│  Client  │───►│ /api/auth/  │───►│ Better Auth  │───►│ PostgreSQL │
│          │    │  sign-in    │    │   Handler    │    │  (session) │
└──────────┘    └─────────────┘    └──────────────┘    └────────────┘
     │                                      │
     │         Set-Cookie: session=xxx      │
     │◄─────────────────────────────────────│
     │                                      │
     ▼                                      │
┌──────────┐    ┌─────────────┐             │
│Dashboard │◄───│ Middleware  │─────────────┘
│          │    │ (validates  │   Validate token
└──────────┘    │  cookie)    │   on each request
                └─────────────┘
```

### 9.3.3 Session Management

File: `src/lib/session.ts`

| Function | Purpose |
|----------|---------|
| `getSession()` | Returns current session or null (cached) |
| `requireSession()` | Redirects to /login if no session |
| `requireWorkspace()` | Redirects to /pending if no org membership |
| `requirePermission(perm)` | Redirects to /dashboard if denied |
| `requireRouteAccess(path)` | Route-level RBAC check |

Sessions are validated on every protected request via middleware and server-side helpers.

### 9.3.4 Password Security

| Requirement | Implementation |
|-------------|----------------|
| Minimum length | 8 characters (Better Auth default) |
| Hashing algorithm | bcrypt |
| Storage | Hashed in `account.password` column |
| Plain text | Never stored or logged |
| Change password | Requires current password verification |

## 9.4 Authorization (RBAC)

### 9.4.1 Role Hierarchy

```
                    ┌─────────┐
                    │  Admin  │  Full access
                    └────┬────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
      ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
      │   HR    │   │ Manager │   │Employee │
      │         │   │         │   │         │
      │ Payroll │   │ Tasks   │   │ Self    │
      │ Records │   │ Projects│   │ Service │
      │ Employees│  │ Reports │   │         │
      └─────────┘   └─────────┘   └─────────┘
```

### 9.4.2 Permission Matrix

File: `src/lib/permissions.ts`

| Permission | Admin | HR | Manager | Employee |
|------------|-------|-----|---------|----------|
| manageOrganization | ✓ | ✗ | ✗ | ✗ |
| manageEmployees | ✓ | ✓ | ✗ | ✗ |
| manageDepartments | ✓ | ✓ | ✗ | ✗ |
| generatePayroll | ✓ | ✓ | ✗ | ✗ |
| viewAllPayslips | ✓ | ✓ | ✗ | ✗ |
| viewEmployeeRecords | ✓ | ✓ | ✗ | ✗ |
| approveLeave | ✓ | ✓ | ✓ | ✗ |
| createPerformanceReview | ✓ | ✓ | ✓ | ✗ |
| manageProjects | ✓ | ✓ | ✓ | ✗ |
| assignTasks | ✓ | ✓ | ✓ | ✗ |
| viewTeamAttendance | ✓ | ✓ | ✓ | ✗ |
| viewReports | ✓ | ✓ | ✓ | ✗ |

### 9.4.3 Authorization Enforcement Points

1. **Middleware** — Blocks unauthenticated access
2. **Page level** — `requireRouteAccess()` in page components
3. **Server Actions** — `requirePermission()` before mutations
4. **UI level** — `RoleGate` component hides unauthorized elements
5. **Sidebar** — Navigation filtered by `canAccessRoute()`

### 9.4.4 Data Access Rules

| Data | Admin/HR | Manager | Employee |
|------|----------|---------|----------|
| All employee records | ✓ | ✗ | ✗ |
| Team attendance | ✓ | ✓ (team) | Own only |
| All payslips | ✓ | ✗ | Own only |
| All leave requests | ✓ | ✓ (approve) | Own only |
| All tasks | ✓ | ✓ | Assigned only |

## 9.5 Input Validation

### 9.5.1 Server-Side Validation

All server actions validate input before processing:

```typescript
// Example pattern used throughout
const email = String(formData.get("email") ?? "").trim();
if (!email || !email.includes("@")) {
  return actionError("Valid email is required");
}
```

### 9.5.2 SQL Injection Prevention

Drizzle ORM uses parameterized queries exclusively:

```typescript
// Safe - parameters are escaped
await db.select().from(employees)
  .where(eq(employees.email, userInput));

// Never used - raw SQL with string concatenation
```

### 9.5.3 XSS Prevention

- React automatically escapes JSX content
- User-generated content displayed as text, not HTML
- No `dangerouslySetInnerHTML` usage in codebase

### 9.5.4 File Upload Validation

UploadThing enforces:
- File type: images only (image/*)
- Max size: 4MB (profile), 2MB (logo)
- Authentication required
- Permission check for organization logo

## 9.6 Data Protection

### 9.6.1 Organization Isolation

All queries filter by `organizationId` from the user's workspace:

```typescript
const workspace = await requireWorkspace();
// All subsequent queries include:
.where(eq(table.organizationId, workspace.organizationId))
```

Users cannot access data from other organizations.

### 9.6.2 Sensitive Data Handling

| Data Type | Protection |
|-----------|------------|
| Passwords | bcrypt hashed, never exposed |
| Bank details | Stored in DB, visible only to employee and HR |
| Salary | Visible to employee (own), HR (all) |
| Session tokens | HTTP-only cookies, not accessible via JS |
| API keys | Environment variables, never in client code |

### 9.6.3 Environment Variable Security

| Variable | Exposure |
|----------|----------|
| DATABASE_URL | Server only |
| BETTER_AUTH_SECRET | Server only |
| RESEND_API_KEY | Server only |
| UPLOADTHING_TOKEN | Server only |
| NEXT_PUBLIC_APP_URL | Client (safe) |

Variables without `NEXT_PUBLIC_` prefix are never sent to the browser.

## 9.7 CSRF Protection

Next.js Server Actions include built-in CSRF protection:
- Actions include encrypted origin verification
- Requests must come from same origin
- No additional CSRF tokens needed

## 9.8 Security Headers

Production deployment on Vercel includes:
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 9.9 Audit Considerations

| Event | Logged | Location |
|-------|--------|----------|
| Login/logout | Session table timestamps | PostgreSQL |
| Leave approval | reviewedBy, reviewNote | leave_requests |
| Payroll generation | processedAt | payroll_runs |
| Attendance | checkIn, checkOut timestamps | attendance_records |
| Profile changes | updatedAt | respective tables |

## 9.10 Security Best Practices Followed

1. ✓ Principle of least privilege (RBAC)
2. ✓ Defense in depth (multiple security layers)
3. ✓ Secure defaults (auth required, permissions checked)
4. ✓ Input validation on server
5. ✓ Parameterized database queries
6. ✓ Password hashing with industry-standard algorithm
7. ✓ HTTP-only session cookies
8. ✓ Environment variables for secrets
9. ✓ Organization data isolation
10. ✓ HTTPS in production

## 9.11 Known Limitations

| Limitation | Mitigation Path |
|------------|-----------------|
| No 2FA/MFA | Add Better Auth OTP plugin |
| No OAuth | Add Google/Microsoft providers |
| No rate limiting | Add Vercel rate limiting or Upstash |
| No audit log table | Create dedicated audit_logs table |
| No data encryption at rest | Neon provides encryption at rest |
| No session invalidation UI | Add "logout all devices" feature |

## 9.12 Summary

Office Flow implements defense-in-depth security with authentication via Better Auth, authorization via RBAC, and data protection via organization isolation and input validation. The architecture follows OWASP guidelines for web application security.
