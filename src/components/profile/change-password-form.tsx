"use client";

import { useState } from "react";
import { toast } from "sonner";

import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const currentPassword = String(formData.get("currentPassword") ?? "");
        const newPassword = String(formData.get("newPassword") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match");
          setLoading(false);
          return;
        }

        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          toast.error(error.message ?? "Could not change password");
          setLoading(false);
          return;
        }

        toast.success("Password changed successfully");
        event.currentTarget.reset();
        setLoading(false);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordInput id="currentPassword" name="currentPassword" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput id="newPassword" name="newPassword" minLength={8} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          minLength={8}
          required
        />
      </div>
      <LoadingButton type="submit" loading={loading} loadingText="Updating...">
        Change password
      </LoadingButton>
    </form>
  );
}
