\newpage

# CHAPTER 8
# IMPLEMENTATION

## 8.1 Introduction

This chapter describes the module-wise implementation of Office Flow, including key algorithms, code organization, and integration points. Each module is presented with its purpose, implementation approach, and critical code patterns.

## 8.2 Project Setup

### 8.2.1 Directory Structure

```
office-flow/
├── drizzle/                 # SQL migration files
├── public/                  # Static assets
├── src/
│   ├── actions/             # Server Actions (15 files)
│   ├── app/                 # App Router pages
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   └── api/             # API route handlers
│   ├── components/          # React components (~80 files)
│   ├── db/                  # Database connection & schema
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility libraries
├── components.json          # shadcn configuration
├── drizzle.config.ts        # Drizzle Kit configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### 8.2.2 Environment Configuration

Required environment variables in `.env.local`:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=your-32-character-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=re_xxxxxxxx        # Optional
EMAIL_FROM=Office Flow <onboarding@resend.dev>
UPLOADTHING_TOKEN=sk_live_xxxx    # For file uploads
```

## 8.3 Authentication Implementation

### 8.3.1 Better Auth Configuration

File: `src/lib/auth.ts`

The authentication system is configured with:
- Drizzle adapter pointing to auth schema tables
- Email/password provider enabled
- Session expiration and cookie settings
- Base URL from environment variable

### 8.3.2 Middleware Protection

File: `src/middleware.ts`

```typescript
// Public routes that don't require authentication
const publicPaths = ["/", "/login", "/register", "/signup"];

// All other routes require valid session cookie
// Redirects to /login if not authenticated
```

### 8.3.3 Registration Flow

**Company Admin Path (`/register`):**
1. User fills registration form (name, email, password, company name)
2. `authClient.signUp.email()` creates user account
3. `setupWorkspace(companyName)` server action executes:
   - Creates organization with slugified name
   - Adds user as admin member
   - Creates "General" department
   - Creates employee record (EMP001)
   - Seeds work_settings with defaults
   - Creates leave types (Casual: 12d, Sick: 10d, Earned: 15d)
   - Seeds leave balances for admin
4. Redirect to `/dashboard`

**Employee Path (`/signup`):**
1. User creates account with name, email, password
2. Redirect to `/pending` page
3. HR adds employee via `/employees` page
4. Employee gains dashboard access

## 8.4 Employee Management Implementation

### 8.4.1 Adding Employees

File: `src/actions/employees.ts`

**Algorithm:**
1. Validate HR has `manageEmployees` permission
2. Look up user by email in `user` table
3. If not found, return error "User must sign up first"
4. Check user is not already in organization
5. Generate next employee code (EMP002, EMP003...)
6. Insert into `organization_members` with assigned role
7. Insert into `employees` with department, salary
8. Call `seedLeaveBalancesForEmployee()` for all leave types
9. Revalidate employees page cache

### 8.4.2 Profile Completion Tracking

File: `src/lib/employee-profile.ts`

Calculates profile completion percentage based on filled fields:
- Personal: phone, address, city, state, postalCode, dateOfBirth
- Emergency: emergencyContactName, emergencyContactPhone
- Bank: bankName, bankAccountHolder, bankAccountNumber, bankIfsc
- Employment: designation, joiningDate

Formula: `(filledFields / totalFields) * 100`

## 8.5 Attendance Implementation

### 8.5.1 Check-In Algorithm

File: `src/actions/attendance.ts` and `src/lib/attendance.ts`

```
function determineStatus(checkInTime, workSettings):
    workStart = today at workSettings.workStartHour:workStartMinute
    graceEnd = workStart + workSettings.lateGraceMinutes
    
    if checkInTime <= graceEnd:
        return "present"
    else:
        return "late"
```

### 8.5.2 Work Hours Calculation

```
function calculateWorkHours(checkIn, checkOut):
    if not checkIn or not checkOut:
        return null
    
    diffMs = checkOut - checkIn
    hours = diffMs / (1000 * 60 * 60)
    return round(hours, 2)
```

### 8.5.3 Multiple Sessions Support

Employees can check in and out multiple times per day. Each check-in creates a new `attendance_records` row. The calendar view aggregates all sessions for display.

### 8.5.4 Geolocation Check-In

Optional feature using browser Geolocation API:
1. Client requests `navigator.geolocation.getCurrentPosition()`
2. Latitude and longitude sent to `checkInWithGeoAction`
3. Stored in attendance_records for audit purposes

## 8.6 Leave Management Implementation

### 8.6.1 Leave Application

File: `src/actions/leave.ts`

**Validation steps:**
1. Parse start and end dates
2. Calculate business days between dates
3. Query leave_balances for selected type and year
4. Check: `totalDays - usedDays >= requestedDays`
5. If insufficient balance, return error
6. Insert leave_request with status "pending"
7. Notify managers/HR via `notifyLeaveRequest()`

### 8.6.2 Leave Approval

```
function reviewLeave(requestId, status, reviewNote):
    if status == "approved":
        update leave_balances set usedDays = usedDays + request.days
    update leave_requests set status, reviewedBy, reviewNote
    notify employee of decision
```

## 8.7 Payroll Implementation

### 8.7.1 Payroll Generation Algorithm

File: `src/actions/payroll.ts`

```
function generatePayroll(month, year):
    create payroll_run record
    
    for each active employee:
        baseSalary = employee.baseSalary
        
        // Count late days in month
        lateDays = count attendance_records 
                   where status = 'late' 
                   and month = selected month
        
        lateDeduction = baseSalary * 0.01 * lateDays
        netSalary = baseSalary - lateDeduction
        
        slipNumber = "SLIP-{year}{month}-{employeeCode}"
        
        create payslip record
        notify employee
```

### 8.7.2 Payslip PDF Generation

File: `src/app/api/payslips/[id]/pdf/route.ts`

Uses jsPDF to generate PDF with:
- Organization name and logo
- Employee details (name, code, department)
- Pay period (month/year)
- Earnings breakdown (base, bonus, incentives)
- Deductions breakdown (leave, late, other)
- Net salary in INR format
- Slip number for reference

### 8.7.3 Currency Formatting

File: `src/lib/payroll.ts`

```typescript
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
// Output: ₹45,000.00
```

## 8.8 Task Management Implementation

### 8.8.1 Kanban Board

File: `src/components/tasks/task-board.tsx`

Three-column layout:
- **Pending** — New tasks awaiting work
- **In Progress** — Active tasks
- **Completed** — Finished tasks

Status updates via `updateTaskStatus(taskId, newStatus)` server action.

### 8.8.2 Task Comments with Mentions

File: `src/lib/task-mentions.ts`

Parses `@EmployeeName` patterns in comment text:
1. Extract mention patterns using regex
2. Look up employees by name in organization
3. Insert into `task_comment_mentions` table
4. Send notifications to mentioned employees

### 8.8.3 Task Detail Sheet

Slide-over panel (`task-detail-sheet.tsx`) showing:
- Task metadata (title, status, priority, due date)
- Assignee and collaborators
- Attached links
- Comment thread with mention support
- Edit capabilities for authorized users

## 8.9 Dashboard Implementation

### 8.9.1 Role-Aware Statistics

File: `src/actions/dashboard.ts`

**Team View (Admin/HR/Manager):**
- Total employees count
- Present today count
- Pending leave requests
- Active tasks count
- Task completion rate

**Personal View (Employee):**
- Own attendance status today
- Own leave balances
- Assigned tasks count
- Own pending leave requests

### 8.9.2 Charts

File: `src/components/dashboard/dashboard-charts.tsx`

| Chart | Type | Data Source |
|-------|------|-------------|
| Attendance Trend | Line/Bar | Last 7 days attendance counts |
| Task Breakdown | Pie | Tasks by status |
| Attendance Distribution | Pie | present/late/absent ratio |
| Leave Overview | Bar | Leave balances by type |

Uses Recharts library with responsive containers.

## 8.10 Notification Implementation

### 8.10.1 Notification Types

| Type | Trigger Events |
|------|----------------|
| task | Task assigned, mentioned in comment |
| leave | Leave approved/rejected, new request |
| salary | Payslip generated |
| attendance | (Future: missed check-in reminder) |
| general | System announcements |

### 8.10.2 Dual Channel Delivery

File: `src/lib/notify.ts`

```
function notify(userId, type, title, message, link):
    // Always create in-app notification
    insert into notifications table
    
    // Optionally send email if RESEND_API_KEY configured
    if resend configured:
        send email via Resend API
```

## 8.11 Organization Settings Implementation

### 8.11.1 Work Policy Configuration

Admin can configure via `/settings`:
- Work start time (hour:minute)
- Work end time (hour:minute)
- Late grace period (minutes)
- Half-day threshold (hours)

These settings affect attendance status calculation for all employees.

### 8.11.2 Logo Upload

Uses UploadThing with admin permission check:
1. Admin uploads image via `organizationLogo` endpoint
2. On upload complete, `organizations.logoUrl` updated
3. Logo displayed in sidebar and payslips

## 8.12 Code Quality Practices

| Practice | Implementation |
|----------|----------------|
| Type safety | TypeScript strict mode |
| Linting | ESLint with Next.js config |
| Code organization | Feature-based folder structure |
| Error handling | Consistent actionSuccess/actionError pattern |
| Cache invalidation | revalidatePath() after mutations |
| Loading states | Route-level loading.tsx files |
| Form handling | Server Actions with FormData |

## 8.13 Summary

Office Flow implementation demonstrates modern full-stack patterns with 15 server action files, 80+ components, and 25 database tables working together. Each module follows consistent patterns for authentication, authorization, data access, and user feedback.
