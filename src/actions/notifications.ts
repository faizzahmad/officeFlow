"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { revalidateNotificationViews } from "@/lib/revalidate-notifications";
import { requireWorkspace } from "@/lib/session";

export async function getNotifications() {
  const { organization, session } = await requireWorkspace();

  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.organizationId, organization.id),
        eq(notifications.userId, session.user.id),
      ),
    )
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function markNotificationRead(id: string) {
  const { session } = await requireWorkspace();

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
    );

  revalidateNotificationViews();
  return { success: true };
}

export async function getUnreadCount() {
  const { organization, session } = await requireWorkspace();

  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.organizationId, organization.id),
        eq(notifications.userId, session.user.id),
        eq(notifications.isRead, false),
      ),
    );

  return result?.count ?? 0;
}
