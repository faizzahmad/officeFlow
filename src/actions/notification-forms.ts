"use server";

import { markNotificationRead } from "@/actions/notifications";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";

export async function markNotificationReadFormAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("notificationId") ?? "");
  if (!id) return actionError("Notification not found");

  await markNotificationRead(id);
  return actionSuccess("Marked as read");
}
