import { getTaskMembers, getTasks } from "@/actions/tasks";
import { PageHeader } from "@/components/page-header";
import { TasksWorkspace } from "@/components/tasks/tasks-workspace";
import { getRolePermissions, requireWorkspace } from "@/lib/session";

export default async function TasksPage() {
  const { member, employee } = await requireWorkspace();
  const permissions = getRolePermissions(member.role);

  if (!employee) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Tasks"
          description="Your employee profile is required to use tasks."
        />
      </div>
    );
  }

  const [tasks, members] = await Promise.all([getTasks(), getTaskMembers()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Asana-style task board — assign work, collaborate, comment, attach links, and track due dates."
      />

      <TasksWorkspace
        tasks={tasks}
        members={members}
        canAssignTasks={permissions.canAssignTasks}
        currentEmployeeId={employee.id}
      />
    </div>
  );
}
