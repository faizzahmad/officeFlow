"use server";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { notifications, organizationMembers, user } from "@/db/schema";
import { emailLayout, sendEmail } from "@/lib/email";

type NotificationType =
  | "task_assigned"
  | "leave_update"
  | "salary_generated"
  | "attendance"
  | "general";

type NotifyUserInput = {
  organizationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  emailSubject?: string;
  emailBody?: string;
};

export async function notifyUser(input: NotifyUserInput) {
  await db.insert(notifications).values({
    organizationId: input.organizationId,
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
  });

  const [recipient] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, input.userId))
    .limit(1);

  if (!recipient?.email) return;

  void sendEmail({
    to: recipient.email,
    subject: input.emailSubject ?? input.title,
    html: emailLayout({
      title: input.title,
      body: input.emailBody ?? input.message,
      ctaLabel: input.link ? "Open in Office Flow" : undefined,
      ctaUrl: input.link,
    }),
  }).catch((error) => {
    console.error("[notify] email failed", error);
  });
}

export async function notifyRoles({
  organizationId,
  roles,
  ...rest
}: Omit<NotifyUserInput, "userId"> & {
  roles: Array<"admin" | "hr" | "manager">;
}) {
  const members = await db
    .select({ userId: organizationMembers.userId })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        inArray(organizationMembers.role, roles),
      ),
    );

  for (const member of members) {
    await notifyUser({
      organizationId,
      userId: member.userId,
      ...rest,
    });
  }
}
