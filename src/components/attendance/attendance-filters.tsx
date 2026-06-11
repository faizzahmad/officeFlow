"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export function AttendanceFilters({
  employees,
  canViewTeam,
  month,
  year,
  employeeId,
  startDate,
  endDate,
}: {
  employees: EmployeeOption[];
  canViewTeam: boolean;
  month: number;
  year: number;
  employeeId: string;
  startDate?: string;
  endDate?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const employeeItems = [
    { value: "all", label: "All employees" },
    ...employees.map((employee) => ({
      value: employee.id,
      label: `${employee.name} (${employee.code})`,
    })),
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 2 + i;
    return { value: String(y), label: String(y) };
  });

  function pushParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    startTransition(() => {
      router.push(`/attendance?${next.toString()}`);
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {canViewTeam ? (
            <div className="space-y-2 sm:col-span-2">
              <Label>Employee</Label>
              <Select
                items={employeeItems}
                value={employeeId}
                onValueChange={(value) => {
                  if (typeof value === "string") {
                    pushParams({ employee: value });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All employees" />
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
          ) : null}

          <div className="space-y-2">
            <Label>Month</Label>
            <Select
              items={PAYROLL_MONTH_OPTIONS}
              value={String(month)}
              onValueChange={(value) => {
                if (typeof value === "string") {
                  pushParams({ month: value, from: null, to: null });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
              items={years}
              value={String(year)}
              onValueChange={(value) => {
                if (typeof value === "string") {
                  pushParams({ year: value, from: null, to: null });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From date</Label>
            <Input
              id="from"
              type="date"
              defaultValue={startDate ?? ""}
              onChange={(e) => {
                const from = e.target.value;
                const to = searchParams.get("to") ?? endDate ?? "";
                pushParams({
                  from: from || null,
                  to: to || null,
                  month: null,
                  year: null,
                });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To date</Label>
            <Input
              id="to"
              type="date"
              defaultValue={endDate ?? ""}
              onChange={(e) => {
                const to = e.target.value;
                const from = searchParams.get("from") ?? startDate ?? "";
                pushParams({
                  from: from || null,
                  to: to || null,
                  month: null,
                  year: null,
                });
              }}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending}
              onClick={() => {
                const now = new Date();
                pushParams({
                  employee: canViewTeam ? "all" : null,
                  month: String(now.getMonth() + 1),
                  year: String(now.getFullYear()),
                  from: null,
                  to: null,
                });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
