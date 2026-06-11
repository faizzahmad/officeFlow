import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leaveBalances, leaveTypes } from "@/db/schema";

export async function seedLeaveBalancesForEmployee(
  organizationId: string,
  employeeId: string,
) {
  const year = new Date().getFullYear();
  const types = await db
    .select()
    .from(leaveTypes)
    .where(eq(leaveTypes.organizationId, organizationId));

  if (types.length === 0) return;

  await db.insert(leaveBalances).values(
    types.map((type) => ({
      organizationId,
      employeeId,
      leaveTypeId: type.id,
      year,
      totalDays: type.defaultDays,
      usedDays: 0,
    })),
  );
}
