"use server";

import { reviewLeave } from "@/actions/leave";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";

export async function approveLeaveFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return actionError("Leave request not found");

  const result = await reviewLeave(requestId, "approved");
  if (!result.ok) return result;
  return actionSuccess("Leave request approved");
}

export async function rejectLeaveFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const requestId = String(formData.get("requestId") ?? "");
  if (!requestId) return actionError("Leave request not found");

  const result = await reviewLeave(requestId, "rejected");
  if (!result.ok) return result;
  return actionSuccess("Leave request rejected");
}
