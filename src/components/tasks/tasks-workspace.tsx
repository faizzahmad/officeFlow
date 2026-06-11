"use client";

import { useState } from "react";

import type { TaskListItem, TaskMember } from "@/actions/tasks";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskDetailSheet } from "@/components/tasks/task-detail-sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TasksWorkspace({
  tasks,
  members,
  canAssignTasks,
  currentEmployeeId,
}: {
  tasks: TaskListItem[];
  members: TaskMember[];
  canAssignTasks: boolean;
  currentEmployeeId: string;
}) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">New task</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateTaskForm
              members={members}
              canAssignTasks={canAssignTasks}
              currentEmployeeId={currentEmployeeId}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-semibold">My tasks</h2>
            <p className="text-sm text-muted-foreground">
              Tasks assigned to you, created by you, or shared as a collaborator.
            </p>
          </div>
          <TaskBoard
            tasks={tasks}
            onSelectTask={(id) => {
              setSelectedTaskId(id);
              setSheetOpen(true);
            }}
          />
        </div>
      </div>

      <TaskDetailSheet
        taskId={selectedTaskId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        members={members}
      />
    </>
  );
}
