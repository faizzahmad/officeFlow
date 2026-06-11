import { toast } from "sonner";

import type { ActionResult } from "@/lib/action-result";

export function showActionToast(
  result: ActionResult | null | undefined,
  fallbackSuccess = "Saved successfully",
) {
  if (!result) return;
  if (result.ok) {
    toast.success(result.message ?? fallbackSuccess);
  } else {
    toast.error(result.error);
  }
}
