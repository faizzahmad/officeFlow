import { createDepartment, getDepartments } from "@/actions/employees";
import { ActionForm } from "@/components/action-form";
import { DepartmentCard } from "@/components/departments/department-card";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requirePermission } from "@/lib/session";

export default async function DepartmentsPage() {
  await requirePermission("manageDepartments");
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Organize employees into teams and departments."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add department</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={createDepartment}
              successMessage="Department created"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <SubmitButton loadingText="Creating...">
                Create department
              </SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {departments.length === 0 ? (
            <Card className="md:col-span-2">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No departments yet. Create your first one to get started.
              </CardContent>
            </Card>
          ) : (
            departments.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
