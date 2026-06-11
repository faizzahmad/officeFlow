import {
  createClient,
  createProject,
  getClients,
  getProjects,
} from "@/actions/projects";
import { ActionForm } from "@/components/action-form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/payroll";
import { requirePermission } from "@/lib/session";

export default async function ProjectsPage() {
  await requirePermission("manageProjects");
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);
  const clientItems = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Agency-style client projects, team tasks, and budgets."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add client</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={createClient}
              successMessage="Client saved"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="clientName">Client name</Label>
                <Input id="clientName" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <SubmitButton loadingText="Saving...">Save client</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
          </CardHeader>
          <CardContent>
            <ActionForm
              action={createProject}
              successMessage="Project created"
              resetOnSuccess
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="projectName">Project name</Label>
                <Input id="projectName" name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select items={clientItems} name="clientId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" name="budget" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <SubmitButton loadingText="Creating...">
                Create project
              </SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((row) => (
          <Card key={row.project.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{row.project.name}</CardTitle>
                <Badge variant="outline">{row.project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Client: {row.clientName ?? "Internal"}</p>
              <p>Manager: {row.managerName ?? "Unassigned"}</p>
              <p>
                Budget:{" "}
                {row.project.budget
                  ? formatCurrency(row.project.budget)
                  : "—"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
