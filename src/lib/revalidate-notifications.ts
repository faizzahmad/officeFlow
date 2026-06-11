import { revalidatePath } from "next/cache";

export function revalidateNotificationViews() {
  revalidatePath("/notifications");
  revalidatePath("/notifications", "layout");
}
