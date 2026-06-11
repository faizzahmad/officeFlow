import { getEmployees } from "@/actions/employees";
import { getPayrollRuns, getPayslips } from "@/actions/payroll";
import { DownloadPayslipButton } from "@/components/download-payslip-button";
import { PageHeader } from "@/components/page-header";
import { GeneratePayrollForm } from "@/components/payroll/generate-payroll-form";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/payroll";
import { getRolePermissions, requireWorkspace } from "@/lib/session";

export default async function PayrollPage() {
  const { member } = await requireWorkspace();
  const permissions = getRolePermissions(member.role);

  const [runs, payslips, employees] = await Promise.all([
    getPayrollRuns(),
    getPayslips(),
    permissions.canGeneratePayroll ? getEmployees() : Promise.resolve([]),
  ]);

  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description={
          permissions.canGeneratePayroll
            ? "Generate monthly payroll, salary slips, and deductions."
            : "View and download your salary slips."
        }
      />

      <RoleGate role={member.role} permission="generatePayroll">
        <Card>
          <CardHeader>
            <CardTitle>Generate payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <GeneratePayrollForm
              employees={employees
                .filter((row) => row.employee.isActive)
                .map((row) => ({
                  id: row.employee.id,
                  name: row.userName,
                  code: row.employee.employeeCode,
                }))}
              defaultMonth={now.getMonth() + 1}
              defaultYear={now.getFullYear()}
            />
          </CardContent>
        </Card>
      </RoleGate>

      <div className="grid gap-6 lg:grid-cols-2">
        <RoleGate role={member.role} permission="viewAllPayslips">
          <Card>
            <CardHeader>
              <CardTitle>Payroll runs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell>
                        {run.month}/{run.year}
                      </TableCell>
                      <TableCell className="capitalize">{run.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </RoleGate>

        <Card className={permissions.canViewAllPayslips ? "" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>Salary slips</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slip</TableHead>
                  {permissions.canViewAllPayslips ? (
                    <TableHead>Employee</TableHead>
                  ) : null}
                  <TableHead>Net salary</TableHead>
                  <TableHead>Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={permissions.canViewAllPayslips ? 4 : 3}
                      className="text-center text-muted-foreground"
                    >
                      No salary slips yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  payslips.map((row) => (
                    <TableRow key={row.payslip.id}>
                      <TableCell>{row.payslip.slipNumber}</TableCell>
                      {permissions.canViewAllPayslips ? (
                        <TableCell>{row.userName}</TableCell>
                      ) : null}
                      <TableCell>
                        {formatCurrency(row.payslip.netSalary)}
                      </TableCell>
                      <TableCell>
                        <DownloadPayslipButton payslipId={row.payslip.id} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
