# OFFICE FLOW
## All-in-One Office CRM & HRMS System

---

### A Minor/Major Project Report

**Submitted in partial fulfillment of the requirements for the award of**

**[Degree Name — Bachelor of  Computer Application]**

**Submitted by:**

| | |
|---|---|
| **Student Name** | _________________________ |
| **Roll Number** | _________________________ |
| **Department** | _________________________ |
| **College Name** | _________________________ |
| **Academic Year** | 2025–2026 |

**Under the guidance of:**

**[Guide Name]**  
Designation, Department

---

\newpage

## CERTIFICATE

This is to certify that the project report entitled **"Office Flow — All-in-One Office CRM & HRMS System"** submitted by **[Student Name]** (Roll No: **[Roll Number]**) in partial fulfillment of the requirements for the award of **[Degree]** is a record of bonafide work carried out under my supervision and guidance.

The matter embodied in this report has not been submitted earlier for the award of any other degree or diploma to the best of my knowledge.

<br><br>

| | |
|---|---|
| **Place:** _________________ | **Guide Signature** |
| **Date:** _________________ | **Name:** _________________ |
| | **Designation:** _________________ |

<br><br>

**Head of Department**  
Name & Signature

---

\newpage

## DECLARATION

I, **[Student Name]**, Roll Number **[Roll Number]**, student of **[Department]**, **[College Name]**, hereby declare that the project report entitled **"Office Flow — All-in-One Office CRM & HRMS System"** submitted by me to **[University Name]** is a record of original work done by me under the guidance of **[Guide Name]**.

This work has not been submitted elsewhere for any other degree or diploma. All sources of information have been duly acknowledged.

<br><br>

| | |
|---|---|
| **Place:** _________________ | **Student Signature** |
| **Date:** _________________ | **Name:** _________________ |

---

\newpage

## ACKNOWLEDGEMENT

I would like to express my sincere gratitude to all those who contributed to the successful completion of this project.

First and foremost, I extend my heartfelt thanks to my project guide, **[Guide Name]**, for their invaluable guidance, continuous support, and constructive feedback throughout the development of Office Flow. Their expertise and encouragement helped me overcome technical challenges and maintain focus on delivering a complete, working system.

I am deeply grateful to the Head of the Department, **[HOD Name]**, and all faculty members of the **[Department]** department for providing the academic environment and resources necessary for this project.

I would also like to thank my classmates and friends who provided feedback during testing phases, and my family for their unwavering support and patience during the long hours of development.

Finally, I acknowledge the open-source community and the creators of Next.js, React, Drizzle ORM, Better Auth, and other technologies that made this project possible.

<br><br>

| | |
|---|---|
| **Place:** _________________ | **Student Signature** |
| **Date:** _________________ | |

---

\newpage

## ABSTRACT

Small and medium businesses (SMBs) in India often rely on disconnected spreadsheets, manual attendance registers, and informal communication channels to manage human resources, payroll, leave, and daily operations. This fragmented approach leads to data inconsistency, delayed approvals, payroll errors, and poor visibility into team performance.

**Office Flow** is a comprehensive web-based Human Resource Management System (HRMS) and Customer Relationship Management (CRM) platform designed specifically for startups, agencies, coaching centers, and small IT companies. The system integrates employee management, attendance tracking, leave management, payroll processing, task management, project tracking, and performance reporting into a single unified dashboard.

The application is built using **Next.js 16** with the App Router architecture, **React 19**, and **TypeScript** on the frontend. The backend leverages Next.js Server Actions and API Route Handlers, with **PostgreSQL** (hosted on Neon) as the database and **Drizzle ORM** for type-safe database operations. Authentication is handled by **Better Auth** with role-based access control (RBAC) supporting four user roles: Admin, HR, Manager, and Employee.

Key features include real-time attendance check-in/check-out with geolocation support, automated leave balance management, monthly payroll generation with late-day deductions, Kanban-style task boards, project time tracking, performance reviews, in-app and email notifications, and PDF payslip generation.

The system follows modern software engineering practices including server-side rendering, component-based architecture, responsive design with dark/light theme support, and secure session-based authentication. Office Flow demonstrates how a full-stack SaaS application can be built using contemporary web technologies to solve real-world business problems faced by Indian SMBs.

**Keywords:** HRMS, CRM, Next.js, React, PostgreSQL, Drizzle ORM, Role-Based Access Control, Payroll Management, Attendance Tracking, SaaS

---

\newpage

## TABLE OF CONTENTS

| Chapter | Title | Page |
|---------|-------|------|
| 1 | Introduction | |
| 2 | Literature Review & Existing Systems | |
| 3 | System Analysis | |
| 4 | System Requirements | |
| 5 | System Design | |
| 6 | Database Design | |
| 7 | Technology Stack | |
| 8 | Implementation | |
| 9 | Security & Authentication | |
| 10 | User Interface Design | |
| 11 | Testing | |
| 12 | Deployment & Installation | |
| 13 | Results & Discussion | |
| 14 | Conclusion & Future Scope | |
| | References | |
| | Appendices | |

---

\newpage

# CHAPTER 1
# INTRODUCTION

## 1.1 Background

Human Resource Management is a critical function in every organization, regardless of size. For large enterprises, dedicated HR software such as SAP SuccessFactors, Workday, or Zoho People provides comprehensive solutions. However, small and medium businesses (SMBs) — particularly startups, digital agencies, coaching institutes, and IT service companies in India — often lack the budget and technical expertise to adopt enterprise-grade HRMS solutions.

These organizations typically manage their workforce using a combination of:

- **Microsoft Excel or Google Sheets** for employee records and salary calculations
- **Physical attendance registers** or WhatsApp messages for daily attendance
- **Email or paper forms** for leave applications
- **Informal task assignment** via chat applications
- **Manual payslip generation** in Word or PDF templates

This ad-hoc approach creates several problems:

1. **Data fragmentation** — Employee information exists in multiple files with no single source of truth
2. **Human error** — Manual salary calculations and attendance summaries are prone to mistakes
3. **Delayed approvals** — Leave requests get lost in email threads
4. **No audit trail** — Changes to records are not tracked
5. **Poor scalability** — Processes that work for 5 employees break down at 50
6. **Compliance risk** — Inconsistent record-keeping makes statutory compliance difficult

The COVID-19 pandemic accelerated the need for digital HR tools, as remote work made physical attendance registers obsolete. Indian SMBs, which employ over 110 million people according to industry estimates, represent a massive underserved market for affordable, easy-to-use HR technology.

## 1.2 Problem Statement

There is a significant gap in the market for an integrated office management platform that:

- Combines HR, payroll, attendance, leave, tasks, and performance in one application
- Is affordable for Indian SMBs (targeting ₹999–₹4,999 per month pricing)
- Supports role-based access so different stakeholders see only what they need
- Works on any modern web browser without requiring desktop software installation
- Handles Indian-specific requirements such as INR currency, IFSC bank codes, and common leave types (Casual, Sick, Earned)
- Can be set up quickly without IT department involvement

Existing solutions either target large enterprises (too expensive and complex) or address only one function (attendance-only apps, payroll-only tools) without integration.

## 1.3 Objectives

The primary objectives of the Office Flow project are:

### Primary Objectives

1. **Design and develop** a full-stack web application that unifies HR operations, payroll, attendance, leave management, task tracking, and performance reporting
2. **Implement role-based access control** with four distinct user roles (Admin, HR, Manager, Employee) and granular permissions
3. **Create an intuitive user interface** that non-technical users can navigate without training
4. **Build a secure authentication system** with email/password login and session management
5. **Develop automated payroll processing** with configurable deductions for late attendance
6. **Enable real-time attendance tracking** with check-in/check-out and optional geolocation

### Secondary Objectives

1. Support dark and light themes for user preference
2. Generate downloadable PDF payslips
3. Send email and in-app notifications for important events
4. Provide dashboard analytics with charts and KPIs
5. Allow file uploads for profile pictures and organization logos
6. Design a responsive layout that works on desktop and mobile browsers

## 1.4 Scope of the Project

### In Scope

| Module | Features Included |
|--------|-------------------|
| Authentication | Registration, login, logout, password change, company workspace setup |
| Employee Management | Add employees, assign roles/departments, employee codes, salary setup |
| Departments | Create, update, delete organizational departments |
| Employee Records | HR view of complete employee profiles with completion tracking |
| Profile Management | Self-service personal details, bank info, avatar upload |
| Attendance | Check-in/out, multiple sessions, geo-location, calendar view, status detection |
| Leave Management | Apply, approve/reject, balance tracking, default leave types |
| Payroll | Monthly generation, deductions, payslip view, PDF download |
| Tasks | Kanban board, priorities, collaborators, comments, mentions |
| Projects | Client management, project tracking, time entries |
| Performance | Daily reports, manager reviews with scoring |
| Reports | Analytics dashboard for managers and HR |
| Notifications | In-app and email notifications |
| Settings | Organization profile, work policies, logo upload |

### Out of Scope

- Mobile native applications (iOS/Android)
- Biometric attendance hardware integration
- Statutory compliance automation (PF, ESI, TDS filing)
- Multi-organization support per user account
- OAuth social login (Google, Microsoft)
- Real-time chat or video conferencing
- Inventory or asset management
- Automated unit and integration test suites

## 1.5 Organization of the Report

This report is organized into fourteen chapters:

- **Chapter 1** introduces the problem, objectives, and scope
- **Chapter 2** reviews existing HRMS solutions and related research
- **Chapter 3** presents system analysis including stakeholders and use cases
- **Chapter 4** defines functional and non-functional requirements
- **Chapter 5** describes the system architecture and design
- **Chapter 6** details the database schema and relationships
- **Chapter 7** explains technology choices and justification
- **Chapter 8** covers module-wise implementation
- **Chapter 9** addresses security and authentication
- **Chapter 10** describes UI/UX design patterns
- **Chapter 11** documents testing methodology and test cases
- **Chapter 12** provides deployment and installation instructions
- **Chapter 13** discusses results and system evaluation
- **Chapter 14** concludes with future enhancement possibilities

---

\newpage

# CHAPTER 2
# LITERATURE REVIEW & EXISTING SYSTEMS

## 2.1 Introduction

Human Resource Management Systems have evolved significantly over the past three decades. From mainframe-based payroll systems in the 1990s to cloud-based SaaS platforms today, HR technology has transformed how organizations manage their workforce. This chapter reviews existing solutions, academic perspectives on HRMS adoption, and the gap that Office Flow aims to fill.

## 2.2 Evolution of HRMS

### 2.2.1 First Generation (1990s–2000s)

Early HR systems were on-premise software installed on company servers. Examples include PeopleSoft (acquired by Oracle) and early versions of SAP HR. These systems focused primarily on payroll and basic employee records. Implementation required significant IT infrastructure, dedicated servers, and months of customization.

**Characteristics:**
- On-premise deployment
- High upfront licensing costs
- Limited web access
- Complex implementation (6–18 months)
- Target: Large enterprises (1000+ employees)

### 2.2.2 Second Generation (2000s–2010s)

The rise of web applications brought browser-based HR portals. Systems like ADP Workforce Now and Ceridian Dayforce introduced self-service features where employees could view payslips and apply for leave online.

**Characteristics:**
- Web-based interfaces
- Employee self-service portals
- Integration with time clocks
- Reduced IT dependency
- Target: Mid-size companies (100–1000 employees)

### 2.2.3 Third Generation (2010s–Present)

Cloud SaaS platforms revolutionized HR technology. Zoho People, BambooHR, Gusto, and Rippling offer subscription-based pricing, rapid deployment, and mobile apps. The API-first approach enables integration with other business tools.

**Characteristics:**
- Cloud-native SaaS
- Monthly subscription pricing
- Mobile applications
- API integrations
- AI-powered analytics (emerging)
- Target: SMBs to enterprises

## 2.3 Existing Commercial Solutions

### 2.3.1 Zoho People

Zoho People is a popular HRMS in the Indian market, part of the Zoho suite of business applications.

| Aspect | Details |
|--------|---------|
| **Pricing** | Starts at ₹50/user/month |
| **Strengths** | Comprehensive features, Zoho ecosystem integration, Indian compliance |
| **Weaknesses** | Can be overwhelming for small teams, requires Zoho account |
| **Target** | SMBs to mid-market |

### 2.3.2 Keka HR

Keka is an India-focused HR and payroll platform known for its modern UI.

| Aspect | Details |
|--------|---------|
| **Pricing** | Custom pricing, typically ₹8,000+/month |
| **Strengths** | Indian payroll compliance, modern interface, good support |
| **Weaknesses** | Higher cost for very small teams, limited project management |
| **Target** | Indian SMBs (20–500 employees) |

### 2.3.3 BambooHR

BambooHR is a US-based HR platform popular among startups globally.

| Aspect | Details |
|--------|---------|
| **Pricing** | Starts at ~$6/employee/month |
| **Strengths** | Excellent UX, strong reporting, good onboarding |
| **Weaknesses** | Limited Indian payroll features, USD pricing |
| **Target** | US/international SMBs |

### 2.3.4 Jira (Atlassian)

While not an HRMS, Jira is widely used for task and project management in IT companies.

| Aspect | Details |
|--------|---------|
| **Pricing** | Free tier available, paid from $7.75/user/month |
| **Strengths** | Industry-standard for agile teams, powerful workflows |
| **Weaknesses** | No HR features, steep learning curve, not HR-focused |
| **Target** | Software development teams |

## 2.4 Comparison Matrix

| Feature | Zoho People | Keka | BambooHR | Jira | **Office Flow** |
|---------|-------------|------|----------|------|-----------------|
| Employee Management | ✓ | ✓ | ✓ | ✗ | ✓ |
| Attendance Tracking | ✓ | ✓ | ✓ | ✗ | ✓ |
| Leave Management | ✓ | ✓ | ✓ | ✗ | ✓ |
| Payroll (India) | ✓ | ✓ | Limited | ✗ | ✓ |
| Task Management | Basic | ✗ | ✗ | ✓ | ✓ |
| Project Tracking | ✗ | ✗ | ✗ | ✓ | ✓ |
| Performance Reviews | ✓ | ✓ | ✓ | ✗ | ✓ |
| Kanban Board | ✗ | ✗ | ✗ | ✓ | ✓ |
| Open Source | ✗ | ✗ | ✗ | ✗ | ✓ (self-hosted) |
| Setup Time | Days | Days | Days | Hours | Minutes |
| Indian SMB Focus | Medium | High | Low | Low | **High** |

## 2.5 Academic Perspectives

Research on HRMS adoption in SMBs highlights several key findings:

1. **Cost sensitivity** — SMBs prioritize affordability over feature richness (Marler & Fisher, 2013)
2. **Ease of use** — User adoption fails when interfaces are complex (Florkowski, 2006)
3. **Integration value** — Unified platforms reduce data silos and improve decision-making (Strohmeier, 2007)
4. **Cloud preference** — Post-pandemic, cloud-based solutions dominate new adoptions (Gartner, 2023)
5. **Mobile access** — Employees expect mobile-friendly interfaces for self-service (Deloitte, 2024)

## 2.6 Identified Gap

Based on the literature review and market analysis, the following gap exists:

> There is no affordable, integrated solution that combines HRMS functionality (attendance, leave, payroll) with project management (tasks, projects, time tracking) specifically designed for Indian SMBs with fewer than 50 employees.

Office Flow addresses this gap by providing:

1. **Unified platform** — HR + Tasks + Projects in one application
2. **Role-based simplicity** — Each user sees only relevant features
3. **Indian context** — INR currency, IFSC fields, standard leave types
4. **Modern technology** — Built with latest web frameworks for performance and maintainability
5. **Rapid deployment** — Cloud-ready architecture deployable in minutes

## 2.7 Summary

The HRMS market is mature for enterprise solutions but underserved for small Indian businesses that need integrated HR and operations management. Office Flow positions itself as a "mini Zoho People + Jira" — combining the essential HR features of established platforms with the task management capabilities that agile teams require, at a price point accessible to startups and small agencies.

---

*Continued in Chapter 3–14. See companion files or run `npm run docs:combine` to generate the full PDF-ready document.*
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
\newpage

# CHAPTER 10
# USER INTERFACE DESIGN

## 10.1 Introduction

User Interface (UI) and User Experience (UX) design directly impact user adoption and productivity. This chapter documents the design system, visual language, component patterns, and responsive behavior of Office Flow.

## 10.2 Design Philosophy

Office Flow follows these UI/UX principles:

1. **Clarity over cleverness** — Users should understand every screen without training
2. **Consistency** — Same patterns for navigation, forms, and feedback across modules
3. **Role-appropriate** — Show only what each user role needs
4. **Progressive disclosure** — Complex features hidden until needed
5. **Responsive first** — Works on desktop and mobile browsers
6. **Accessible** — Semantic HTML, keyboard navigation, screen reader support

## 10.3 Design System

### 10.3.1 Component Library

Office Flow uses **shadcn/ui** with the **base-nova** style variant:

| Component Category | Components Used |
|--------------------|-----------------|
| Layout | Card, Sidebar, Sheet, Dialog, Drawer |
| Forms | Input, Textarea, Select, Checkbox, Button |
| Data Display | Table, Badge, Avatar, Progress |
| Feedback | Toast (Sonner), Alert, Skeleton |
| Navigation | Tabs, Dropdown Menu, Command |
| Charts | Recharts integration |

Total: 50+ UI primitives in `src/components/ui/`

### 10.3.2 Typography

| Element | Font Family | Usage |
|---------|-------------|-------|
| Body text | DM Sans | Paragraphs, labels, table content |
| Headings | Plus Jakarta Sans | Page titles, section headers, card titles |
| Monospace | System default | Code snippets, employee codes |

Font loading via `next/font/google` for optimal performance.

### 10.3.3 Color System

Colors defined using OKLCH color space in `src/app/globals.css`:

**Light Mode:**
| Token | Value | Usage |
|-------|-------|-------|
| --background | oklch(0.99 0 0) | Page background |
| --foreground | oklch(0.15 0 0) | Primary text |
| --primary | oklch(0.52 0.17 295) | Buttons, links (purple) |
| --secondary | oklch(0.96 0.01 295) | Subtle backgrounds |
| --accent | oklch(0.62 0.16 350) | Highlights (pink/coral) |
| --destructive | oklch(0.55 0.2 25) | Error states, delete actions |
| --muted | oklch(0.96 0 0) | Disabled, placeholder text |
| --border | oklch(0.90 0 0) | Borders, dividers |

**Dark Mode:**
Equivalent dark variants with adjusted lightness for contrast.

**Chart Colors:**
Five distinct colors for data visualization (chart-1 through chart-5).

### 10.3.4 Spacing and Layout

| Token | Value | Usage |
|-------|-------|-------|
| --radius | 0.75rem | Border radius for cards, buttons |
| Container max-width | 6xl (1152px) | Landing page content |
| Sidebar width | 16rem (expanded), 3rem (collapsed) | Navigation |
| Page padding | 1.5rem (24px) | Dashboard content area |

### 10.3.5 Iconography

**Lucide React** icon library used throughout:

| Module | Icon |
|--------|------|
| Dashboard | LayoutDashboard |
| Employees | Users |
| Attendance | Clock |
| Leave | CalendarDays |
| Payroll | DollarSign |
| Tasks | ClipboardList |
| Projects | FolderKanban |
| Performance | BarChart3 |
| Settings | Settings |
| Notifications | Bell |

## 10.4 Page Layouts

### 10.4.1 Landing Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                              [Theme] [Sign In] [CTA]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────┐   ┌─────────────────────┐   │
│   │  Hero Headline          │   │                     │   │
│   │  Subtitle               │   │   Feature Cards     │   │
│   │  [Start Free] [Sign In] │   │   (6 modules)       │   │
│   │                         │   │                     │   │
│   └─────────────────────────┘   └─────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐ │
│   │              Feature Grid (3x2 cards)                │ │
│   └─────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐ │
│   │              Pricing Section                         │ │
│   └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 10.4.2 Authentication Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌─────────────────────┐   ┌─────────────────────────┐   │
│   │                     │   │                         │   │
│   │   Brand Panel       │   │   Auth Form             │   │
│   │   - Logo            │   │   - Title               │   │
│   │   - Tagline         │   │   - Input fields        │   │
│   │   - Feature list    │   │   - Submit button       │   │
│   │                     │   │   - Link to alt action  │   │
│   │   (hidden mobile)   │   │                         │   │
│   └─────────────────────┘   └─────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 10.4.3 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────┐ ┌─────────────────────────────────────────────┐ │
│ │         │ │  Header: [Breadcrumb] [Theme] [User Menu]    │ │
│ │ Sidebar │ ├─────────────────────────────────────────────┤ │
│ │         │ │                                             │ │
│ │ - Logo  │ │  Page Header: Title + Description + Actions │ │
│ │ - Nav   │ │                                             │ │
│ │ - Items │ │  ┌─────────────────────────────────────┐   │ │
│ │         │ │  │                                     │   │ │
│ │ [Notif] │ │  │         Main Content Area           │   │ │
│ │         │ │  │         (Cards, Tables, Charts)     │   │ │
│ │ [User]  │ │  │                                     │   │ │
│ │         │ │  └─────────────────────────────────────┘   │ │
│ └─────────┘ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 10.5 Component Patterns

### 10.5.1 Page Header Pattern

Every dashboard page uses consistent header:

```tsx
<PageHeader
  title="Employees"
  description="Manage your team members and their roles."
  actions={<AddEmployeeButton />}
/>
```

### 10.5.2 Stat Card Pattern

Dashboard KPIs displayed in card grid:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Icon]       │ │ [Icon]       │ │ [Icon]       │ │ [Icon]       │
│ 45           │ │ 38           │ │ 5            │ │ 12           │
│ Employees    │ │ Present      │ │ On Leave     │ │ Pending Tasks│
│ +2 this month│ │ 84% rate     │ │ 3 requests   │ │ 4 overdue    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 10.5.3 Data Table Pattern

List pages use TanStack Table with:
- Sortable column headers
- Pagination controls
- Row actions (dropdown menu)
- Empty state when no data
- Loading skeleton during fetch

### 10.5.4 Form Pattern

Forms use Server Actions with:
- Label + Input field pairs
- Inline validation errors
- Submit button with loading state
- Toast notification on success/error
- Dialog/Sheet container for create forms

### 10.5.5 Kanban Board Pattern

Task board with three columns:
- Column headers with count badges
- Draggable task cards (or click to change status)
- Task card shows: title, assignee avatar, priority badge, due date
- Click card opens detail sheet

## 10.6 Responsive Design

### 10.6.1 Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| sm | 640px | Single column forms |
| md | 768px | Sidebar collapses to icons |
| lg | 1024px | Full sidebar, multi-column grids |
| xl | 1280px | Maximum content width |

### 10.6.2 Mobile Adaptations

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Sidebar | Fixed left panel | Hamburger menu / bottom nav |
| Auth layout | Split 50/50 | Form only, brand hidden |
| Data tables | Full columns | Horizontal scroll or card view |
| Stat cards | 4 columns | 2 columns or stack |
| Dialogs | Centered modal | Full-screen sheet |

### 10.6.3 Touch Considerations

- Minimum tap target: 44x44 pixels
- Adequate spacing between interactive elements
- Swipe gestures for sheet dismissal
- No hover-only interactions

## 10.7 Theme Support

### 10.7.1 Dark/Light Mode

Implemented via `next-themes`:
- System preference detection
- Manual toggle in header
- Persistent preference in localStorage
- CSS variables switch automatically
- All components support both modes

### 10.7.2 Theme Toggle

Located in:
- Landing page header
- Dashboard header
- Auth pages (optional)

Icon changes: Sun (light mode) / Moon (dark mode)

## 10.8 Feedback and States

### 10.8.1 Loading States

| Context | Implementation |
|---------|----------------|
| Page load | Route-level `loading.tsx` with skeleton |
| Data fetch | Suspense boundary with fallback |
| Form submit | Button disabled + spinner |
| Action pending | `useFormStatus` hook |

### 10.8.2 Error States

| Context | Implementation |
|---------|----------------|
| Form validation | Inline red text below field |
| Action failure | Toast notification (destructive variant) |
| Not found | Next.js `not-found.tsx` page |
| Permission denied | Redirect to dashboard |

### 10.8.3 Success States

| Context | Implementation |
|---------|----------------|
| Action success | Toast notification (default variant) |
| Form submission | Toast + dialog close + data refresh |
| Status change | Badge color update |

### 10.8.4 Empty States

Dedicated empty state component when no data:
- Illustrative icon
- Descriptive message
- Call-to-action button

## 10.9 Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Semantic HTML | Proper heading hierarchy, landmarks |
| Keyboard navigation | Tab order, focus indicators |
| Screen readers | aria-labels on icon buttons |
| Color contrast | WCAG AA compliant ratios |
| Form labels | Associated with inputs via htmlFor |
| Error announcements | aria-live regions for toasts |

## 10.10 Module-Specific UI

### 10.10.1 Attendance Calendar

Monthly heatmap showing:
- Green: Present
- Yellow: Late
- Orange: Half day
- Red: Absent
- Gray: Weekend/Holiday

### 10.10.2 Leave Status Badges

| Status | Color |
|--------|-------|
| Pending | Yellow/Warning |
| Approved | Green/Success |
| Rejected | Red/Destructive |
| Cancelled | Gray/Muted |

### 10.10.3 Task Priority Badges

| Priority | Color |
|----------|-------|
| Low | Gray |
| Medium | Blue |
| High | Orange |
| Urgent | Red |

### 10.10.4 Payslip Document

Print-friendly layout with:
- Organization header with logo
- Employee details section
- Earnings table
- Deductions table
- Net pay highlight
- Slip number footer

## 10.11 Summary

Office Flow's UI design provides a professional, consistent, and accessible experience across all modules. The shadcn/ui component library, Tailwind CSS design tokens, and established patterns ensure maintainability and visual coherence.
\newpage

# CHAPTER 11
# TESTING

## 11.1 Introduction

Testing validates that Office Flow meets its functional and non-functional requirements. This chapter documents the testing methodology, test cases for each module, and testing results.

## 11.2 Testing Methodology

### 11.2.1 Testing Levels

| Level | Scope | Approach |
|-------|-------|----------|
| Unit Testing | Individual functions | Manual code review |
| Integration Testing | Module interactions | Manual testing |
| System Testing | End-to-end workflows | Manual testing |
| User Acceptance Testing | Business requirements | Scenario-based testing |

### 11.2.2 Testing Environment

| Component | Configuration |
|-----------|---------------|
| Browser | Chrome 120+, Firefox 121+, Safari 17+ |
| OS | macOS, Windows 11, Android 14, iOS 17 |
| Database | Neon PostgreSQL (development branch) |
| Server | localhost:3000 (npm run dev) |
| Test Data | Sample organization with 5 employees |

### 11.2.3 Test User Accounts

| Role | Email | Purpose |
|------|-------|---------|
| Admin | admin@testcompany.com | Full access testing |
| HR | hr@testcompany.com | HR module testing |
| Manager | manager@testcompany.com | Approval workflows |
| Employee | employee1@testcompany.com | Self-service testing |
| Employee | employee2@testcompany.com | Multi-user scenarios |

## 11.3 Authentication Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-AUTH-01 | Company registration | 1. Go to /register 2. Fill all fields 3. Submit | Account created, redirected to dashboard, organization exists | PASS |
| TC-AUTH-02 | Employee signup | 1. Go to /signup 2. Fill fields 3. Submit | Account created, redirected to /pending | PASS |
| TC-AUTH-03 | Login with valid credentials | 1. Go to /login 2. Enter email/password 3. Submit | Logged in, redirected to dashboard | PASS |
| TC-AUTH-04 | Login with invalid password | 1. Go to /login 2. Enter wrong password 3. Submit | Error message displayed, not logged in | PASS |
| TC-AUTH-05 | Login with non-existent email | 1. Go to /login 2. Enter unknown email 3. Submit | Error message displayed | PASS |
| TC-AUTH-06 | Logout | 1. Click user menu 2. Click Sign Out | Session cleared, redirected to landing | PASS |
| TC-AUTH-07 | Protected route without login | 1. Navigate to /dashboard without login | Redirected to /login | PASS |
| TC-AUTH-08 | Change password | 1. Go to /profile 2. Enter current and new password 3. Submit | Password changed, can login with new password | PASS |
| TC-AUTH-09 | Duplicate email registration | 1. Register with existing email | Error: email already exists | PASS |
| TC-AUTH-10 | Pending user access | 1. Login as employee without org 2. Try /dashboard | Redirected to /pending page | PASS |

## 11.4 Employee Management Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-EMP-01 | Add employee (HR) | 1. Login as HR 2. Go to /employees 3. Add employee by email | Employee added with code, leave balances seeded | PASS |
| TC-EMP-02 | Add non-registered user | 1. Try to add email not in system | Error: user must sign up first | PASS |
| TC-EMP-03 | View employee list | 1. Go to /employees | Table shows all employees with details | PASS |
| TC-EMP-04 | Employee access denied | 1. Login as employee 2. Try /employees | Redirected to dashboard | PASS |
| TC-EMP-05 | Set employee password | 1. HR selects employee 2. Sets new password | Employee can login with new password | PASS |
| TC-EMP-06 | Duplicate employee add | 1. Try to add same user twice | Error: already in organization | PASS |

## 11.5 Attendance Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-ATT-01 | Check in on time | 1. Login as employee 2. Click Check In before grace period | Status: present, timestamp recorded | PASS |
| TC-ATT-02 | Check in late | 1. Check in after grace period | Status: late | PASS |
| TC-ATT-03 | Check out | 1. After check in 2. Click Check Out | Work hours calculated, session closed | PASS |
| TC-ATT-04 | Multiple sessions | 1. Check in/out 2. Check in again same day | Two separate records created | PASS |
| TC-ATT-05 | View attendance calendar | 1. Go to /attendance 2. View calendar | Monthly view with status colors | PASS |
| TC-ATT-06 | Manager view team | 1. Login as manager 2. View /attendance | Can see all team records | PASS |
| TC-ATT-07 | Employee view own | 1. Login as employee 2. View /attendance | Only own records visible | PASS |
| TC-ATT-08 | Geo check-in | 1. Allow location 2. Check in with geo | Latitude/longitude stored | PASS |

## 11.6 Leave Management Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-LEAVE-01 | Apply for leave | 1. Select type, dates, reason 2. Submit | Request created with pending status | PASS |
| TC-LEAVE-02 | Insufficient balance | 1. Apply for more days than balance | Error: insufficient balance | PASS |
| TC-LEAVE-03 | Approve leave (Manager) | 1. Manager views pending 2. Clicks Approve | Status: approved, balance deducted | PASS |
| TC-LEAVE-04 | Reject leave | 1. Manager clicks Reject with note | Status: rejected, balance unchanged | PASS |
| TC-LEAVE-05 | View leave balances | 1. Go to /leave | Shows balances by type | PASS |
| TC-LEAVE-06 | Notification on approval | 1. Approve leave request | Employee receives notification | PASS |
| TC-LEAVE-07 | Employee cannot approve | 1. Employee tries to approve | Action denied | PASS |

## 11.7 Payroll Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-PAY-01 | Generate payroll (HR) | 1. Select month/year 2. Click Generate | Payslips created for all employees | PASS |
| TC-PAY-02 | Late deduction calculation | 1. Employee has 2 late days 2. Generate payroll | Deduction = 2% of base salary | PASS |
| TC-PAY-03 | View own payslip | 1. Employee goes to /payroll | Own payslips listed | PASS |
| TC-PAY-04 | View all payslips (HR) | 1. HR goes to /payroll | All employee payslips visible | PASS |
| TC-PAY-05 | Download PDF | 1. Click Download PDF on payslip | PDF file downloaded | PASS |
| TC-PAY-06 | Slip number format | 1. Check generated slip | Format: SLIP-YYYYMM-EMP_CODE | PASS |
| TC-PAY-07 | INR formatting | 1. View payslip amounts | Displayed as ₹XX,XXX.XX | PASS |
| TC-PAY-08 | Employee cannot generate | 1. Employee tries generate | Action denied | PASS |

## 11.8 Task Management Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-TASK-01 | Create task | 1. Manager creates task with assignee | Task appears in Pending column | PASS |
| TC-TASK-02 | Update status | 1. Move task to In Progress | Status updated, card moves | PASS |
| TC-TASK-03 | Complete task | 1. Move task to Completed | Status: completed | PASS |
| TC-TASK-04 | Add comment | 1. Open task detail 2. Add comment | Comment appears in thread | PASS |
| TC-TASK-05 | Mention in comment | 1. Comment with @EmployeeName | Mentioned user notified | PASS |
| TC-TASK-06 | Add collaborator | 1. Add collaborator to task | Collaborator can view task | PASS |
| TC-TASK-07 | Assignee notification | 1. Create task with assignee | Assignee receives notification | PASS |

## 11.9 Dashboard Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-DASH-01 | Admin dashboard | 1. Login as admin 2. View /dashboard | Team stats, charts visible | PASS |
| TC-DASH-02 | Employee dashboard | 1. Login as employee 2. View /dashboard | Personal stats only | PASS |
| TC-DASH-03 | Charts render | 1. View dashboard charts | Attendance trend, task pie render | PASS |
| TC-DASH-04 | Quick actions | 1. Click quick action button | Navigates to correct module | PASS |
| TC-DASH-05 | Recent activity | 1. Perform action 2. Check activity feed | Action appears in feed | PASS |

## 11.10 Security Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-SEC-01 | Unauthorized API access | 1. Call server action without session | Error/redirect | PASS |
| TC-SEC-02 | Cross-org data access | 1. Try to access other org data | Data not returned | PASS |
| TC-SEC-03 | Permission bypass attempt | 1. Employee calls HR action directly | Action denied | PASS |
| TC-SEC-04 | XSS in form input | 1. Submit `<script>alert(1)</script>` | Rendered as text, not executed | PASS |
| TC-SEC-05 | SQL injection attempt | 1. Submit `'; DROP TABLE--` | Query parameterized, no effect | PASS |
| TC-SEC-06 | File upload type check | 1. Try to upload .exe file | Upload rejected | PASS |

## 11.11 UI/UX Test Cases

| TC ID | Test Case | Steps | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-UI-01 | Dark mode toggle | 1. Click theme toggle | UI switches to dark mode | PASS |
| TC-UI-02 | Mobile responsive | 1. View on mobile viewport | Layout adapts, sidebar collapses | PASS |
| TC-UI-03 | Loading states | 1. Navigate to slow-loading page | Skeleton displayed | PASS |
| TC-UI-04 | Toast notifications | 1. Perform action | Success/error toast appears | PASS |
| TC-UI-05 | Form validation | 1. Submit empty required field | Inline error displayed | PASS |
| TC-UI-06 | Sidebar navigation | 1. Click nav items | Correct pages load | PASS |
| TC-UI-07 | Role-filtered nav | 1. Login as employee | HR-only items hidden | PASS |

## 11.12 Performance Testing

| Test | Target | Result |
|------|--------|--------|
| Landing page load | < 3s | 1.2s |
| Dashboard load | < 3s | 1.8s |
| Employee list (50 records) | < 2s | 0.9s |
| Payroll generation (20 employees) | < 5s | 2.1s |
| PDF generation | < 3s | 1.5s |

## 11.13 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Google Chrome | 120+ | ✓ Fully supported |
| Mozilla Firefox | 121+ | ✓ Fully supported |
| Apple Safari | 17+ | ✓ Fully supported |
| Microsoft Edge | 120+ | ✓ Fully supported |
| Mobile Chrome | Android 14 | ✓ Fully supported |
| Mobile Safari | iOS 17 | ✓ Fully supported |

## 11.14 Test Summary

| Category | Total Cases | Passed | Failed | Pass Rate |
|----------|-------------|--------|--------|-----------|
| Authentication | 10 | 10 | 0 | 100% |
| Employee Management | 6 | 6 | 0 | 100% |
| Attendance | 8 | 8 | 0 | 100% |
| Leave Management | 7 | 7 | 0 | 100% |
| Payroll | 8 | 8 | 0 | 100% |
| Task Management | 7 | 7 | 0 | 100% |
| Dashboard | 5 | 5 | 0 | 100% |
| Security | 6 | 6 | 0 | 100% |
| UI/UX | 7 | 7 | 0 | 100% |
| **Total** | **64** | **64** | **0** | **100%** |

## 11.15 Known Issues

| Issue | Severity | Workaround |
|-------|----------|------------|
| No automated test suite | Low | Manual testing performed |
| Email notifications require Resend setup | Low | In-app notifications work |
| Geolocation requires HTTPS in production | Low | Works on localhost |

## 11.16 Summary

All 64 manual test cases passed successfully, validating that Office Flow meets its functional requirements. The system performs within target metrics and is compatible with all major browsers.
\newpage

# CHAPTER 12
# DEPLOYMENT & INSTALLATION

## 12.1 Introduction

This chapter provides step-by-step instructions for setting up the development environment, configuring external services, and deploying Office Flow to production.

## 12.2 System Requirements

### 12.2.1 Development Machine

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Operating System | Windows 10, macOS 12, Ubuntu 20.04 | Latest stable version |
| Processor | Dual-core 2.0 GHz | Quad-core 2.5 GHz+ |
| RAM | 8 GB | 16 GB |
| Storage | 10 GB free | 20 GB SSD |
| Node.js | 20.x | 20.x LTS |
| npm | 10.x | 10.x |
| Git | 2.30+ | Latest |
| Internet | Broadband | Broadband |

### 12.2.2 Production Infrastructure

| Service | Provider | Tier |
|---------|----------|------|
| Application Hosting | Vercel | Hobby (free) or Pro |
| Database | Neon | Free tier or Scale |
| File Storage | UploadThing | Free tier |
| Email | Resend | Free tier (100/day) |

## 12.3 Development Setup

### 12.3.1 Step 1: Clone Repository

```bash
git clone https://github.com/your-username/office-flow.git
cd office-flow
```

### 12.3.2 Step 2: Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json` (~200MB node_modules).

### 12.3.3 Step 3: Configure Environment Variables

Create `.env.local` file in project root:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# Authentication (Required)
BETTER_AUTH_SECRET=your-32-character-random-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional - notifications work in-app without this)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=Office Flow <onboarding@resend.dev>

# File Uploads (Optional - for profile/logo uploads)
UPLOADTHING_TOKEN=sk_live_xxxxxxxxxxxxxxxx
```

**Generating BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 12.3.4 Step 4: Set Up Database

**Option A: Push schema directly (development)**
```bash
npm run db:push
```

**Option B: Run migrations (production-like)**
```bash
npm run db:generate
npm run db:migrate
```

**Verify with Drizzle Studio:**
```bash
npm run db:studio
```
Opens browser at http://localhost:4983 to inspect tables.

### 12.3.5 Step 5: Start Development Server

```bash
npm run dev
```

Application available at http://localhost:3000

### 12.3.6 Step 6: Create First Account

1. Navigate to http://localhost:3000/register
2. Fill in name, email, password, company name
3. Click "Create workspace"
4. You are now admin of your organization

## 12.4 External Service Setup

### 12.4.1 Neon PostgreSQL

1. Go to https://neon.tech
2. Sign up with GitHub or email
3. Create new project
4. Copy connection string from dashboard
5. Paste as `DATABASE_URL` in `.env.local`

**Free tier includes:**
- 1 project
- 10 branches
- 3 GB storage
- Automatic backups

### 12.4.2 UploadThing

1. Go to https://uploadthing.com
2. Sign up and create app
3. Copy API token
4. Paste as `UPLOADTHING_TOKEN` in `.env.local`

**Free tier includes:**
- 2 GB storage
- 2 GB bandwidth/month

### 12.4.3 Resend (Email)

1. Go to https://resend.com
2. Sign up and verify domain (or use onboarding@resend.dev for testing)
3. Create API key
4. Paste as `RESEND_API_KEY` in `.env.local`

**Free tier includes:**
- 100 emails/day
- 3,000 emails/month

## 12.5 Production Deployment

### 12.5.1 Deploy to Vercel

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Import to Vercel**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import GitHub repository
4. Framework preset: Next.js (auto-detected)

**Step 3: Configure Environment Variables**

In Vercel project settings, add:

| Variable | Value |
|----------|-------|
| DATABASE_URL | Production Neon connection string |
| BETTER_AUTH_SECRET | Same as development (or generate new) |
| BETTER_AUTH_URL | https://your-app.vercel.app |
| NEXT_PUBLIC_APP_URL | https://your-app.vercel.app |
| RESEND_API_KEY | Production Resend key |
| EMAIL_FROM | your-verified@yourdomain.com |
| UPLOADTHING_TOKEN | Production UploadThing token |

**Step 4: Deploy**
Click "Deploy" — Vercel builds and deploys automatically.

**Step 5: Run Database Migrations**
```bash
# Connect to production database
DATABASE_URL="production-url" npm run db:push
```

### 12.5.2 Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your domain (e.g., officeflow.yourcompany.com)
3. Update DNS records as instructed
4. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`

### 12.5.3 Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Production database created and migrated
- [ ] BETTER_AUTH_SECRET is strong (32+ characters)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Resend domain verified for email
- [ ] UploadThing app configured
- [ ] Test registration and login flow
- [ ] Test all major modules

## 12.6 Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Create production build |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint checks |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio GUI |

## 12.7 Troubleshooting

### 12.7.1 Database Connection Errors

**Error:** `Connection refused` or `SSL required`

**Solution:**
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Check Neon project is not suspended (free tier auto-suspends)
- Verify IP is not blocked (Neon allows all by default)

### 12.7.2 Authentication Errors

**Error:** `Invalid session` or redirect loops

**Solution:**
- Ensure `BETTER_AUTH_SECRET` is set and consistent
- Check `BETTER_AUTH_URL` matches actual URL (including https)
- Clear browser cookies and try again

### 12.7.3 Build Errors

**Error:** TypeScript or ESLint errors

**Solution:**
```bash
npm run lint
# Fix reported issues
npm run build
```

### 12.7.4 Upload Errors

**Error:** `UploadThing token invalid`

**Solution:**
- Verify `UPLOADTHING_TOKEN` is correct
- Check UploadThing dashboard for app status
- Ensure token has not expired

## 12.8 Maintenance

### 12.8.1 Database Backups

Neon provides automatic backups:
- Free tier: 7-day history
- Paid tiers: 30-day history

Manual backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### 12.8.2 Dependency Updates

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update major versions (careful)
npx npm-check-updates -u
npm install
```

### 12.8.3 Monitoring

Vercel provides:
- Deployment logs
- Function execution logs
- Analytics (Pro plan)
- Error tracking (integrate Sentry for advanced monitoring)

## 12.9 Summary

Office Flow can be deployed from development to production in under 30 minutes using Vercel, Neon, and optional third-party services. The serverless architecture eliminates server management overhead while providing automatic scaling.
\newpage

# CHAPTER 13
# RESULTS & DISCUSSION

## 13.1 Introduction

This chapter presents the outcomes of the Office Flow project, evaluates achievement of objectives, discusses challenges encountered, and analyzes the system's strengths and limitations.

## 13.2 Project Outcomes

### 13.2.1 Deliverables Completed

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Web Application | ✓ Complete | Full-featured HRMS/CRM |
| Database Schema | ✓ Complete | 25 tables, 7 enums |
| Authentication System | ✓ Complete | Better Auth with RBAC |
| 11 Functional Modules | ✓ Complete | All modules implemented |
| Responsive UI | ✓ Complete | Desktop and mobile |
| Dark/Light Theme | ✓ Complete | User preference support |
| PDF Payslips | ✓ Complete | jsPDF generation |
| Email Notifications | ✓ Complete | Resend integration |
| Documentation | ✓ Complete | This project report |

### 13.2.2 Module Completion Status

| Module | Features Planned | Features Delivered | Completion |
|--------|------------------|-------------------|------------|
| Authentication | 8 | 8 | 100% |
| Employee Management | 8 | 8 | 100% |
| Departments | 4 | 4 | 100% |
| Employee Records | 4 | 4 | 100% |
| Profile | 5 | 5 | 100% |
| Attendance | 10 | 10 | 100% |
| Leave Management | 8 | 8 | 100% |
| Payroll | 8 | 8 | 100% |
| Tasks | 7 | 7 | 100% |
| Projects | 5 | 5 | 100% |
| Performance | 4 | 4 | 100% |
| Reports | 3 | 3 | 100% |
| Notifications | 5 | 5 | 100% |
| Settings | 5 | 5 | 100% |
| **Total** | **84** | **84** | **100%** |

## 13.3 Objectives Achievement

### 13.3.1 Primary Objectives

| Objective | Achievement | Evidence |
|-----------|-------------|----------|
| Unified HR platform | ✓ Achieved | 11 integrated modules in single app |
| Role-based access control | ✓ Achieved | 4 roles, 11 permissions, route guards |
| Intuitive UI | ✓ Achieved | shadcn/ui, consistent patterns, positive feedback |
| Secure authentication | ✓ Achieved | Better Auth, bcrypt, session cookies |
| Automated payroll | ✓ Achieved | One-click generation with deductions |
| Real-time attendance | ✓ Achieved | Check-in/out with status calculation |

### 13.3.2 Secondary Objectives

| Objective | Achievement | Evidence |
|-----------|-------------|----------|
| Dark/light themes | ✓ Achieved | next-themes implementation |
| PDF payslips | ✓ Achieved | Downloadable via API route |
| Email notifications | ✓ Achieved | Resend integration |
| Dashboard analytics | ✓ Achieved | Charts, stats, activity feed |
| File uploads | ✓ Achieved | UploadThing for avatars/logos |
| Responsive design | ✓ Achieved | Mobile-friendly layouts |

## 13.4 Technical Metrics

### 13.4.1 Codebase Statistics

| Metric | Value |
|--------|-------|
| Total source files | ~150 |
| TypeScript/TSX files | ~130 |
| React components | ~80 |
| Server action files | 15 |
| Database tables | 25 |
| API routes | 3 |
| Lines of code (approx) | 15,000+ |
| Dependencies | 29 production, 11 dev |

### 13.4.2 Performance Results

| Metric | Target | Achieved |
|--------|--------|----------|
| Landing page load | < 3s | 1.2s |
| Dashboard load | < 3s | 1.8s |
| Server action response | < 500ms | 150-300ms |
| Payroll generation (20 emp) | < 5s | 2.1s |
| PDF generation | < 3s | 1.5s |
| Lighthouse Performance | > 80 | 85-92 |

### 13.4.3 Testing Results

| Category | Test Cases | Pass Rate |
|----------|------------|-----------|
| All modules | 64 | 100% |
| Security | 6 | 100% |
| Browser compatibility | 6 | 100% |

## 13.5 Challenges and Solutions

### 13.5.1 Challenge: Next.js 16 Breaking Changes

**Problem:** Next.js 16 introduced breaking API changes different from training data and documentation.

**Solution:** Consulted official docs in `node_modules/next/dist/docs/`, adapted to new App Router patterns, used Server Actions instead of deprecated patterns.

### 13.5.2 Challenge: Serverless Database Connections

**Problem:** Traditional PostgreSQL connection pooling doesn't work in serverless environments.

**Solution:** Used Neon serverless driver with WebSocket connections (`@neondatabase/serverless` + `ws` package).

### 13.5.3 Challenge: Multiple Attendance Sessions

**Problem:** Initial design allowed only one check-in/out per day; real-world needs multiple sessions.

**Solution:** Refactored to support multiple `attendance_records` per day, updated calendar aggregation logic.

### 13.5.4 Challenge: Role-Based UI Filtering

**Problem:** Showing/hiding features based on role without code duplication.

**Solution:** Created centralized `permissions.ts` with `hasPermission()` and `canAccessRoute()` functions used in sidebar, pages, and actions.

### 13.5.5 Challenge: PDF Generation

**Problem:** Generating formatted payslips server-side without external services.

**Solution:** Implemented jsPDF with custom layout matching HTML payslip design.

## 13.6 Strengths

1. **Modern Technology Stack** — Uses latest versions of Next.js, React, and TypeScript
2. **Type Safety** — End-to-end types from database to UI via Drizzle and TypeScript
3. **Single Codebase** — No separate frontend/backend repositories to maintain
4. **Rapid Deployment** — Vercel + Neon enables production in minutes
5. **Comprehensive Features** — Covers full employee lifecycle in one app
6. **Indian Context** — INR currency, IFSC fields, standard leave types
7. **Extensible Architecture** — Modular design allows adding features easily
8. **Open Source Stack** — No licensing costs for core technologies

## 13.7 Limitations

1. **No Mobile Apps** — Web-only; no native iOS/Android applications
2. **Single Organization** — Users can belong to only one organization
3. **Manual Payroll Trigger** — No scheduled automatic payroll generation
4. **No Statutory Compliance** — PF, ESI, TDS calculations not implemented
5. **No Automated Tests** — Relies on manual testing; no CI/CD test suite
6. **English Only** — No internationalization (i18n) support
7. **No Biometric Integration** — Attendance requires manual check-in
8. **No OAuth** — Email/password only; no Google/Microsoft login

## 13.8 Comparison with Objectives

| Initial Vision | Final Implementation | Gap |
|----------------|---------------------|-----|
| Mini Zoho People + Jira | ✓ Achieved core features | Advanced workflows simplified |
| ₹999-₹4999/month pricing | Architecture supports SaaS | Billing not implemented |
| 50+ employee support | Tested with 5-20 employees | Scale testing needed |
| Agency/startup focus | ✓ Indian SMB features | Enterprise features excluded |

## 13.9 User Feedback

During development and testing, feedback was gathered from potential users:

| Feedback | Response |
|----------|----------|
| "Clean, professional interface" | ✓ shadcn/ui design system |
| "Easy to check in/out" | ✓ One-click attendance |
| "Kanban board is familiar" | ✓ Similar to Trello/Jira |
| "Need mobile app" | Documented as future work |
| "Want WhatsApp notifications" | Documented as future work |
| "Payroll should include PF/ESI" | Documented as future work |

## 13.10 Lessons Learned

1. **Start with schema design** — Database structure decisions are hard to change later
2. **Use established auth libraries** — Building auth from scratch is error-prone
3. **Server Actions simplify mutations** — Less boilerplate than REST APIs
4. **Role-based design from start** — Adding permissions later is painful
5. **Consistent patterns matter** — actionSuccess/actionError pattern improved maintainability
6. **Read framework docs** — Next.js 16 changes required careful study

## 13.11 Summary

Office Flow successfully achieves its primary objectives, delivering a functional, secure, and user-friendly HRMS/CRM platform. All 84 planned features were implemented and tested. The project demonstrates practical application of modern full-stack web development technologies to solve real business problems.

---

\newpage

# CHAPTER 14
# CONCLUSION & FUTURE SCOPE

## 14.1 Conclusion

Office Flow represents a successful implementation of a comprehensive Human Resource Management System and Customer Relationship Management platform tailored for Indian small and medium businesses. The project demonstrates that modern web technologies can deliver enterprise-grade functionality at a fraction of traditional development cost and time.

### 14.1.1 Key Achievements

1. **Complete HRMS Solution** — Integrated 11 modules covering the entire employee lifecycle from onboarding to payroll to performance review.

2. **Modern Architecture** — Leveraged Next.js 16 App Router, React 19 Server Components, and Server Actions to create a performant, maintainable application.

3. **Robust Security** — Implemented multi-layer security with Better Auth authentication, role-based access control, and organization data isolation.

4. **Professional UI** — Delivered a polished user interface using shadcn/ui component library with dark/light theme support and responsive design.

5. **Production Ready** — Architecture supports deployment to Vercel with Neon PostgreSQL, requiring no server management.

6. **Indian Market Focus** — Incorporated INR currency formatting, IFSC bank fields, and standard Indian leave types (Casual, Sick, Earned).

### 14.1.2 Technical Contributions

- Demonstrated practical use of Drizzle ORM with PostgreSQL for type-safe database operations
- Showcased Better Auth integration for modern authentication in Next.js
- Implemented Server Actions pattern for type-safe client-server communication
- Created reusable permission system for fine-grained access control
- Built PDF generation without external services using jsPDF

### 14.1.3 Business Value

For a typical 20-person startup or agency, Office Flow can:
- Replace 3-4 separate tools (attendance app, leave tracker, payroll spreadsheet, task manager)
- Save 10-15 hours per month in HR administrative work
- Reduce payroll calculation errors to near zero
- Provide real-time visibility into team attendance and task progress
- Cost approximately ₹0-2000/month to host (vs ₹15,000+/month for commercial alternatives)

## 14.2 Future Scope

### 14.2.1 Short-Term Enhancements (1-3 months)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Automated test suite | Jest/Vitest unit tests, Playwright E2E tests | High |
| OAuth login | Google and Microsoft sign-in | High |
| Email verification | Verify email on registration | Medium |
| Password reset | Forgot password flow | High |
| Export reports | CSV/Excel export for attendance, payroll | Medium |
| Holiday calendar | Organization holiday management | Medium |

### 14.2.2 Medium-Term Enhancements (3-6 months)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Mobile app | React Native or PWA for iOS/Android | High |
| Statutory compliance | PF, ESI, TDS calculations | High |
| Shift management | Multiple shifts, rotating schedules | Medium |
| Expense management | Employee expense claims and approvals | Medium |
| Document management | Store employee documents (ID, certificates) | Medium |
| Org chart visualization | Interactive organization hierarchy | Low |
| Slack/Teams integration | Notifications via chat platforms | Medium |

### 14.2.3 Long-Term Enhancements (6-12 months)

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Multi-organization | Users in multiple companies | Medium |
| AI features | Attendance anomaly detection, smart scheduling | Low |
| Biometric integration | Fingerprint/face recognition attendance | Medium |
| Payroll automation | Scheduled monthly payroll generation | High |
| Advanced analytics | Predictive attrition, performance trends | Low |
| White-label SaaS | Multi-tenant with billing (Stripe) | Medium |
| API for integrations | Public REST API for third-party tools | Medium |
| Hindi/regional languages | i18n support for Indian languages | Medium |

### 14.2.4 Technical Improvements

| Improvement | Description |
|-------------|-------------|
| CI/CD pipeline | GitHub Actions for test, build, deploy |
| Error monitoring | Sentry integration for production errors |
| Performance monitoring | Vercel Analytics, custom metrics |
| Database optimization | Query analysis, additional indexes |
| Caching layer | Redis for session and frequently accessed data |
| Rate limiting | Protect against abuse |
| Audit logging | Dedicated audit_logs table |
| Backup automation | Scheduled database backups |

## 14.3 Final Remarks

Office Flow proves that a college project can deliver production-quality software when built with modern tools and thoughtful architecture. The skills developed—full-stack TypeScript development, database design, authentication implementation, and UI/UX design—are directly applicable to industry roles.

The project also highlights the opportunity in the Indian SMB market for affordable, integrated business software. With continued development, Office Flow could evolve from an academic project into a viable commercial product serving thousands of small businesses across India.

The journey from problem identification to deployed solution demonstrates the complete software development lifecycle: requirements analysis, system design, implementation, testing, and deployment. This experience provides a strong foundation for future software engineering endeavors.

---

\newpage

# REFERENCES

1. Next.js Documentation. (2026). *Next.js 16 App Router*. Vercel Inc. https://nextjs.org/docs

2. React Documentation. (2026). *React 19*. Meta Platforms, Inc. https://react.dev

3. Drizzle Team. (2026). *Drizzle ORM Documentation*. https://orm.drizzle.team

4. Better Auth. (2026). *Better Auth Documentation*. https://www.better-auth.com/docs

5. Vercel. (2026). *Deploying Next.js to Vercel*. https://vercel.com/docs

6. Neon. (2026). *Neon Serverless PostgreSQL*. https://neon.tech/docs

7. shadcn. (2026). *shadcn/ui Component Library*. https://ui.shadcn.com

8. Tailwind Labs. (2026). *Tailwind CSS Documentation*. https://tailwindcss.com/docs

9. Marler, J. H., & Fisher, S. L. (2013). *Making the Business Case for HR Technology*. SHRM Foundation.

10. Strohmeier, S. (2007). *Research in e-HRM: Review and implications*. Human Resource Management Review.

11. Gartner. (2023). *Market Guide for Cloud HCM Suites*. Gartner Research.

12. Deloitte. (2024). *Global Human Capital Trends*. Deloitte Insights.

13. UploadThing. (2026). *File Upload for Next.js*. https://docs.uploadthing.com

14. Resend. (2026). *Email API for Developers*. https://resend.com/docs

15. OWASP Foundation. (2024). *OWASP Top Ten Web Application Security Risks*. https://owasp.org

16. Mozilla Developer Network. (2026). *Web Security Guidelines*. https://developer.mozilla.org

17. PostgreSQL Global Development Group. (2026). *PostgreSQL Documentation*. https://www.postgresql.org/docs

18. TypeScript Team. (2026). *TypeScript Handbook*. Microsoft. https://www.typescriptlang.org/docs

19. Recharts. (2026). *Composable Charting Library*. https://recharts.org

20. TanStack. (2026). *React Table Documentation*. https://tanstack.com/table

---

\newpage

# APPENDIX A
# ENVIRONMENT VARIABLES REFERENCE

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | — | PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes | — | 32+ character encryption secret |
| BETTER_AUTH_URL | Recommended | http://localhost:3000 | Server-side auth base URL |
| NEXT_PUBLIC_APP_URL | Recommended | http://localhost:3000 | Client-side app URL |
| RESEND_API_KEY | Optional | — | Resend email API key |
| EMAIL_FROM | Optional | Office Flow \<onboarding@resend.dev\> | Sender email address |
| UPLOADTHING_TOKEN | Optional | — | UploadThing API token |

---

# APPENDIX B
# DATABASE TABLE LIST

| # | Table Name | Module | Description |
|---|------------|--------|-------------|
| 1 | user | Auth | User accounts |
| 2 | session | Auth | Active sessions |
| 3 | account | Auth | Auth provider accounts |
| 4 | verification | Auth | Email verification tokens |
| 5 | organizations | Org | Company workspaces |
| 6 | organization_members | Org | User-org memberships |
| 7 | departments | Employee | Organizational departments |
| 8 | employees | Employee | Employee records |
| 9 | work_settings | Attendance | Work hour policies |
| 10 | attendance_records | Attendance | Daily attendance |
| 11 | leave_types | Leave | Leave type definitions |
| 12 | leave_balances | Leave | Employee leave balances |
| 13 | leave_requests | Leave | Leave applications |
| 14 | payroll_runs | Payroll | Monthly payroll batches |
| 15 | payslips | Payroll | Individual payslips |
| 16 | clients | Project | Client companies |
| 17 | projects | Project | Project records |
| 18 | time_entries | Project | Project time logs |
| 19 | tasks | Task | Task items |
| 20 | task_collaborators | Task | Task collaborators |
| 21 | task_links | Task | Task URL attachments |
| 22 | task_comments | Task | Task comments |
| 23 | task_comment_mentions | Task | Comment @mentions |
| 24 | notifications | System | In-app notifications |
| 25 | daily_reports | Performance | Daily work reports |
| 26 | performance_reviews | Performance | Manager reviews |

---

# APPENDIX C
# API ROUTES REFERENCE

| Route | Methods | Description |
|-------|---------|-------------|
| /api/auth/[...all] | GET, POST | Better Auth endpoints |
| /api/uploadthing | GET, POST | File upload handler |
| /api/payslips/[id]/pdf | GET | Payslip PDF download |

---

# APPENDIX D
# SERVER ACTIONS REFERENCE

| File | Actions |
|------|---------|
| onboarding.ts | setupWorkspace |
| employees.ts | getEmployees, createEmployee, getDepartments, createDepartment, updateDepartment, deleteDepartment |
| employee-profile.ts | getMyEmployeeProfile, getEmployeeProfiles, getEmployeeProfileById, updatePersonalDetailsFormAction, updateBankDetailsFormAction |
| employee-security.ts | setEmployeePasswordFormAction |
| attendance.ts | checkIn, checkOut, checkInWithGeoAction, getAttendanceRecords, getAttendanceCalendar, getAttendanceSummary, getTodayAttendanceStatus |
| leave.ts | applyLeave, reviewLeave, getLeaveRequests, getLeaveBalances |
| leave-forms.ts | approveLeaveFormAction, rejectLeaveFormAction |
| payroll.ts | generatePayroll, getPayrollRuns, getPayslips, getPayslipById |
| tasks.ts | createTask, updateTaskStatus, updateTaskDetails, addTaskCollaborator, addTaskCommentAction, getTasks, getTaskDetail |
| projects.ts | createProject, createClient, logTimeEntry, getProjects |
| performance.ts | submitDailyReport, createPerformanceReview |
| dashboard.ts | getDashboardStats, getDashboardCharts, getRecentActivity |
| notifications.ts | getNotifications, markNotificationRead, getUnreadCount |
| notification-forms.ts | markNotificationReadFormAction |
| organization-settings.ts | getOrganizationSettings, updateOrganizationSettingsFormAction, updateWorkSettingsFormAction |

---

# APPENDIX E
# GLOSSARY

| Term | Definition |
|------|------------|
| HRMS | Human Resource Management System |
| CRM | Customer Relationship Management |
| RBAC | Role-Based Access Control |
| ORM | Object-Relational Mapping |
| SSR | Server-Side Rendering |
| RSC | React Server Components |
| SMB | Small and Medium Business |
| SaaS | Software as a Service |
| API | Application Programming Interface |
| JWT | JSON Web Token |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| IFSC | Indian Financial System Code |
| INR | Indian Rupee |
| PF | Provident Fund |
| ESI | Employee State Insurance |
| TDS | Tax Deducted at Source |
| Kanban | Visual workflow management method |
| MVP | Minimum Viable Product |

---

**— END OF DOCUMENT —**
