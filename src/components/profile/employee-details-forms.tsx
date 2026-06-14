"use client";

import {
  updateBankDetailsFormAction,
  updatePersonalDetailsFormAction,
} from "@/actions/employee-profile";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { employees } from "@/db/schema";

type EmployeeRecord = typeof employees.$inferSelect;

export function PersonalDetailsForm({
  employee,
}: {
  employee: EmployeeRecord;
}) {
  return (
    <ActionForm
      action={updatePersonalDetailsFormAction}
      successMessage="Personal details saved"
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={employee.phone ?? ""}
          placeholder="+91 98765 43210"
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          rows={2}
          defaultValue={employee.address ?? ""}
          placeholder="Street, area, landmark"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" defaultValue={employee.city ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" defaultValue={employee.state ?? ""} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal code</Label>
        <Input
          id="postalCode"
          name="postalCode"
          defaultValue={employee.postalCode ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          defaultValue={employee.dateOfBirth ?? ""}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <p className="text-sm font-medium">Emergency contact</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContactName">Contact name</Label>
        <Input
          id="emergencyContactName"
          name="emergencyContactName"
          defaultValue={employee.emergencyContactName ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyContactPhone">Contact phone</Label>
        <Input
          id="emergencyContactPhone"
          name="emergencyContactPhone"
          type="tel"
          defaultValue={employee.emergencyContactPhone ?? ""}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="emergencyContactRelation">Relationship</Label>
        <Input
          id="emergencyContactRelation"
          name="emergencyContactRelation"
          defaultValue={employee.emergencyContactRelation ?? ""}
          placeholder="Spouse, parent, sibling..."
        />
      </div>

      <div className="sm:col-span-2">
        <SubmitButton loadingText="Saving...">Save personal details</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function BankDetailsForm({ employee }: { employee: EmployeeRecord }) {
  return (
    <ActionForm
      action={updateBankDetailsFormAction}
      successMessage="Bank details saved"
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="bankName">Bank name</Label>
        <Input
          id="bankName"
          name="bankName"
          defaultValue={employee.bankName ?? ""}
          placeholder="HDFC Bank, SBI..."
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="bankAccountHolderName">Account holder name</Label>
        <Input
          id="bankAccountHolderName"
          name="bankAccountHolderName"
          defaultValue={employee.bankAccountHolderName ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankAccountNumber">Account number</Label>
        <Input
          id="bankAccountNumber"
          name="bankAccountNumber"
          defaultValue={employee.bankAccountNumber ?? ""}
          inputMode="numeric"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankIfsc">IFSC code</Label>
        <Input
          id="bankIfsc"
          name="bankIfsc"
          defaultValue={employee.bankIfsc ?? ""}
          placeholder="HDFC0001234"
          className="uppercase"
        />
      </div>

      <div className="sm:col-span-2">
        <p className="mb-3 text-xs text-muted-foreground">
          Bank details are used for payroll. Only you and organization admins can
          view this information.
        </p>
        <SubmitButton loadingText="Saving...">Save bank details</SubmitButton>
      </div>
    </ActionForm>
  );
}
