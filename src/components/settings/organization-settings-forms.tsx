"use client";

import {
  updateOrganizationSettingsFormAction,
  updateWorkSettingsFormAction,
} from "@/actions/organization-settings";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { organizations, workSettings } from "@/db/schema";

type Organization = typeof organizations.$inferSelect;
type WorkSettings = typeof workSettings.$inferSelect;

export function OrganizationSettingsForm({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <ActionForm
      action={updateOrganizationSettingsFormAction}
      successMessage="Organization settings saved"
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" name="name" defaultValue={organization.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          defaultValue={organization.contactEmail ?? ""}
          placeholder="hr@company.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact phone</Label>
        <Input
          id="contactPhone"
          name="contactPhone"
          type="tel"
          defaultValue={organization.contactPhone ?? ""}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          defaultValue={organization.website ?? ""}
          placeholder="https://company.com"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="address">Office address</Label>
        <Textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={organization.address ?? ""}
        />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton loadingText="Saving...">Save organization</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function WorkSettingsForm({
  settings,
}: {
  settings: WorkSettings | null;
}) {
  return (
    <ActionForm
      action={updateWorkSettingsFormAction}
      successMessage="Work policies saved"
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2">
        <Label htmlFor="workStartHour">Work start hour</Label>
        <Input
          id="workStartHour"
          name="workStartHour"
          type="number"
          min={0}
          max={23}
          defaultValue={settings?.workStartHour ?? 9}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workStartMinute">Work start minute</Label>
        <Input
          id="workStartMinute"
          name="workStartMinute"
          type="number"
          min={0}
          max={59}
          defaultValue={settings?.workStartMinute ?? 0}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workEndHour">Work end hour</Label>
        <Input
          id="workEndHour"
          name="workEndHour"
          type="number"
          min={0}
          max={23}
          defaultValue={settings?.workEndHour ?? 18}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workEndMinute">Work end minute</Label>
        <Input
          id="workEndMinute"
          name="workEndMinute"
          type="number"
          min={0}
          max={59}
          defaultValue={settings?.workEndMinute ?? 0}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lateGraceMinutes">Late grace (minutes)</Label>
        <Input
          id="lateGraceMinutes"
          name="lateGraceMinutes"
          type="number"
          min={0}
          defaultValue={settings?.lateGraceMinutes ?? 15}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="halfDayHours">Half day threshold (hours)</Label>
        <Input
          id="halfDayHours"
          name="halfDayHours"
          type="number"
          min={1}
          step="0.5"
          defaultValue={settings?.halfDayHours ?? "4"}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <p className="mb-3 text-xs text-muted-foreground">
          These rules drive attendance status calculations for check-in and
          check-out.
        </p>
        <SubmitButton loadingText="Saving...">Save work policies</SubmitButton>
      </div>
    </ActionForm>
  );
}
