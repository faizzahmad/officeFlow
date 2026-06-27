\newpage

# CHAPTER 6
# DATABASE DESIGN

## 6.1 Introduction

The database is the persistent foundation of Office Flow. This chapter documents the complete schema design, entity relationships, table definitions, enums, constraints, and indexing strategy using PostgreSQL with Drizzle ORM.

## 6.2 Database Technology

| Aspect | Choice |
|--------|--------|
| **DBMS** | PostgreSQL 15+ |
| **Hosting** | Neon (serverless PostgreSQL) |
| **ORM** | Drizzle ORM 0.45.x |
| **Migration Tool** | Drizzle Kit |
| **Connection** | @neondatabase/serverless with WebSocket pool |

**Why PostgreSQL?**
- ACID compliance for financial data (payroll)
- Rich data types (UUID, timestamps, enums)
- JSON support for future extensibility
- Industry standard with excellent tooling
- Neon provides serverless scaling and branching

## 6.3 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────────┐       ┌──────────────┐
│    user     │───────│ organization_members │───────│ organizations│
│  (auth)     │       │     (role enum)      │       │              │
└─────────────┘       └─────────────────────┘       └──────────────┘
      │                         │                          │
      │                         │                          │
      ▼                         ▼                          ▼
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│   session   │       │    employees    │───────│ departments  │
│   account   │       │                 │       │              │
└─────────────┘       └────────┬────────┘       └──────────────┘
                               │
       ┌───────────────────────┼───────────────────────────────┐
       │           │           │           │                   │
       ▼           ▼           ▼           ▼                   ▼
┌────────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐   ┌─────────────┐
│ attendance │ │  leave  │ │ payslips│ │  tasks   │   │daily_reports│
│  _records  │ │requests │ │         │ │          │   │             │
└────────────┘ └─────────┘ └─────────┘ └──────────┘   └─────────────┘
       │           │           │           │
       ▼           ▼           ▼           ▼
┌────────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐
│   work     │ │  leave  │ │ payroll │ │    task      │
│  _settings │ │balances │ │  _runs  │ │ collaborators│
└────────────┘ └─────────┘ └─────────┘ │   comments   │
                                         └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │   projects   │─── clients
                                        │ time_entries │
                                        └──────────────┘
```

## 6.4 Table Definitions

### 6.4.1 Authentication Tables

#### Table: user

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Unique user identifier |
| name | TEXT | NOT NULL | Display name |
| email | TEXT | NOT NULL, UNIQUE | Login email |
| emailVerified | BOOLEAN | DEFAULT false | Email verification status |
| image | TEXT | NULLABLE | Profile image URL |
| createdAt | TIMESTAMP | NOT NULL | Account creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |

#### Table: session

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Session identifier |
| token | TEXT | NOT NULL, UNIQUE | Session token |
| expiresAt | TIMESTAMP | NOT NULL | Expiration time |
| userId | TEXT | FK → user.id | Owner user |
| ipAddress | TEXT | NULLABLE | Client IP |
| userAgent | TEXT | NULLABLE | Browser info |

#### Table: account

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | Account identifier |
| userId | TEXT | FK → user.id | Owner user |
| providerId | TEXT | NOT NULL | "credential" for email/password |
| password | TEXT | NULLABLE | Hashed password |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Update time |

### 6.4.2 Organization Tables

#### Table: organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Org identifier |
| name | TEXT | NOT NULL | Company name |
| slug | TEXT | NOT NULL, UNIQUE | URL-friendly identifier |
| contactEmail | TEXT | NULLABLE | Company email |
| contactPhone | TEXT | NULLABLE | Company phone |
| website | TEXT | NULLABLE | Company website |
| address | TEXT | NULLABLE | Company address |
| logoUrl | TEXT | NULLABLE | Logo image URL |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Update time |

#### Table: organization_members

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Membership identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| userId | TEXT | FK → user.id | User |
| role | member_role ENUM | NOT NULL | admin/hr/manager/employee |
| createdAt | TIMESTAMP | NOT NULL | Join date |

**Unique Constraint:** (organizationId, userId)

### 6.4.3 Employee Tables

#### Table: departments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Department identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| name | TEXT | NOT NULL | Department name |
| description | TEXT | NULLABLE | Description |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

#### Table: employees

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Employee identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| userId | TEXT | FK → user.id | Linked user account |
| departmentId | UUID | FK → departments.id, NULLABLE | Department |
| employeeCode | TEXT | NOT NULL | e.g., EMP001 |
| designation | TEXT | NULLABLE | Job title |
| phone | TEXT | NULLABLE | Phone number |
| address | TEXT | NULLABLE | Street address |
| city | TEXT | NULLABLE | City |
| state | TEXT | NULLABLE | State |
| postalCode | TEXT | NULLABLE | PIN code |
| dateOfBirth | DATE | NULLABLE | Date of birth |
| emergencyContactName | TEXT | NULLABLE | Emergency contact |
| emergencyContactPhone | TEXT | NULLABLE | Emergency phone |
| bankName | TEXT | NULLABLE | Bank name |
| bankAccountHolder | TEXT | NULLABLE | Account holder name |
| bankAccountNumber | TEXT | NULLABLE | Account number |
| bankIfsc | TEXT | NULLABLE | IFSC code |
| joiningDate | DATE | NULLABLE | Date of joining |
| baseSalary | NUMERIC | DEFAULT 0 | Monthly base salary |
| isActive | BOOLEAN | DEFAULT true | Active status |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Update time |

**Unique Constraints:** (organizationId, userId), (organizationId, employeeCode)

### 6.4.4 Attendance Tables

#### Table: work_settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Settings identifier |
| organizationId | UUID | FK, UNIQUE | One per organization |
| workStartHour | INTEGER | DEFAULT 9 | Work start hour (24h) |
| workStartMinute | INTEGER | DEFAULT 0 | Work start minute |
| workEndHour | INTEGER | DEFAULT 18 | Work end hour |
| workEndMinute | INTEGER | DEFAULT 0 | Work end minute |
| lateGraceMinutes | INTEGER | DEFAULT 15 | Grace period for late |
| halfDayHours | NUMERIC | DEFAULT 4 | Hours for half-day |

#### Table: attendance_records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Record identifier |
| employeeId | UUID | FK → employees.id | Employee |
| date | DATE | NOT NULL | Attendance date |
| checkIn | TIMESTAMP | NULLABLE | Check-in time |
| checkOut | TIMESTAMP | NULLABLE | Check-out time |
| workHours | NUMERIC | NULLABLE | Calculated hours |
| status | attendance_status ENUM | NOT NULL | present/late/half_day/absent |
| latitude | NUMERIC | NULLABLE | Geo latitude |
| longitude | NUMERIC | NULLABLE | Geo longitude |
| notes | TEXT | NULLABLE | Optional notes |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

### 6.4.5 Leave Tables

#### Table: leave_types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Type identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| name | TEXT | NOT NULL | e.g., "Casual Leave" |
| defaultDays | INTEGER | NOT NULL | Annual allocation |
| isPaid | INTEGER | DEFAULT 1 | 1=paid, 0=unpaid |

#### Table: leave_balances

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Balance identifier |
| employeeId | UUID | FK → employees.id | Employee |
| leaveTypeId | UUID | FK → leave_types.id | Leave type |
| year | INTEGER | NOT NULL | Calendar year |
| totalDays | INTEGER | NOT NULL | Allocated days |
| usedDays | INTEGER | DEFAULT 0 | Consumed days |

#### Table: leave_requests

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Request identifier |
| employeeId | UUID | FK → employees.id | Requesting employee |
| leaveTypeId | UUID | FK → leave_types.id | Leave type |
| startDate | DATE | NOT NULL | Start date |
| endDate | DATE | NOT NULL | End date |
| days | INTEGER | NOT NULL | Number of days |
| reason | TEXT | NULLABLE | Reason for leave |
| status | leave_status ENUM | DEFAULT 'pending' | Status |
| reviewedBy | UUID | FK → employees.id, NULLABLE | Reviewer |
| reviewNote | TEXT | NULLABLE | Reviewer comment |
| createdAt | TIMESTAMP | NOT NULL | Submission time |

### 6.4.6 Payroll Tables

#### Table: payroll_runs

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Run identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| month | INTEGER | NOT NULL | 1-12 |
| year | INTEGER | NOT NULL | e.g., 2026 |
| status | payroll_status ENUM | DEFAULT 'draft' | draft/processed/paid |
| processedAt | TIMESTAMP | NULLABLE | Processing time |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

#### Table: payslips

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Payslip identifier |
| payrollRunId | UUID | FK → payroll_runs.id | Parent run |
| employeeId | UUID | FK → employees.id | Employee |
| baseSalary | NUMERIC | NOT NULL | Base amount |
| bonus | NUMERIC | DEFAULT 0 | Bonus amount |
| incentives | NUMERIC | DEFAULT 0 | Incentives |
| leaveDeduction | NUMERIC | DEFAULT 0 | Leave deductions |
| lateDeduction | NUMERIC | DEFAULT 0 | Late day deductions |
| otherDeductions | NUMERIC | DEFAULT 0 | Other deductions |
| netSalary | NUMERIC | NOT NULL | Final amount |
| slipNumber | TEXT | NOT NULL | e.g., SLIP-202606-EMP001 |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

### 6.4.7 Task Tables

#### Table: tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Task identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| projectId | UUID | FK → projects.id, NULLABLE | Linked project |
| title | TEXT | NOT NULL | Task title |
| description | TEXT | NULLABLE | Description |
| status | task_status ENUM | DEFAULT 'pending' | pending/in_progress/completed |
| priority | task_priority ENUM | DEFAULT 'medium' | low/medium/high/urgent |
| assigneeId | UUID | FK → employees.id, NULLABLE | Assigned employee |
| createdById | UUID | FK → employees.id | Creator |
| dueDate | DATE | NULLABLE | Due date |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Update time |

#### Table: task_collaborators

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Identifier |
| taskId | UUID | FK → tasks.id | Task |
| employeeId | UUID | FK → employees.id | Collaborator |

#### Table: task_comments

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Comment identifier |
| taskId | UUID | FK → tasks.id | Task |
| authorId | UUID | FK → employees.id | Author |
| content | TEXT | NOT NULL | Comment text |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

### 6.4.8 Project Tables

#### Table: clients

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Client identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| name | TEXT | NOT NULL | Client name |
| email | TEXT | NULLABLE | Contact email |
| phone | TEXT | NULLABLE | Contact phone |
| company | TEXT | NULLABLE | Company name |

#### Table: projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Project identifier |
| organizationId | UUID | FK → organizations.id | Organization |
| clientId | UUID | FK → clients.id, NULLABLE | Client |
| managerId | UUID | FK → employees.id, NULLABLE | Project manager |
| name | TEXT | NOT NULL | Project name |
| description | TEXT | NULLABLE | Description |
| status | project_status ENUM | DEFAULT 'planning' | Status |
| budget | NUMERIC | NULLABLE | Budget amount |
| startDate | DATE | NULLABLE | Start date |
| endDate | DATE | NULLABLE | End date |

#### Table: time_entries

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Entry identifier |
| projectId | UUID | FK → projects.id | Project |
| employeeId | UUID | FK → employees.id | Employee |
| date | DATE | NOT NULL | Entry date |
| hours | NUMERIC | NOT NULL | Hours worked |
| description | TEXT | NULLABLE | Work description |

### 6.4.9 Other Tables

#### Table: notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Notification identifier |
| userId | TEXT | FK → user.id | Recipient |
| type | TEXT | NOT NULL | task/leave/salary/attendance/general |
| title | TEXT | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification body |
| link | TEXT | NULLABLE | Action URL |
| isRead | BOOLEAN | DEFAULT false | Read status |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

#### Table: daily_reports

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Report identifier |
| employeeId | UUID | FK → employees.id | Employee |
| date | DATE | NOT NULL | Report date |
| summary | TEXT | NOT NULL | Work summary |
| blockers | TEXT | NULLABLE | Blockers faced |

#### Table: performance_reviews

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Review identifier |
| employeeId | UUID | FK → employees.id | Reviewed employee |
| reviewerId | UUID | FK → employees.id | Reviewer |
| period | TEXT | NOT NULL | e.g., "Q1 2026" |
| score | INTEGER | NOT NULL | 1-100 |
| feedback | TEXT | NULLABLE | Review feedback |
| createdAt | TIMESTAMP | NOT NULL | Creation time |

## 6.5 Enumerations

| Enum Name | Values | Used In |
|-----------|--------|---------|
| member_role | admin, hr, manager, employee | organization_members.role |
| attendance_status | present, late, half_day, absent | attendance_records.status |
| leave_status | pending, approved, rejected, cancelled | leave_requests.status |
| payroll_status | draft, processed, paid | payroll_runs.status |
| task_status | pending, in_progress, completed | tasks.status |
| task_priority | low, medium, high, urgent | tasks.priority |
| project_status | planning, active, on_hold, completed, cancelled | projects.status |

## 6.6 Normalization

The schema follows **Third Normal Form (3NF)**:

1. **First NF** — All columns contain atomic values; no repeating groups
2. **Second NF** — No partial dependencies; all non-key attributes depend on full primary key
3. **Third NF** — No transitive dependencies; non-key attributes depend only on primary key

**Denormalization decisions:**
- `workHours` stored in attendance_records (calculated, but cached for query performance)
- `usedDays` in leave_balances (updated on approval, avoids COUNT queries)

## 6.7 Indexing Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| user | email (UNIQUE) | Login lookup |
| session | token (UNIQUE) | Session validation |
| organization_members | (organizationId, userId) UNIQUE | Membership check |
| employees | (organizationId, userId) UNIQUE | Employee lookup |
| employees | (organizationId, employeeCode) UNIQUE | Code lookup |
| attendance_records | employeeId, date | Daily attendance queries |
| leave_requests | employeeId, status | Pending leave queries |
| payslips | payrollRunId | Payslip listing |
| tasks | organizationId, status | Kanban board queries |
| notifications | userId, isRead | Unread count |

## 6.8 Data Dictionary Summary

| Category | Table Count | Total Columns (approx) |
|----------|-------------|------------------------|
| Authentication | 4 | 25 |
| Organization | 2 | 15 |
| Employees | 2 | 30 |
| Attendance | 2 | 18 |
| Leave | 3 | 22 |
| Payroll | 2 | 18 |
| Tasks | 4 | 25 |
| Projects | 3 | 22 |
| Performance | 2 | 12 |
| Notifications | 1 | 8 |
| **Total** | **25** | **~195** |

## 6.9 Migration Management

Drizzle Kit manages schema changes:

```bash
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply migrations to database
npm run db:push       # Push schema directly (development)
npm run db:studio     # Visual database browser
```

Manual SQL migrations in `drizzle/` folder:
- `organization-logo.sql`
- `organization-settings-fields.sql`
- `employee-profile-fields.sql`
- `attendance-multiple-sessions.sql`
- `task-collaboration.sql`

## 6.10 Summary

Office Flow's database design supports all functional requirements with 25 tables, 7 enums, and proper referential integrity. The schema is optimized for the query patterns of a multi-tenant SMB HRMS while maintaining normalization and data consistency.
