import type { employees } from "@/db/schema";

export type EmployeeRecord = typeof employees.$inferSelect;

export type EmployeeProfileRow = {
  employee: EmployeeRecord;
  userName: string;
  userEmail: string;
  userImage: string | null;
  departmentName: string | null;
  memberRole: string;
};

export function formatEmployeeDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function maskAccountNumber(value: string | null | undefined): string {
  if (!value) return "—";
  if (value.length <= 4) return value;
  return `•••• ${value.slice(-4)}`;
}

export function profileCompletionPercent(employee: EmployeeRecord): number {
  const fields = [
    employee.phone,
    employee.address,
    employee.city,
    employee.dateOfBirth,
    employee.emergencyContactName,
    employee.emergencyContactPhone,
    employee.bankName,
    employee.bankAccountNumber,
    employee.bankIfsc,
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}
