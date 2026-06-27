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
