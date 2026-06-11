import {
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { attendanceStatusEnum } from "./enums";
import { employees } from "./employees";
import { organizations } from "./organizations";

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    checkIn: timestamp("check_in", { withTimezone: true }),
    checkOut: timestamp("check_out", { withTimezone: true }),
    workHours: numeric("work_hours", { precision: 5, scale: 2 }),
    status: attendanceStatusEnum("status").notNull().default("present"),
    checkInLatitude: numeric("check_in_latitude", { precision: 10, scale: 7 }),
    checkInLongitude: numeric("check_in_longitude", { precision: 10, scale: 7 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
);

export const workSettings = pgTable("work_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" })
    .unique(),
  workStartHour: integer("work_start_hour").notNull().default(9),
  workStartMinute: integer("work_start_minute").notNull().default(0),
  workEndHour: integer("work_end_hour").notNull().default(18),
  workEndMinute: integer("work_end_minute").notNull().default(0),
  lateGraceMinutes: integer("late_grace_minutes").notNull().default(15),
  halfDayHours: numeric("half_day_hours", { precision: 4, scale: 2 })
    .notNull()
    .default("4"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
