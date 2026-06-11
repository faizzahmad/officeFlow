import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { employees } from "./employees";
import { organizations } from "./organizations";

export const dailyReports = pgTable("daily_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  summary: text("summary").notNull(),
  blockers: text("blockers"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const performanceReviews = pgTable("performance_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  reviewerId: uuid("reviewer_id").references(() => employees.id, {
    onDelete: "set null",
  }),
  period: text("period").notNull(),
  score: integer("score").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
