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
