"use client";

import { setEmployeePasswordFormAction } from "@/actions/employee-security";
import { ActionForm } from "@/components/action-form";
import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";

export function SetEmployeePasswordForm({
  userId,
  employeeName,
}: {
  userId: string;
  employeeName: string;
}) {
  return (
    <ActionForm
      action={setEmployeePasswordFormAction}
      successMessage="Password updated"
      resetOnSuccess
      className="space-y-4"
    >
      <input type="hidden" name="userId" value={userId} />
      <p className="text-sm text-muted-foreground">
        Set a new login password for {employeeName}. They will use this on the
        next sign-in.
      </p>
      <div className="space-y-2">
        <Label htmlFor={`newPassword-${userId}`}>New password</Label>
        <PasswordInput
          id={`newPassword-${userId}`}
          name="newPassword"
          minLength={8}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`confirmPassword-${userId}`}>Confirm password</Label>
        <PasswordInput
          id={`confirmPassword-${userId}`}
          name="confirmPassword"
          minLength={8}
          required
        />
      </div>
      <SubmitButton loadingText="Updating...">Update password</SubmitButton>
    </ActionForm>
  );
}
