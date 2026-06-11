"use client";

import { useMemo, useState } from "react";

import { createTask, type TaskMember } from "@/actions/tasks";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
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
import {
  TASK_PRIORITY_OPTIONS,
} from "@/lib/select-options";

export function CreateTaskForm({
  members,
  canAssignTasks,
  currentEmployeeId,
}: {
  members: TaskMember[];
  canAssignTasks: boolean;
  currentEmployeeId: string;
}) {
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const memberItems = useMemo(
    () =>
      members.map((member) => ({
        value: member.employeeId,
        label: member.name,
      })),
    [members],
  );

  function toggleCollaborator(employeeId: string) {
    setCollaborators((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  }

  return (
    <ActionForm
      action={createTask}
      successMessage="Task created"
      resetOnSuccess
      onSuccess={() => setCollaborators([])}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="What needs to be done?" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>
      {canAssignTasks ? (
        <div className="space-y-2">
          <Label>Assign to</Label>
          <Select
            items={memberItems}
            name="assigneeId"
            defaultValue={currentEmployeeId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.employeeId} value={member.employeeId}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" name="dueDate" type="date" />
      </div>
      <div className="space-y-2">
        <Label>Priority</Label>
        <Select items={TASK_PRIORITY_OPTIONS} name="priority" defaultValue="medium">
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
      <div className="space-y-2">
        <Label>Collaborators</Label>
        <p className="text-xs text-muted-foreground">
          Collaborators can view and comment on this task.
        </p>
        <div className="flex flex-wrap gap-2">
          {members
            .filter((m) => m.employeeId !== currentEmployeeId)
            .map((member) => {
              const selected = collaborators.includes(member.employeeId);
              return (
                <button
                  key={member.employeeId}
                  type="button"
                  onClick={() => toggleCollaborator(member.employeeId)}
                  className="rounded-full"
                >
                  <Badge variant={selected ? "default" : "outline"}>
                    {member.name}
                  </Badge>
                </button>
              );
            })}
        </div>
        <input
          type="hidden"
          name="collaboratorIds"
          value={collaborators.join(",")}
        />
      </div>
      <SubmitButton loadingText="Creating...">Create task</SubmitButton>
    </ActionForm>
  );
}
