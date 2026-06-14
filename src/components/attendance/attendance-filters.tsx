"use client";

import { CalendarRange, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const filterMode =
    startDate && endDate ? "range" : "month";

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

  function resetFilters() {
    const now = new Date();
    pushParams({
      employee: canViewTeam ? "all" : null,
      month: String(now.getMonth() + 1),
      year: String(now.getFullYear()),
      from: null,
      to: null,
    });
  }

  return (
    <Card className={pending ? "opacity-70" : undefined}>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {canViewTeam ? (
            <div className="w-full space-y-2 lg:max-w-xs">
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

          <Tabs
            value={filterMode}
            onValueChange={(value) => {
              if (value === "month") {
                const now = new Date();
                pushParams({
                  month: String(month || now.getMonth() + 1),
                  year: String(year || now.getFullYear()),
                  from: null,
                  to: null,
                });
              } else if (value === "range") {
                const now = new Date();
                const monthStr = String(now.getMonth() + 1).padStart(2, "0");
                const dayStr = String(now.getDate()).padStart(2, "0");
                const today = `${now.getFullYear()}-${monthStr}-${dayStr}`;
                pushParams({
                  from: startDate ?? today,
                  to: endDate ?? today,
                  month: null,
                  year: null,
                });
              }
            }}
            className="w-full lg:max-w-2xl"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="month">By month</TabsTrigger>
                <TabsTrigger value="range">Custom range</TabsTrigger>
              </TabsList>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={resetFilters}
                className="self-start sm:self-auto"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>

            <TabsContent value="month" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </TabsContent>

            <TabsContent value="range" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from">Start date</Label>
                  <Input
                    id="from"
                    type="date"
                    defaultValue={startDate ?? ""}
                    onChange={(e) => {
                      const from = e.target.value;
                      const to = searchParams.get("to") ?? endDate ?? from;
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
                  <Label htmlFor="to">End date</Label>
                  <Input
                    id="to"
                    type="date"
                    defaultValue={endDate ?? ""}
                    onChange={(e) => {
                      const to = e.target.value;
                      const from = searchParams.get("from") ?? startDate ?? to;
                      pushParams({
                        from: from || null,
                        to: to || null,
                        month: null,
                        year: null,
                      });
                    }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarRange className="size-3.5" />
          {filterMode === "range"
            ? "Showing entries for your selected date range."
            : "Showing entries for the selected month."}
        </p>
      </CardContent>
    </Card>
  );
}
