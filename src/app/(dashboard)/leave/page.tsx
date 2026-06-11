import {
  approveLeaveFormAction,
  rejectLeaveFormAction,
} from "@/actions/leave-forms";
import {
  getLeaveBalances,
  getLeaveRequests,
  getLeaveTypes,
} from "@/actions/leave";
import { ActionForm } from "@/components/action-form";
import { ApplyLeaveForm } from "@/components/leave/apply-leave-form";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      {permissions.canApproveLeave ? (
                        <TableHead>Employee</TableHead>
                      ) : null}
                      <TableHead>Type</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((row) => (
                      <TableRow key={row.balance.id}>
                        {permissions.canApproveLeave ? (
                          <TableCell>{row.userName}</TableCell>
                        ) : null}
                        <TableCell>{row.leaveType}</TableCell>
                        <TableCell>{row.balance.usedDays}</TableCell>
                        <TableCell>{row.balance.totalDays}</TableCell>
                        <TableCell>
                          {row.balance.totalDays - row.balance.usedDays}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    {permissions.canApproveLeave ? (
                      <TableHead>Employee</TableHead>
                    ) : null}
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((row) => (
                    <TableRow key={row.request.id}>
                      {permissions.canApproveLeave ? (
                        <TableCell>{row.userName}</TableCell>
                      ) : null}
                      <TableCell>{row.leaveType}</TableCell>
                      <TableCell>
                        {row.request.startDate} → {row.request.endDate}
                      </TableCell>
                      <TableCell>{row.request.days}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.request.status}</Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {row.request.status === "pending" &&
                        permissions.canApproveLeave ? (
                          <>
                            <ActionForm
                              action={approveLeaveFormAction}
                              successMessage="Leave request approved"
                              className="inline"
                            >
                              <input
                                type="hidden"
                                name="requestId"
                                value={row.request.id}
                              />
                              <SubmitButton size="sm" loadingText="Approving...">
                                Approve
                              </SubmitButton>
                            </ActionForm>
                            <ActionForm
                              action={rejectLeaveFormAction}
                              successMessage="Leave request rejected"
                              className="inline"
                            >
                              <input
                                type="hidden"
                                name="requestId"
                                value={row.request.id}
                              />
                              <SubmitButton
                                size="sm"
                                variant="outline"
                                loadingText="Rejecting..."
                              >
                                Reject
                              </SubmitButton>
                            </ActionForm>
                          </>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
