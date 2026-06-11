import {
  createPerformanceReview,
  getDailyReports,
  getPerformanceReviews,
  submitDailyReport,
} from "@/actions/performance";
import { getEmployees } from "@/actions/employees";
import { ActionForm } from "@/components/action-form";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/submit-button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { RoleGate } from "@/components/role-gate";
import { getRolePermissions, requireWorkspace } from "@/lib/session";

export default async function PerformancePage() {
  const { member } = await requireWorkspace();
  const permissions = getRolePermissions(member.role);

  const [reports, reviews, employees] = await Promise.all([
    getDailyReports(),
    getPerformanceReviews(),
    permissions.canCreatePerformanceReview
      ? getEmployees()
      : Promise.resolve([]),
  ]);

  const employeeItems = employees.map((employee) => ({
    value: employee.employee.id,
    label: employee.userName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description="Daily reports, manager feedback, and performance scoring."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit daily report</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={submitDailyReport}
              successMessage="Daily report submitted"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">What did you accomplish?</Label>
                <Textarea id="summary" name="summary" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blockers">Blockers</Label>
                <Textarea id="blockers" name="blockers" />
              </div>
              <SubmitButton loadingText="Submitting...">
                Submit report
              </SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>

        <RoleGate role={member.role} permission="createPerformanceReview">
        <Card>
          <CardHeader>
            <CardTitle>Manager review</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={createPerformanceReview}
              successMessage="Performance review saved"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select items={employeeItems} name="employeeId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.employee.id}
                        value={employee.employee.id}
                      >
                        {employee.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Review period</Label>
                <Input id="period" name="period" placeholder="Q1 2026" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Score (1-100)</Label>
                <Input id="score" name="score" type="number" min={1} max={100} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea id="feedback" name="feedback" />
              </div>
              <SubmitButton loadingText="Saving...">Save review</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
        </RoleGate>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((row) => (
                  <TableRow key={row.report.id}>
                    <TableCell>{row.report.date}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.report.summary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((row) => (
                  <TableRow key={row.review.id}>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.review.period}</TableCell>
                    <TableCell>{row.review.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
