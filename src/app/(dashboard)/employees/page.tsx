import { createEmployee, getDepartments, getEmployees } from "@/actions/employees";
import { ActionForm } from "@/components/action-form";
import { EmployeesTable } from "@/components/employees/employees-table";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGate } from "@/components/role-gate";
import { MEMBER_ROLE_OPTIONS } from "@/lib/select-options";
import { requirePermission } from "@/lib/session";

export default async function EmployeesPage() {
  const { member } = await requirePermission("manageEmployees");

  const [employees, departments] = await Promise.all([
    getEmployees(),
    getDepartments(),
  ]);

  const roleItems =
    member.role === "admin"
      ? MEMBER_ROLE_OPTIONS
      : MEMBER_ROLE_OPTIONS.filter((role) => role.value !== "hr");
  const departmentItems = departments.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Add team members by their registered email. They must sign up at /signup first."
      >
        <RoleGate role={member.role} permission="manageEmployees">
        <Dialog>
          <DialogTrigger render={<Button />}>Add employee</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add employee</DialogTitle>
            </DialogHeader>
            <ActionForm
              action={createEmployee}
              successMessage="Employee added"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email (must be registered at /signup)</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select items={roleItems} name="role" defaultValue="employee">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    {member.role === "admin" ? (
                      <SelectItem value="hr">HR</SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCode">Employee code</Label>
                <Input id="employeeCode" name="employeeCode" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" name="designation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <Select items={departmentItems} name="departmentId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base salary</Label>
                <Input id="baseSalary" name="baseSalary" type="number" />
              </div>
              <SubmitButton loadingText="Saving...">Save employee</SubmitButton>
            </ActionForm>
          </DialogContent>
        </Dialog>
        </RoleGate>
      </PageHeader>

      <EmployeesTable data={employees} />
    </div>
  );
}
