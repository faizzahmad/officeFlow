"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  employees,
  taskCollaborators,
  taskCommentMentions,
  taskComments,
  taskLinks,
  tasks,
  user,
} from "@/db/schema";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { notifyUser } from "@/lib/notify";
import { hasPermission } from "@/lib/permissions";
import { revalidateNotificationViews } from "@/lib/revalidate-notifications";
import { requireWorkspace } from "@/lib/session";
import {
  canAccessTask,
  canManageTaskParticipants,
  taskVisibilityCondition,
} from "@/lib/task-access";
import { extractMentionIds } from "@/lib/task-mentions";

export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string | null;
  assigneeId: string | null;
  assigneeName: string | null;
  createdById: string | null;
  creatorName: string | null;
  collaboratorCount: number;
  commentCount: number;
  linkCount: number;
  isCollaborator: boolean;
};

export type TaskMember = {
  employeeId: string;
  name: string;
  email: string;
  employeeCode: string;
};

async function getCollaboratorIds(taskId: string) {
  const rows = await db
    .select({ employeeId: taskCollaborators.employeeId })
    .from(taskCollaborators)
    .where(eq(taskCollaborators.taskId, taskId));
  return rows.map((row) => row.employeeId);
}

async function loadTaskForAccess(taskId: string, organizationId: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.organizationId, organizationId)))
    .limit(1);

  if (!task) return null;

  const collaboratorIds = await getCollaboratorIds(taskId);
  return { task, collaboratorIds };
}

type TaskAccessSuccess = {
  task: (typeof tasks.$inferSelect);
  collaboratorIds: string[];
  employeeId: string;
};

async function assertTaskAccess(
  taskId: string,
  organizationId: string,
  employeeId: string | undefined,
): Promise<TaskAccessSuccess | ActionResult> {
  if (!employeeId) return actionError("Employee profile not found");

  const loaded = await loadTaskForAccess(taskId, organizationId);
  if (!loaded) return actionError("Task not found");

  if (!canAccessTask(loaded.task, employeeId, loaded.collaboratorIds)) {
    return actionError("You do not have access to this task");
  }

  return { ...loaded, employeeId };
}

export async function getTaskMembers(): Promise<TaskMember[]> {
  const { organization } = await requireWorkspace();

  const rows = await db
    .select({
      employeeId: employees.id,
      name: user.name,
      email: user.email,
      employeeCode: employees.employeeCode,
    })
    .from(employees)
    .innerJoin(user, eq(employees.userId, user.id))
    .where(
      and(
        eq(employees.organizationId, organization.id),
        eq(employees.isActive, true),
      ),
    )
    .orderBy(user.name);

  return rows;
}

export async function getTasks(): Promise<TaskListItem[]> {
  const { organization, employee } = await requireWorkspace();
  if (!employee) return [];

  const conditions = [
    eq(tasks.organizationId, organization.id),
    taskVisibilityCondition(employee.id)!,
  ];

  const rows = await db
    .select({
      task: tasks,
      assigneeName: user.name,
    })
    .from(tasks)
    .leftJoin(employees, eq(tasks.assigneeId, employees.id))
    .leftJoin(user, eq(employees.userId, user.id))
    .where(and(...conditions))
    .orderBy(desc(tasks.createdAt));

  const taskIds = rows.map((row) => row.task.id);
  if (taskIds.length === 0) return [];

  const [collaborators, comments, links, creators] = await Promise.all([
    db
      .select({
        taskId: taskCollaborators.taskId,
        employeeId: taskCollaborators.employeeId,
      })
      .from(taskCollaborators)
      .where(inArray(taskCollaborators.taskId, taskIds)),
    db
      .select({ taskId: taskComments.taskId })
      .from(taskComments)
      .where(inArray(taskComments.taskId, taskIds)),
    db
      .select({ taskId: taskLinks.taskId })
      .from(taskLinks)
      .where(inArray(taskLinks.taskId, taskIds)),
    db
      .select({
        employeeId: employees.id,
        name: user.name,
      })
      .from(employees)
      .innerJoin(user, eq(employees.userId, user.id))
      .where(eq(employees.organizationId, organization.id)),
  ]);

  const creatorNameById = Object.fromEntries(
    creators.map((c) => [c.employeeId, c.name]),
  );

  const collaboratorCountByTask = new Map<string, number>();
  const isCollaboratorByTask = new Set<string>();
  for (const row of collaborators) {
    collaboratorCountByTask.set(
      row.taskId,
      (collaboratorCountByTask.get(row.taskId) ?? 0) + 1,
    );
    if (row.employeeId === employee.id) {
      isCollaboratorByTask.add(row.taskId);
    }
  }

  const commentCountByTask = new Map<string, number>();
  for (const row of comments) {
    commentCountByTask.set(
      row.taskId,
      (commentCountByTask.get(row.taskId) ?? 0) + 1,
    );
  }

  const linkCountByTask = new Map<string, number>();
  for (const row of links) {
    linkCountByTask.set(row.taskId, (linkCountByTask.get(row.taskId) ?? 0) + 1);
  }

  return rows.map((row) => ({
    id: row.task.id,
    title: row.task.title,
    description: row.task.description,
    status: row.task.status,
    priority: row.task.priority,
    dueDate: row.task.dueDate,
    assigneeId: row.task.assigneeId,
    assigneeName: row.assigneeName,
    createdById: row.task.createdById,
    creatorName: row.task.createdById
      ? (creatorNameById[row.task.createdById] ?? null)
      : null,
    collaboratorCount: collaboratorCountByTask.get(row.task.id) ?? 0,
    commentCount: commentCountByTask.get(row.task.id) ?? 0,
    linkCount: linkCountByTask.get(row.task.id) ?? 0,
    isCollaborator: isCollaboratorByTask.has(row.task.id),
  }));
}

export async function getTaskDetail(taskId: string) {
  const { organization, employee, member } = await requireWorkspace();
  if (!employee) return null;

  const access = await assertTaskAccess(taskId, organization.id, employee.id);
  if (!("task" in access)) return null;

  const { task, collaboratorIds } = access;
  const canAssignTasks = hasPermission(member.role, "assignTasks");
  const canManageParticipants = canManageTaskParticipants(
    task,
    employee.id,
    collaboratorIds,
    canAssignTasks,
  );

  const [assigneeRow] = task.assigneeId
    ? await db
        .select({ name: user.name })
        .from(employees)
        .innerJoin(user, eq(employees.userId, user.id))
        .where(eq(employees.id, task.assigneeId))
        .limit(1)
    : [null];

  const [creatorRow] = task.createdById
    ? await db
        .select({ name: user.name })
        .from(employees)
        .innerJoin(user, eq(employees.userId, user.id))
        .where(eq(employees.id, task.createdById))
        .limit(1)
    : [null];

  const collaboratorRows = await db
    .select({
      employeeId: taskCollaborators.employeeId,
      name: user.name,
    })
    .from(taskCollaborators)
    .innerJoin(employees, eq(taskCollaborators.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(eq(taskCollaborators.taskId, taskId));

  const linkRows = await db
    .select({
      id: taskLinks.id,
      url: taskLinks.url,
      label: taskLinks.label,
      createdAt: taskLinks.createdAt,
      authorName: user.name,
    })
    .from(taskLinks)
    .leftJoin(employees, eq(taskLinks.addedById, employees.id))
    .leftJoin(user, eq(employees.userId, user.id))
    .where(eq(taskLinks.taskId, taskId))
    .orderBy(desc(taskLinks.createdAt));

  const commentRows = await db
    .select({
      id: taskComments.id,
      content: taskComments.content,
      createdAt: taskComments.createdAt,
      authorId: taskComments.authorId,
      authorName: user.name,
    })
    .from(taskComments)
    .innerJoin(employees, eq(taskComments.authorId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(eq(taskComments.taskId, taskId))
    .orderBy(desc(taskComments.createdAt));

  const commentIds = commentRows.map((row) => row.id);
  const mentionRows =
    commentIds.length > 0
      ? await db
          .select({
            commentId: taskCommentMentions.commentId,
            employeeId: taskCommentMentions.employeeId,
            name: user.name,
          })
          .from(taskCommentMentions)
          .innerJoin(employees, eq(taskCommentMentions.employeeId, employees.id))
          .innerJoin(user, eq(employees.userId, user.id))
          .where(inArray(taskCommentMentions.commentId, commentIds))
      : [];

  const mentionsByComment = new Map<
    string,
    { employeeId: string; name: string }[]
  >();
  for (const row of mentionRows) {
    const list = mentionsByComment.get(row.commentId) ?? [];
    list.push({ employeeId: row.employeeId, name: row.name });
    mentionsByComment.set(row.commentId, list);
  }

  return {
    task,
    assigneeName: assigneeRow?.name ?? null,
    creatorName: creatorRow?.name ?? null,
    collaborators: collaboratorRows,
    links: linkRows,
    comments: commentRows.map((row) => ({
      ...row,
      mentions: mentionsByComment.get(row.id) ?? [],
    })),
    permissions: {
      canAssignTasks,
      canManageParticipants,
      canChangeAssignee: canAssignTasks,
    },
  };
}

export async function createTask(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee, member } = await requireWorkspace();
  if (!employee) return actionError("Employee profile not found");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let assigneeId = String(formData.get("assigneeId") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? "medium") as
    | "low"
    | "medium"
    | "high"
    | "urgent";
  const collaboratorIds = String(formData.get("collaboratorIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!title) return actionError("Task title is required");

  const canAssignTasks = hasPermission(member.role, "assignTasks");

  if (!canAssignTasks) {
    assigneeId = employee.id;
  } else if (!assigneeId) {
    assigneeId = employee.id;
  }

  const [newTask] = await db
    .insert(tasks)
    .values({
      organizationId: organization.id,
      title,
      description: description || null,
      assigneeId,
      createdById: employee.id,
      dueDate,
      priority,
    })
    .returning();

  const uniqueCollaborators = [
    ...new Set(
      collaboratorIds.filter(
        (id) => id !== assigneeId && id !== employee.id,
      ),
    ),
  ];

  if (uniqueCollaborators.length > 0) {
    await db.insert(taskCollaborators).values(
      uniqueCollaborators.map((collaboratorId) => ({
        taskId: newTask.id,
        employeeId: collaboratorId,
      })),
    );
  }

  const notifyIds = new Set<string>();
  if (assigneeId && assigneeId !== employee.id) notifyIds.add(assigneeId);
  for (const id of uniqueCollaborators) notifyIds.add(id);

  for (const empId of notifyIds) {
    const [row] = await db
      .select({ userId: employees.userId })
      .from(employees)
      .where(eq(employees.id, empId))
      .limit(1);

    if (row) {
      await notifyUser({
        organizationId: organization.id,
        userId: row.userId,
        type: "task_assigned",
        title: "New task shared with you",
        message: `You were added to: ${title}`,
        link: "/tasks",
        emailSubject: "Task update in Office Flow",
        emailBody: `You have been added to the task <strong>${title}</strong>.`,
      });
    }
  }

  revalidatePath("/tasks");
  revalidateNotificationViews();
  revalidatePath("/dashboard");
  return actionSuccess("Task created");
}

export async function updateTaskStatus(
  taskId: string,
  status: "pending" | "in_progress" | "completed" | "cancelled",
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === "completed" ? new Date() : null,
    })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return actionSuccess("Task status updated");
}

export async function updateTaskDetails(
  taskId: string,
  formData: FormData,
): Promise<ActionResult> {
  const { organization, employee, member } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  const { task, collaboratorIds } = access;
  const canAssignTasks = hasPermission(member.role, "assignTasks");
  const canManage = canManageTaskParticipants(
    task,
    access.employeeId,
    collaboratorIds,
    canAssignTasks,
  );

  if (!canManage) {
    return actionError("You cannot edit this task");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const priority = String(formData.get("priority") ?? task.priority) as
    | "low"
    | "medium"
    | "high"
    | "urgent";
  let assigneeId = task.assigneeId;

  if (canAssignTasks) {
    const nextAssignee = String(formData.get("assigneeId") ?? "").trim();
    assigneeId = nextAssignee || null;
  }

  if (!title) return actionError("Title is required");

  await db
    .update(tasks)
    .set({
      title,
      description: description || null,
      dueDate,
      priority,
      assigneeId,
    })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tasks");
  return actionSuccess("Task updated");
}

export async function addTaskCollaborator(
  taskId: string,
  collaboratorEmployeeId: string,
): Promise<ActionResult> {
  const { organization, employee, member } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  const canAssignTasks = hasPermission(member.role, "assignTasks");
  const canManage = canManageTaskParticipants(
    access.task,
    access.employeeId,
    access.collaboratorIds,
    canAssignTasks,
  );

  if (!canManage) {
    return actionError("You cannot add collaborators");
  }

  if (
    collaboratorEmployeeId === access.task.assigneeId ||
    collaboratorEmployeeId === access.task.createdById
  ) {
    return actionError("This person is already on the task");
  }

  if (access.collaboratorIds.includes(collaboratorEmployeeId)) {
    return actionError("Already a collaborator");
  }

  await db.insert(taskCollaborators).values({
    taskId,
    employeeId: collaboratorEmployeeId,
  });

  const [row] = await db
    .select({ userId: employees.userId })
    .from(employees)
    .where(eq(employees.id, collaboratorEmployeeId))
    .limit(1);

  if (row) {
    await notifyUser({
      organizationId: organization.id,
      userId: row.userId,
      type: "task_assigned",
      title: "Added as task collaborator",
      message: `You were added to: ${access.task.title}`,
      link: "/tasks",
    });
  }

  revalidatePath("/tasks");
  return actionSuccess("Collaborator added");
}

export async function removeTaskCollaborator(
  taskId: string,
  collaboratorEmployeeId: string,
): Promise<ActionResult> {
  const { organization, employee, member } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  const canAssignTasks = hasPermission(member.role, "assignTasks");
  const canManage = canManageTaskParticipants(
    access.task,
    access.employeeId,
    access.collaboratorIds,
    canAssignTasks,
  );

  if (!canManage) {
    return actionError("You cannot remove collaborators");
  }

  await db
    .delete(taskCollaborators)
    .where(
      and(
        eq(taskCollaborators.taskId, taskId),
        eq(taskCollaborators.employeeId, collaboratorEmployeeId),
      ),
    );

  revalidatePath("/tasks");
  return actionSuccess("Collaborator removed");
}

export async function addTaskLink(
  taskId: string,
  url: string,
  label?: string,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return actionError("URL is required");

  try {
    new URL(trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`);
  } catch {
    return actionError("Invalid URL");
  }

  const normalizedUrl = trimmedUrl.startsWith("http")
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  await db.insert(taskLinks).values({
    taskId,
    url: normalizedUrl,
    label: label?.trim() || null,
    addedById: employee?.id ?? null,
  });

  revalidatePath("/tasks");
  return actionSuccess("Link attached");
}

export async function removeTaskLink(
  taskId: string,
  linkId: string,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  await db
    .delete(taskLinks)
    .where(and(eq(taskLinks.id, linkId), eq(taskLinks.taskId, taskId)));

  revalidatePath("/tasks");
  return actionSuccess("Link removed");
}

export async function addTaskCommentAction(
  taskId: string,
  content: string,
): Promise<ActionResult> {
  const { organization, employee } = await requireWorkspace();
  const access = await assertTaskAccess(taskId, organization.id, employee?.id);
  if (!("task" in access)) return access;

  const trimmed = content.trim();
  if (!trimmed) return actionError("Comment cannot be empty");

  const [comment] = await db
    .insert(taskComments)
    .values({
      taskId,
      authorId: access.employeeId,
      content: trimmed,
    })
    .returning();

  const mentionIds = extractMentionIds(trimmed);
  if (mentionIds.length > 0) {
    await db.insert(taskCommentMentions).values(
      mentionIds.map((employeeId) => ({
        commentId: comment.id,
        employeeId,
      })),
    );

    for (const empId of mentionIds) {
      if (empId === access.employeeId) continue;
      const [row] = await db
        .select({ userId: employees.userId })
        .from(employees)
        .where(
          and(
            eq(employees.id, empId),
            eq(employees.organizationId, organization.id),
          ),
        )
        .limit(1);

      if (row) {
        await notifyUser({
          organizationId: organization.id,
          userId: row.userId,
          type: "task_assigned",
          title: "You were mentioned in a task",
          message: `Mentioned on: ${access.task.title}`,
          link: "/tasks",
        });
      }
    }
  }

  revalidatePath("/tasks");
  revalidateNotificationViews();
  return actionSuccess("Comment added");
}

export async function getTaskStats() {
  const { organization, employee } = await requireWorkspace();
  if (!employee) {
    return {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      total: 0,
      completionRate: 0,
    };
  }

  const rows = await db
    .select({ status: tasks.status })
    .from(tasks)
    .where(
      and(
        eq(tasks.organizationId, organization.id),
        taskVisibilityCondition(employee.id)!,
      ),
    );

  const stats = {
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    total: rows.length,
  };

  for (const row of rows) {
    stats[row.status] += 1;
  }

  const completionRate =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  return { ...stats, completionRate };
}
