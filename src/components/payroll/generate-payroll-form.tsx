"use client";

import { useMemo, useState } from "react";

import { generatePayroll } from "@/actions/payroll";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYROLL_MONTH_OPTIONS } from "@/lib/select-options";

type EmployeeOption = {
  id: string;
  name: string;
  code: string;
};

export function GeneratePayrollForm({
  employees,
  defaultMonth,
  defaultYear,
}: {
  employees: EmployeeOption[];
  defaultMonth: number;
  defaultYear: number;
}) {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState(String(defaultMonth));
  const [year, setYear] = useState(String(defaultYear));

  const employeeItems = useMemo(
    () => [
      { value: "all", label: "All employees" },
      ...employees.map((employee) => ({
        value: employee.id,
        label: `${employee.name} (${employee.code})`,
      })),
    ],
    [employees],
  );

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(current - 2 + i));
  }, []);

  const yearItems = useMemo(
    () => years.map((item) => ({ value: item, label: item })),
    [years],
  );

  return (
    <ActionForm
      action={generatePayroll}
      successMessage="Payroll generated"
      resetOnSuccess={false}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="month" value={month} />
      <input type="hidden" name="year" value={year} />

      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label>Employee</Label>
        <Select
          items={employeeItems}
          value={employeeId}
          onValueChange={(value) => {
            setEmployeeId(typeof value === "string" ? value : "");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All employees</SelectItem>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Month</Label>
        <Select
          items={PAYROLL_MONTH_OPTIONS}
          value={month}
          onValueChange={(value) => {
            setMonth(typeof value === "string" ? value : String(defaultMonth));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {PAYROLL_MONTH_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Year</Label>
        <Select
          items={yearItems}
          value={year}
          onValueChange={(value) => {
            setYear(typeof value === "string" ? value : String(defaultYear));
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end sm:col-span-2 lg:col-span-1">
        <SubmitButton className="w-full" loadingText="Generating...">
          Generate salary slips
        </SubmitButton>
      </div>
    </ActionForm>
  );
}
