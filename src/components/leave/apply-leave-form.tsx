"use client";

import { useMemo, useState } from "react";

import { applyLeave } from "@/actions/leave";
import { localDateString } from "@/lib/dates";
import { ActionForm } from "@/components/action-form";
import { SubmitButton } from "@/components/submit-button";
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

type LeaveTypeOption = {
  id: string;
  name: string;
};

export function ApplyLeaveForm({
  leaveTypes,
}: {
  leaveTypes: LeaveTypeOption[];
}) {
  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const minDate = useMemo(() => localDateString(), []);
  const endMinDate = startDate && startDate > minDate ? startDate : minDate;
  const leaveTypeItems = useMemo(
    () =>
      leaveTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    [leaveTypes],
  );

  return (
    <ActionForm
      action={applyLeave}
      successMessage="Leave request submitted"
      resetOnSuccess
      onSuccess={() => {
        setLeaveTypeId("");
        setStartDate("");
        setEndDate("");
      }}
      className="space-y-4"
    >
      <input type="hidden" name="leaveTypeId" value={leaveTypeId} />
      <div className="space-y-2">
        <Label>Leave type</Label>
        <Select
          items={leaveTypeItems}
          value={leaveTypeId}
          onValueChange={(value) => {
            setLeaveTypeId(typeof value === "string" ? value : "");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Start date</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          min={minDate}
          value={startDate}
          onChange={(e) => {
            const next = e.target.value;
            setStartDate(next);
            if (endDate && endDate < next) setEndDate("");
          }}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">End date</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          min={endMinDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" name="reason" />
      </div>
      <SubmitButton loadingText="Submitting...">Submit request</SubmitButton>
    </ActionForm>
  );
}
