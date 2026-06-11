import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { employees } from "./employees";
import { payrollStatusEnum } from "./enums";
import { organizations } from "./organizations";

export const payrollRuns = pgTable(
  "payroll_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    status: payrollStatusEnum("status").notNull().default("draft"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.organizationId, table.month, table.year)],
);

export const payslips = pgTable(
  "payslips",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    payrollRunId: uuid("payroll_run_id")
      .notNull()
      .references(() => payrollRuns.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    baseSalary: numeric("base_salary", { precision: 12, scale: 2 }).notNull(),
    bonus: numeric("bonus", { precision: 12, scale: 2 }).notNull().default("0"),
    incentives: numeric("incentives", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    leaveDeduction: numeric("leave_deduction", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    lateDeduction: numeric("late_deduction", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    otherDeductions: numeric("other_deductions", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    netSalary: numeric("net_salary", { precision: 12, scale: 2 }).notNull(),
    slipNumber: text("slip_number").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique().on(table.payrollRunId, table.employeeId)],
);
