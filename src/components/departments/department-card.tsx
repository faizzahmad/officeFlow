"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteDepartment, updateDepartment } from "@/actions/employees";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showActionToast } from "@/lib/toast-action";

type Department = {
  id: string;
  name: string;
  description: string | null;
};

export function DepartmentCard({ department }: { department: Department }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{department.name}</CardTitle>
        <div className="flex shrink-0 gap-1">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Edit department">
                  <Pencil className="size-4" />
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit department</DialogTitle>
              </DialogHeader>
              <ActionForm
                action={updateDepartment}
                successMessage="Department updated"
                onSuccess={() => {
                  setEditOpen(false);
                  router.refresh();
                }}
                className="space-y-4"
              >
                <input type="hidden" name="id" value={department.id} />
                <div className="space-y-2">
                  <Label htmlFor={`name-${department.id}`}>Name</Label>
                  <Input
                    id={`name-${department.id}`}
                    name="name"
                    defaultValue={department.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${department.id}`}>
                    Description
                  </Label>
                  <Textarea
                    id={`description-${department.id}`}
                    name="description"
                    defaultValue={department.description ?? ""}
                  />
                </div>
                <SubmitButton loadingText="Saving...">Save changes</SubmitButton>
              </ActionForm>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  aria-label="Delete department"
                >
                  <Trash2 className="size-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete department?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove &quot;{department.name}&quot;.
                  Employees in this department will be unassigned.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleting}
                  onClick={() =>
                    startDelete(async () => {
                      const result = await deleteDepartment(department.id);
                      showActionToast(result, "Department deleted");
                      if (result.ok) {
                        setDeleteOpen(false);
                        router.refresh();
                      }
                    })
                  }
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {department.description ?? "No description"}
      </CardContent>
    </Card>
  );
}
