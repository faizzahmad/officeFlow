import { and, eq, exists, or, type SQL } from "drizzle-orm";

import { db } from "@/db";
import { taskCollaborators, tasks } from "@/db/schema";

type TaskRow = {
  assigneeId: string | null;
  createdById: string | null;
};

export function taskVisibilityCondition(
  employeeId: string,
): SQL | undefined {
  return or(
    eq(tasks.assigneeId, employeeId),
    eq(tasks.createdById, employeeId),
    exists(
      db
        .select({ id: taskCollaborators.id })
        .from(taskCollaborators)
        .where(
          and(
            eq(taskCollaborators.taskId, tasks.id),
            eq(taskCollaborators.employeeId, employeeId),
          ),
        ),
    ),
  );
}

export function canAccessTask(
  task: TaskRow,
  employeeId: string,
  collaboratorIds: string[],
) {
  return (
    task.assigneeId === employeeId ||
    task.createdById === employeeId ||
    collaboratorIds.includes(employeeId)
  );
}

export function canManageTaskParticipants(
  task: TaskRow,
  employeeId: string,
  collaboratorIds: string[],
  canAssignTasks: boolean,
) {
  return (
    canAssignTasks ||
    task.assigneeId === employeeId ||
    task.createdById === employeeId ||
    collaboratorIds.includes(employeeId)
  );
}
