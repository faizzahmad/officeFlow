"use client";

import {
  Calendar,
  Link2,
  MessageSquare,
  UserPlus,
} from "lucide-react";

import type { TaskListItem } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const columns = [
  { key: "pending", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Done" },
] as const;

const priorityStyles: Record<TaskListItem["priority"], string> = {
  low: "border-muted-foreground/30",
  medium: "border-primary/30",
  high: "border-orange-400/50",
  urgent: "border-destructive/50",
};

export function TaskBoard({
  tasks,
  onSelectTask,
}: {
  tasks: TaskListItem[];
  onSelectTask: (taskId: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No tasks yet. Create one or wait until someone assigns you work.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <div key={column.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{column.label}</h3>
            <Badge variant="secondary">
              {tasks.filter((t) => t.status === column.key).length}
            </Badge>
          </div>
          {tasks
            .filter((task) => task.status === column.key)
            .map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onSelectTask(task.id)}
                className="w-full text-left"
              >
                <Card
                  className={cn(
                    "border-l-4 transition-shadow hover:shadow-md",
                    priorityStyles[task.priority],
                  )}
                >
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm leading-snug">
                        {task.title}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description ? (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    {task.dueDate ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        Due {task.dueDate}
                      </div>
                    ) : null}
                    {task.assigneeName ? (
                      <p>Assignee: {task.assigneeName}</p>
                    ) : null}
                    {task.isCollaborator ? (
                      <Badge variant="secondary" className="text-[10px]">
                        Collaborator
                      </Badge>
                    ) : null}
                    <div className="flex items-center gap-3 pt-1">
                      {task.commentCount > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="size-3.5" />
                          {task.commentCount}
                        </span>
                      ) : null}
                      {task.linkCount > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Link2 className="size-3.5" />
                          {task.linkCount}
                        </span>
                      ) : null}
                      {task.collaboratorCount > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <UserPlus className="size-3.5" />
                          {task.collaboratorCount}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
