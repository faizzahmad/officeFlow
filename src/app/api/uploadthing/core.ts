import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { organizationMembers, organizations, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const imageUrl = file.ufsUrl ?? file.url;

      await db
        .update(user)
        .set({ image: imageUrl })
        .where(eq(user.id, metadata.userId));

      return { url: imageUrl };
    }),

  organizationLogo: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      const [member] = await db
        .select({
          organizationId: organizationMembers.organizationId,
          role: organizationMembers.role,
        })
        .from(organizationMembers)
        .where(eq(organizationMembers.userId, session.user.id))
        .limit(1);

      if (!member || !hasPermission(member.role, "manageOrganization")) {
        throw new UploadThingError("Unauthorized");
      }

      return { organizationId: member.organizationId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const logoUrl = file.ufsUrl ?? file.url;

      await db
        .update(organizations)
        .set({ logoUrl })
        .where(eq(organizations.id, metadata.organizationId));

      return { url: logoUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
