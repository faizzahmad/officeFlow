import {
  getLeaveBalances,
  getLeaveRequests,
  getLeaveTypes,
} from "@/actions/leave";
import { ApplyLeaveForm } from "@/components/leave/apply-leave-form";
import { LeaveBalancesTable } from "@/components/leave/leave-balances-table";
import { LeaveRequestsTable } from "@/components/leave/leave-requests-table";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRolePermissions, requireWorkspace } from "@/lib/session";

export default async function LeavePage() {
  const { member } = await requireWorkspace();
  const permissions = getRolePermissions(member.role);

  const [requests, leaveTypes, balances] = await Promise.all([
    getLeaveRequests(),
    getLeaveTypes(),
    getLeaveBalances(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave management"
        description={
          permissions.canApproveLeave
            ? "Review team leave requests, approve or reject, and track balances."
            : "Apply for leave and view your holiday balance and request history."
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Apply for leave</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplyLeaveForm
              leaveTypes={leaveTypes.map((type) => ({
                id: type.id,
                name: type.name,
              }))}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {permissions.canApproveLeave ? "Leave balances" : "My leave balance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {balances.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {permissions.canApproveLeave
                    ? "Balances appear after leave is approved."
                    : "Your leave balance is set when HR adds you to the team."}
                </p>
              ) : (
                <LeaveBalancesTable
                  data={balances}
                  showEmployee={permissions.canApproveLeave}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {permissions.canApproveLeave ? "Leave requests" : "My leave requests"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable
                data={requests}
                showEmployee={permissions.canApproveLeave}
                canApprove={permissions.canApproveLeave}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
