import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamPulse({
  attendanceRate,
  taskCompletion,
  presentToday,
  employees,
  lateThisMonth,
  openTasks,
}: {
  attendanceRate: number;
  taskCompletion: number;
  presentToday: number;
  employees: number;
  lateThisMonth: number;
  openTasks: number;
}) {
  return (
    <Card className="border-primary/10 bg-secondary">
      <CardHeader>
        <CardTitle className="font-heading text-base">Team pulse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Attendance today</span>
            <span className="font-medium">{attendanceRate}%</span>
          </div>
          <Progress value={attendanceRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {presentToday} of {employees} employees checked in
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Task completion</span>
            <span className="font-medium">{taskCompletion}%</span>
          </div>
          <Progress value={taskCompletion} className="h-2" />
          <p className="text-xs text-muted-foreground">{openTasks} open tasks</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg border bg-background/80 p-3 text-center">
            <p className="font-heading text-2xl font-bold text-primary">
              {lateThisMonth}
            </p>
            <p className="text-xs text-muted-foreground">Late this month</p>
          </div>
          <div className="rounded-lg border bg-background/80 p-3 text-center">
            <p className="font-heading text-2xl font-bold text-brand">
              {employees}
            </p>
            <p className="text-xs text-muted-foreground">Active team</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
