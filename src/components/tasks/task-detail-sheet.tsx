"use client";

import {
  ExternalLink,
  Link2,
  MessageSquare,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  addTaskCollaborator,
  addTaskCommentAction,
  addTaskLink,
  getTaskDetail,
  removeTaskCollaborator,
  removeTaskLink,
  updateTaskDetails,
  updateTaskStatus,
  type TaskMember,
} from "@/actions/tasks";
import { LoadingButton } from "@/components/loading-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "@/lib/select-options";
import { formatMention, renderMentionContent } from "@/lib/task-mentions";
import { showActionToast } from "@/lib/toast-action";

type TaskDetail = NonNullable<Awaited<ReturnType<typeof getTaskDetail>>>;

export function TaskDetailSheet({
  taskId,
  open,
  onOpenChange,
  members,
}: {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TaskMember[];
}) {
  const router = useRouter();
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [pending, startTransition] = useTransition();

  const nameById = Object.fromEntries(
    members.map((m) => [m.employeeId, m.name]),
  );
  const memberItems = useMemo(
    () =>
      members.map((member) => ({
        value: member.employeeId,
        label: member.name,
      })),
    [members],
  );
  const collaboratorItems = useMemo(() => {
    if (!detail) return [];
    return members
      .filter(
        (member) =>
          !detail.collaborators.some(
            (collaborator) => collaborator.employeeId === member.employeeId,
          ) &&
          member.employeeId !== detail.task.assigneeId &&
          member.employeeId !== detail.task.createdById,
      )
      .map((member) => ({
        value: member.employeeId,
        label: member.name,
      }));
  }, [detail, members]);

  useEffect(() => {
    if (!open || !taskId) {
      setDetail(null);
      return;
    }

    setLoading(true);
    void getTaskDetail(taskId).then((data) => {
      setDetail(data);
      setLoading(false);
    });
  }, [open, taskId]);

  function refresh() {
    if (!taskId) return;
    void getTaskDetail(taskId).then(setDetail);
    router.refresh();
  }

  function insertMention(member: TaskMember) {
    setComment((prev) =>
      `${prev}${prev.endsWith(" ") || prev.length === 0 ? "" : " "}${formatMention(member.employeeId, member.name)} `,
    );
  }

  if (!taskId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-xl"
      >
        {loading || !detail ? (
          <div className="flex h-40 items-center justify-center px-5 text-sm text-muted-foreground sm:px-6">
            Loading task...
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-5 pb-8 pt-5 sm:px-6 sm:pt-6">
            <SheetHeader className="space-y-3 p-0 pr-10 text-left">
              <SheetTitle className="font-heading text-xl leading-snug">
                {detail.task.title}
              </SheetTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {detail.task.priority}
                </Badge>
                {detail.task.dueDate ? (
                  <Badge variant="secondary">Due {detail.task.dueDate}</Badge>
                ) : null}
              </div>
            </SheetHeader>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                items={TASK_STATUS_OPTIONS}
                value={detail.task.status}
                onValueChange={(value) => {
                  if (!value) return;
                  startTransition(async () => {
                    const result = await updateTaskStatus(
                      taskId,
                      value as TaskDetail["task"]["status"],
                    );
                    showActionToast(result, "Status updated");
                    refresh();
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">To do</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="completed">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {detail.permissions.canManageParticipants ? (
              <form
                className="space-y-3 rounded-lg border p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  startTransition(async () => {
                    const result = await updateTaskDetails(taskId, fd);
                    showActionToast(result, "Task updated");
                    refresh();
                  });
                }}
              >
                <p className="text-sm font-medium">Task details</p>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={detail.task.title}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    rows={3}
                    defaultValue={detail.task.description ?? ""}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-due">Due date</Label>
                    <Input
                      id="edit-due"
                      name="dueDate"
                      type="date"
                      defaultValue={detail.task.dueDate ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      items={TASK_PRIORITY_OPTIONS}
                      name="priority"
                      defaultValue={detail.task.priority}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {detail.permissions.canChangeAssignee ? (
                  <div className="space-y-2">
                    <Label>Assignee</Label>
                    <Select
                      items={memberItems}
                      name="assigneeId"
                      defaultValue={detail.task.assigneeId ?? undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem
                            key={member.employeeId}
                            value={member.employeeId}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <LoadingButton type="submit" size="sm" loading={pending}>
                  Save changes
                </LoadingButton>
              </form>
            ) : (
              <div className="space-y-2 text-sm">
                {detail.task.description ? (
                  <p className="text-muted-foreground">{detail.task.description}</p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">Assignee:</span>{" "}
                  {detail.assigneeName ?? "Unassigned"}
                </p>
                <p>
                  <span className="text-muted-foreground">Created by:</span>{" "}
                  {detail.creatorName ?? "—"}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UserPlus className="size-4" />
                Collaborators
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.collaborators.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No collaborators</p>
                ) : (
                  detail.collaborators.map((collaborator) => (
                    <Badge
                      key={collaborator.employeeId}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {collaborator.name}
                      {detail.permissions.canManageParticipants ? (
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-muted"
                          onClick={() =>
                            startTransition(async () => {
                              const result = await removeTaskCollaborator(
                                taskId,
                                collaborator.employeeId,
                              );
                              showActionToast(result);
                              refresh();
                            })
                          }
                        >
                          <X className="size-3" />
                        </button>
                      ) : null}
                    </Badge>
                  ))
                )}
              </div>
              {detail.permissions.canManageParticipants ? (
                <Select
                  items={collaboratorItems}
                  onValueChange={(employeeId) => {
                    if (typeof employeeId !== "string") return;
                    startTransition(async () => {
                      const result = await addTaskCollaborator(taskId, employeeId);
                      showActionToast(result);
                      refresh();
                    });
                  }}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Add collaborator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {members
                      .filter(
                        (m) =>
                          !detail.collaborators.some(
                            (c) => c.employeeId === m.employeeId,
                          ) &&
                          m.employeeId !== detail.task.assigneeId &&
                          m.employeeId !== detail.task.createdById,
                      )
                      .map((member) => (
                        <SelectItem
                          key={member.employeeId}
                          value={member.employeeId}
                        >
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="size-4" />
                Links
              </div>
              <div className="space-y-2">
                {detail.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-0 items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {link.label || link.url}
                      </span>
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        startTransition(async () => {
                          const result = await removeTaskLink(taskId, link.id);
                          showActionToast(result);
                          refresh();
                        })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <form
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    const result = await addTaskLink(
                      taskId,
                      linkUrl,
                      linkLabel,
                    );
                    showActionToast(result, "Link added");
                    if (result.ok) {
                      setLinkUrl("");
                      setLinkLabel("");
                    }
                    refresh();
                  });
                }}
              >
                <Input
                  className="sm:min-w-0 sm:flex-1"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  required
                />
                <Input
                  className="sm:min-w-0 sm:flex-1"
                  placeholder="Label (optional)"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                />
                <LoadingButton
                  type="submit"
                  size="sm"
                  className="shrink-0 sm:w-auto"
                  loading={pending}
                >
                  Add
                </LoadingButton>
              </form>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="size-4" />
                Comments
              </div>
              <div className="space-y-3">
                {detail.comments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No comments yet</p>
                ) : (
                  detail.comments.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {item.authorName}
                        </span>
                        <span>
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">
                        {renderMentionContent(item.content, nameById)}
                      </p>
                      {item.mentions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.mentions.map((mention) => (
                            <Badge
                              key={mention.employeeId}
                              variant="outline"
                              className="text-[10px]"
                            >
                              @{mention.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Write a comment... Use @ to mention teammates"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex flex-wrap gap-1">
                  {members.slice(0, 8).map((member) => (
                    <Button
                      key={member.employeeId}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => insertMention(member)}
                    >
                      @{member.name.split(" ")[0]}
                    </Button>
                  ))}
                </div>
                <LoadingButton
                  size="sm"
                  loading={pending}
                  onClick={() =>
                    startTransition(async () => {
                      const result = await addTaskCommentAction(taskId, comment);
                      showActionToast(result, "Comment added");
                      if (result.ok) setComment("");
                      refresh();
                    })
                  }
                >
                  Post comment
                </LoadingButton>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
