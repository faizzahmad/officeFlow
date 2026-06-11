"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AttendanceTrend = {
  day: string;
  present: number;
  late: number;
};

type BreakdownItem = {
  status: string;
  label: string;
  count: number;
};

const attendanceChartConfig = {
  present: { label: "Checked in", color: "var(--color-chart-1)" },
  late: { label: "Late", color: "var(--color-chart-5)" },
};

const taskChartConfig = {
  pending: { label: "Pending", color: "var(--color-chart-4)" },
  in_progress: { label: "In Progress", color: "var(--color-chart-1)" },
  completed: { label: "Completed", color: "var(--color-chart-2)" },
  cancelled: { label: "Cancelled", color: "var(--color-chart-3)" },
};

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
];

export function AttendanceTrendChart({ data }: { data: AttendanceTrend[] }) {
  return (
    <ChartContainer config={attendanceChartConfig} className="h-[280px] w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="present"
          stackId="1"
          stroke="var(--color-chart-1)"
          fill="var(--color-chart-1)"
          fillOpacity={0.35}
        />
        <Area
          type="monotone"
          dataKey="late"
          stackId="1"
          stroke="var(--color-chart-5)"
          fill="var(--color-chart-5)"
          fillOpacity={0.45}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function TaskBreakdownChart({ data }: { data: BreakdownItem[] }) {
  const filtered = data.filter((item) => item.count > 0);
  const chartData =
    filtered.length > 0
      ? filtered
      : [{ status: "empty", label: "No tasks", count: 1 }];

  return (
    <ChartContainer config={taskChartConfig} className="h-[280px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={entry.status}
              fill={
                entry.status === "empty"
                  ? "var(--color-muted)"
                  : PIE_COLORS[index % PIE_COLORS.length]
              }
            />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
      </PieChart>
    </ChartContainer>
  );
}

export function AttendanceStatusChart({ data }: { data: BreakdownItem[] }) {
  const chartConfig = Object.fromEntries(
    data.map((item, index) => [
      item.status,
      {
        label: item.label,
        color: PIE_COLORS[index % PIE_COLORS.length],
      },
    ]),
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[240px] w-full"
      initialDimension={{ width: 320, height: 240 }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} hide />
        <YAxis
          type="category"
          dataKey="label"
          width={72}
          tickLine={false}
          axisLine={false}
          className="capitalize"
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.status}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function LeaveStatusChart({ data }: { data: BreakdownItem[] }) {
  const chartConfig = Object.fromEntries(
    data.map((item, index) => [
      item.status,
      {
        label: item.label,
        color: PIE_COLORS[index % PIE_COLORS.length],
      },
    ]),
  );

  const chartData =
    data.length > 0 ? data : [{ status: "none", label: "No requests", count: 0 }];

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[240px] w-full"
      initialDimension={{ width: 320, height: 240 }}
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          className="capitalize"
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={entry.status}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
