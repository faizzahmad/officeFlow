import { actionError, type ActionResult } from "@/lib/action-result";

export function toActionDbError(error: unknown): ActionResult {
  console.error("[database]", error);

  const message =
    error instanceof Error ? error.message : "Unknown database error";

  if (
    message.includes("fetch failed") ||
    message.includes("Error connecting to database")
  ) {
    return actionError(
      "Could not connect to the database. Check your network and DATABASE_URL, then try again.",
    );
  }

  return actionError("Something went wrong while saving. Please try again.");
}
