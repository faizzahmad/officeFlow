export type SelectItemOption<T extends string = string> = {
  value: T;
  label: string;
};

export const TASK_STATUS_OPTIONS: SelectItemOption[] = [
  { value: "pending", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

export const TASK_PRIORITY_OPTIONS: SelectItemOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const MEMBER_ROLE_OPTIONS: SelectItemOption[] = [
  { value: "employee", label: "Employee" },
  { value: "manager", label: "Manager" },
  { value: "hr", label: "HR" },
];

export const PAYROLL_MONTH_OPTIONS: SelectItemOption[] = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function buildSelectItems(
  options: SelectItemOption[],
): SelectItemOption[] {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}
