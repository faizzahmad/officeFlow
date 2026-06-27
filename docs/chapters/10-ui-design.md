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
