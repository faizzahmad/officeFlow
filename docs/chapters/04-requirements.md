\newpage

# CHAPTER 4
# SYSTEM REQUIREMENTS

## 4.1 Introduction

Requirements specification defines what the system must do (functional) and how well it must do it (non-functional). This chapter documents all requirements for Office Flow, derived from stakeholder analysis and industry best practices.

## 4.2 Functional Requirements

### 4.2.1 Authentication Module (FR-AUTH)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | System shall allow new users to register with email and password | High |
| FR-AUTH-02 | System shall allow registered users to log in with email and password | High |
| FR-AUTH-03 | System shall allow users to log out and invalidate session | High |
| FR-AUTH-04 | System shall allow users to change their password | Medium |
| FR-AUTH-05 | System shall redirect unauthenticated users to login page | High |
| FR-AUTH-06 | System shall support company registration with workspace creation | High |
| FR-AUTH-07 | System shall support employee-only signup without workspace | High |
| FR-AUTH-08 | System shall show pending page for users without organization | Medium |

### 4.2.2 Employee Management (FR-EMP)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EMP-01 | HR shall add employees by registered email address | High |
| FR-EMP-02 | System shall assign unique employee code per organization | High |
| FR-EMP-03 | HR shall assign role (admin/hr/manager/employee) to members | High |
| FR-EMP-04 | HR shall assign employees to departments | High |
| FR-EMP-05 | HR shall set base salary for employees | High |
| FR-EMP-06 | HR shall view list of all employees with filters | High |
| FR-EMP-07 | HR shall set/reset employee passwords | Medium |
| FR-EMP-08 | System shall auto-seed leave balances on employee add | High |

### 4.2.3 Department Management (FR-DEPT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DEPT-01 | HR shall create departments with name and description | High |
| FR-DEPT-02 | HR shall update department details | Medium |
| FR-DEPT-03 | HR shall delete departments (if no dependencies) | Low |
| FR-DEPT-04 | System shall create default "General" department on setup | High |

### 4.2.4 Attendance Module (FR-ATT)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ATT-01 | Employee shall check in with timestamp recording | High |
| FR-ATT-02 | Employee shall check out with timestamp recording | High |
| FR-ATT-03 | System shall support multiple check-in/out sessions per day | High |
| FR-ATT-04 | System shall optionally capture geolocation on check-in | Medium |
| FR-ATT-05 | System shall calculate work hours from check-in/out times | High |
| FR-ATT-06 | System shall determine status: present, late, half_day, absent | High |
| FR-ATT-07 | System shall use configurable work start time and grace period | High |
| FR-ATT-08 | Manager/HR shall view team attendance records | High |
| FR-ATT-09 | System shall display monthly attendance calendar | Medium |
| FR-ATT-10 | Employee shall view own attendance history | High |

### 4.2.5 Leave Management (FR-LEAVE)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-LEAVE-01 | System shall seed default leave types (Casual, Sick, Earned) | High |
| FR-LEAVE-02 | Employee shall apply for leave with type, dates, reason | High |
| FR-LEAVE-03 | System shall validate leave balance before submission | High |
| FR-LEAVE-04 | Manager/HR shall approve leave requests | High |
| FR-LEAVE-05 | Manager/HR shall reject leave requests with note | High |
| FR-LEAVE-06 | System shall deduct balance on approval | High |
| FR-LEAVE-07 | Employee shall view leave balances by type | High |
| FR-LEAVE-08 | System shall notify on leave status change | Medium |

### 4.2.6 Payroll Module (FR-PAY)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PAY-01 | HR shall generate monthly payroll for all active employees | High |
| FR-PAY-02 | System shall calculate late deduction (1% per late day) | High |
| FR-PAY-03 | System shall generate unique slip numbers | High |
| FR-PAY-04 | Employee shall view own payslips | High |
| FR-PAY-05 | HR shall view all payslips | High |
| FR-PAY-06 | System shall generate downloadable PDF payslips | High |
| FR-PAY-07 | System shall format amounts in INR (₹) | High |
| FR-PAY-08 | System shall notify employees when payslip is ready | Medium |

### 4.2.7 Task Management (FR-TASK)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-TASK-01 | Manager shall create tasks with title, assignee, priority | High |
| FR-TASK-02 | System shall display tasks on Kanban board by status | High |
| FR-TASK-03 | User shall update task status via drag or action | High |
| FR-TASK-04 | User shall add collaborators to tasks | Medium |
| FR-TASK-05 | User shall add comments with @mentions | Medium |
| FR-TASK-06 | User shall attach links to tasks | Low |
| FR-TASK-07 | System shall notify assignee on task creation | Medium |

### 4.2.8 Project Management (FR-PROJ)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROJ-01 | Manager shall create clients with contact details | High |
| FR-PROJ-02 | Manager shall create projects linked to clients | High |
| FR-PROJ-03 | Manager shall set project status and budget | Medium |
| FR-PROJ-04 | Employee shall log time entries against projects | Medium |
| FR-PROJ-05 | Manager shall view project list with status | High |

### 4.2.9 Performance Module (FR-PERF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PERF-01 | Employee shall submit daily work reports | High |
| FR-PERF-02 | Manager shall create performance reviews with score | High |
| FR-PERF-03 | Manager shall provide feedback text in reviews | Medium |
| FR-PERF-04 | HR/Manager shall view performance history | Medium |

### 4.2.10 Notifications (FR-NOTIF)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOTIF-01 | System shall create in-app notifications for events | High |
| FR-NOTIF-02 | System shall send email notifications (when configured) | Medium |
| FR-NOTIF-03 | User shall view notification list | High |
| FR-NOTIF-04 | User shall mark notifications as read | Medium |
| FR-NOTIF-05 | System shall show unread count in sidebar | Medium |

### 4.2.11 Organization Settings (FR-ORG)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ORG-01 | Admin shall update organization name and contact info | High |
| FR-ORG-02 | Admin shall upload organization logo | Medium |
| FR-ORG-03 | Admin shall configure work hours and policies | High |
| FR-ORG-04 | Admin shall set late grace minutes | High |
| FR-ORG-05 | Admin shall set half-day hour threshold | Medium |

## 4.3 Non-Functional Requirements

### 4.3.1 Performance (NFR-PERF)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-01 | Page load time on broadband | < 3 seconds |
| NFR-PERF-02 | Server action response time | < 500ms |
| NFR-PERF-03 | Dashboard chart rendering | < 1 second |
| NFR-PERF-04 | Concurrent users per organization | 50+ |
| NFR-PERF-05 | Database query optimization | Indexed foreign keys |

### 4.3.2 Security (NFR-SEC)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-SEC-01 | Passwords must be hashed | Better Auth bcrypt |
| NFR-SEC-02 | Sessions must be HTTP-only cookies | Better Auth sessions |
| NFR-SEC-03 | RBAC enforced on server | requirePermission() |
| NFR-SEC-04 | SQL injection prevention | Drizzle ORM parameterized queries |
| NFR-SEC-05 | XSS prevention | React auto-escaping |
| NFR-SEC-06 | CSRF protection | Server Actions built-in |
| NFR-SEC-07 | File upload validation | UploadThing type/size limits |

### 4.3.3 Usability (NFR-USE)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-USE-01 | Responsive design | Tailwind CSS breakpoints |
| NFR-USE-02 | Dark/light theme support | next-themes |
| NFR-USE-03 | Consistent navigation | Sidebar with role filtering |
| NFR-USE-04 | Loading states | Skeleton components |
| NFR-USE-05 | Error feedback | Toast notifications (Sonner) |
| NFR-USE-06 | Form validation | Client + server validation |

### 4.3.4 Reliability (NFR-REL)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-REL-01 | Database backups | Neon automatic backups |
| NFR-REL-02 | Error handling | Graceful error messages |
| NFR-REL-03 | Data integrity | Foreign key constraints |
| NFR-REL-04 | Uptime (production) | 99.9% (Vercel SLA) |

### 4.3.5 Maintainability (NFR-MAIN)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-MAIN-01 | Type safety | TypeScript throughout |
| NFR-MAIN-02 | Code organization | Feature-based folders |
| NFR-MAIN-03 | Database migrations | Drizzle Kit |
| NFR-MAIN-04 | Component reusability | shadcn/ui library |
| NFR-MAIN-05 | Linting | ESLint with Next.js config |

### 4.3.6 Compatibility (NFR-COMP)

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-COMP-01 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-COMP-02 | Mobile browsers | iOS Safari, Chrome Android |
| NFR-COMP-03 | Screen sizes | 320px to 2560px width |
| NFR-COMP-04 | Node.js version | 20.x or later |

## 4.4 Hardware Requirements

### Development Environment

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel i3 / AMD equivalent | Intel i5 / Apple M1 |
| RAM | 8 GB | 16 GB |
| Storage | 10 GB free | 20 GB SSD |
| Display | 1366×768 | 1920×1080 |
| Internet | Broadband | Broadband |

### Production (Cloud-Hosted)

| Component | Specification |
|-----------|---------------|
| Application Server | Vercel Serverless (auto-scaled) |
| Database Server | Neon PostgreSQL (serverless) |
| File Storage | UploadThing CDN |
| Email Service | Resend API |

## 4.5 Software Requirements

### Development

| Software | Version |
|----------|---------|
| Node.js | 20.x or later |
| npm | 10.x or later |
| Git | 2.x |
| Code Editor | VS Code / Cursor (recommended) |
| PostgreSQL Client | Optional (Drizzle Studio) |

### Production

| Service | Purpose |
|---------|---------|
| Vercel | Application hosting |
| Neon | PostgreSQL database |
| UploadThing | File uploads |
| Resend | Transactional email |

## 4.6 Constraints

1. **Single organization per user** — A user can belong to only one organization at a time
2. **Email-based identity** — No username; email is the unique identifier
3. **Web-only** — No native mobile applications in current scope
4. **English language** — UI is English only; no i18n in v1
5. **INR currency** — Payroll displays Indian Rupees only
6. **Manual payroll trigger** — No automatic scheduled payroll generation

## 4.7 Assumptions

1. Users have stable internet connectivity
2. Organizations have fewer than 100 employees
3. HR staff have basic computer literacy
4. Email delivery is configured for notifications (optional)
5. Employees use modern web browsers with JavaScript enabled
6. Geolocation requires user browser permission

## 4.8 Summary

Office Flow defines 60+ functional requirements across 11 modules and 25+ non-functional requirements covering performance, security, usability, and maintainability. These requirements form the acceptance criteria for system testing and validation.
