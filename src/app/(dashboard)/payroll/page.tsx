import { getEmployees } from "@/actions/employees";
import { getPayrollRuns, getPayslips } from "@/actions/payroll";
import { PageHeader } from "@/components/page-header";
import { GeneratePayrollForm } from "@/components/payroll/generate-payroll-form";
import { PayrollRunsTable } from "@/components/payroll/payroll-runs-table";
import { PayslipsTable } from "@/components/payroll/payslips-table";
import { RoleGate } from "@/components/role-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              <PayrollRunsTable data={runs} />
            </CardContent>
          </Card>
        </RoleGate>

        <Card className={permissions.canViewAllPayslips ? "" : "lg:col-span-2"}>
          <CardHeader>
            <CardTitle>Salary slips</CardTitle>
          </CardHeader>
          <CardContent>
            <PayslipsTable
              data={payslips}
              showEmployee={permissions.canViewAllPayslips}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
