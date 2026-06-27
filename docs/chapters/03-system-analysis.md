\newpage

# CHAPTER 3
# SYSTEM ANALYSIS

## 3.1 Introduction

System analysis is the process of studying a business problem and determining how a software system can solve it. This chapter identifies stakeholders, defines use cases, creates data flow diagrams, and analyzes the functional boundaries of Office Flow.

## 3.2 Stakeholders

| Stakeholder | Role | Primary Needs |
|-------------|------|---------------|
| **Company Admin** | Organization owner/founder | Full system control, org settings, assign HR role |
| **HR Manager** | Human resources staff | Employee onboarding, payroll, records, departments |
| **Team Manager** | Department/project lead | Team attendance, leave approval, task assignment, reviews |
| **Employee** | Regular staff member | Check-in, apply leave, view payslips, complete tasks |
| **System Administrator** | Technical maintainer | Deploy, configure environment, database management |

## 3.3 User Roles and Responsibilities

### 3.3.1 Admin Role

The Admin is typically the company founder or owner who registers the organization.

**Responsibilities:**
- Create and configure the organization workspace
- Manage organization settings (name, logo, contact details)
- Configure work policies (start time, grace period, half-day threshold)
- Assign HR and Manager roles to members
- Access all modules without restriction

**Permissions:** All permissions including `manageOrganization`

### 3.3.2 HR Role

The HR role is assigned by the Admin to handle day-to-day human resource operations.

**Responsibilities:**
- Add new employees to the organization
- Create and manage departments
- Generate monthly payroll
- View all employee records and payslips
- Set employee passwords when needed

**Permissions:** `manageEmployees`, `manageDepartments`, `generatePayroll`, `viewAllPayslips`, `viewEmployeeRecords`, `approveLeave`

### 3.3.3 Manager Role

Managers oversee teams and approve operational requests.

**Responsibilities:**
- Approve or reject leave requests from team members
- Assign and track tasks
- Create and manage projects
- View team attendance records
- Create performance reviews
- Access reports and analytics

**Permissions:** `approveLeave`, `createPerformanceReview`, `manageProjects`, `assignTasks`, `viewTeamAttendance`, `viewReports`

### 3.3.4 Employee Role

Employees are regular staff members who use self-service features.

**Responsibilities:**
- Check in and check out daily
- Apply for leave
- View own payslips
- Update personal profile and bank details
- Complete assigned tasks
- Submit daily performance reports

**Permissions:** Basic access to personal modules only

## 3.4 Use Case Diagram

The following diagram shows the primary actors and their interactions with the system:

```
                    ┌─────────────────────────────────────────┐
                    │            OFFICE FLOW SYSTEM            │
                    │                                         │
    ┌──────────┐    │  ┌─────────────┐  ┌─────────────────┐  │
    │  Admin   │───►│  │ Manage Org  │  │ Configure Work  │  │
    └──────────┘    │  │  Settings   │  │    Policies     │  │
                    │  └─────────────┘  └─────────────────┘  │
    ┌──────────┐    │  ┌─────────────┐  ┌─────────────────┐  │
    │    HR    │───►│  │   Manage    │  │    Generate     │  │
    └──────────┘    │  │  Employees  │  │    Payroll      │  │
                    │  └─────────────┘  └─────────────────┘  │
    ┌──────────┐    │  ┌─────────────┐  ┌─────────────────┐  │
    │ Manager  │───►│  │   Approve   │  │  Assign Tasks   │  │
    └──────────┘    │  │    Leave    │  │  & Projects     │  │
                    │  └─────────────┘  └─────────────────┘  │
    ┌──────────┐    │  ┌─────────────┐  ┌─────────────────┐  │
    │ Employee │───►│  │  Check In/  │  │   Apply for     │  │
    └──────────┘    │  │    Out      │  │     Leave       │  │
                    │  └─────────────┘  └─────────────────┘  │
                    └─────────────────────────────────────────┘
```

## 3.5 Detailed Use Cases

### UC-01: Company Registration

| Field | Description |
|-------|-------------|
| **Actor** | Admin (new user) |
| **Precondition** | User has valid email not already registered |
| **Main Flow** | 1. User navigates to /register 2. Enters name, email, password, company name 3. System creates user account via Better Auth 4. System calls setupWorkspace action 5. Organization, admin membership, default department, work settings, and leave types are created 6. User redirected to dashboard |
| **Postcondition** | Organization exists with admin as first employee (EMP001) |
| **Alternate Flow** | If email exists, show error message |

### UC-02: Employee Onboarding

| Field | Description |
|-------|-------------|
| **Actor** | HR, Employee |
| **Precondition** | Employee has signed up at /signup; HR has manageEmployees permission |
| **Main Flow** | 1. Employee creates account at /signup 2. Employee sees pending page 3. HR navigates to /employees 4. HR enters employee email, role, department, salary 5. System links user to organization 6. Leave balances seeded automatically 7. Employee can now access dashboard |
| **Postcondition** | Employee is active member with assigned role and leave balances |

### UC-03: Daily Attendance Check-In

| Field | Description |
|-------|-------------|
| **Actor** | Employee |
| **Precondition** | User is logged in and has employee record |
| **Main Flow** | 1. Employee opens /attendance 2. Clicks "Check In" button 3. System records timestamp 4. Optional: browser captures geolocation 5. Status calculated (present/late based on work settings) 6. UI updates to show active session |
| **Postcondition** | Attendance record created with check-in time |

### UC-04: Leave Application and Approval

| Field | Description |
|-------|-------------|
| **Actor** | Employee, Manager/HR |
| **Precondition** | Employee has sufficient leave balance |
| **Main Flow** | 1. Employee selects leave type and date range 2. System calculates days and validates balance 3. Leave request created with "pending" status 4. Notification sent to approvers 5. Manager/HR reviews request 6. Approver clicks Approve or Reject 7. If approved, balance deducted; notification sent to employee |
| **Postcondition** | Leave request status updated; balance adjusted if approved |

### UC-05: Monthly Payroll Generation

| Field | Description |
|-------|-------------|
| **Actor** | HR |
| **Precondition** | HR has generatePayroll permission; employees have base salary set |
| **Main Flow** | 1. HR navigates to /payroll 2. Selects month and year 3. Clicks "Generate Payroll" 4. System calculates for each active employee: base salary, late deductions (1% per late day), net salary 5. Payslips created with slip numbers (SLIP-YYYYMM-EMP_CODE) 6. Notifications sent to employees |
| **Postcondition** | Payroll run and payslips exist for selected period |

### UC-06: Task Assignment

| Field | Description |
|-------|-------------|
| **Actor** | Manager |
| **Precondition** | Manager has assignTasks permission |
| **Main Flow** | 1. Manager opens /tasks 2. Clicks "Create Task" 3. Enters title, assignee, priority, due date, optional project 4. Task appears in "Pending" column of Kanban board 5. Assignee receives notification 6. Assignee drags task to "In Progress" then "Completed" |
| **Postcondition** | Task created and visible on board |

## 3.6 Data Flow Diagram (Level 0)

```
┌──────────┐     Login/Register      ┌──────────────────┐
│          │ ───────────────────────►  │                  │
│   User   │                           │   OFFICE FLOW    │
│ (Browser)│ ◄───────────────────────  │     SYSTEM       │
│          │     Dashboard/Pages       │                  │
└──────────┘                           └────────┬─────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
           ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
           │  PostgreSQL  │           │ UploadThing  │           │    Resend    │
           │   (Neon)     │           │  (Files)     │           │   (Email)    │
           └──────────────┘           └──────────────┘           └──────────────┘
```

## 3.7 Data Flow Diagram (Level 1) — Attendance Module

```
Employee ──► [Check In Request] ──► Attendance Action ──► work_settings (read)
                                              │
                                              ▼
                                    attendance_records (write)
                                              │
                                              ▼
                                    [Calculate Status] ──► present/late/half_day
                                              │
                                              ▼
Employee ◄── [Updated UI] ◄── Attendance Page ◄── Query Records
```

## 3.8 Feasibility Study

### 3.8.1 Technical Feasibility

| Factor | Assessment |
|--------|------------|
| Technology maturity | Next.js, React, PostgreSQL are production-proven |
| Developer expertise | Modern web development skills are widely available |
| Third-party services | Neon, UploadThing, Resend offer free tiers for development |
| Scalability | Serverless architecture scales with demand |
| **Verdict** | **FEASIBLE** |

### 3.8.2 Economic Feasibility

| Factor | Assessment |
|--------|------------|
| Development cost | Open-source stack; no licensing fees |
| Hosting cost | Vercel free tier + Neon free tier for MVP |
| Maintenance | Low; managed services handle infrastructure |
| ROI for SMBs | Replaces multiple tools; saves 10+ hours/month |
| **Verdict** | **FEASIBLE** |

### 3.8.3 Operational Feasibility

| Factor | Assessment |
|--------|------------|
| User training | Intuitive UI; minimal training needed |
| Change management | Replaces familiar spreadsheets gradually |
| Support requirements | Self-service design reduces support burden |
| **Verdict** | **FEASIBLE** |

## 3.9 Summary

System analysis confirms that Office Flow addresses genuine needs of Indian SMBs with clearly defined user roles, well-scoped use cases, and feasible technical implementation. The four-role RBAC model (Admin, HR, Manager, Employee) maps directly to typical organizational hierarchies in small companies.
