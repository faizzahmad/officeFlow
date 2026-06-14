import { ArrowLeft, Building2, CreditCard, KeyRound, Phone, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { getEmployeeProfileById } from "@/actions/employee-profile";
import { SetEmployeePasswordForm } from "@/components/employees/set-employee-password-form";
import { PageHeader } from "@/components/page-header";
import { RoleGate } from "@/components/role-gate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatEmployeeDate,
  profileCompletionPercent,
} from "@/lib/employee-profile";
import { requirePermission, requireWorkspace } from "@/lib/session";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

export default async function EmployeeRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("viewEmployeeRecords");
  const { member } = await requireWorkspace();
  const { id } = await params;
  const profile = await getEmployeeProfileById(id);

  if (!profile) notFound();

  const { employee } = profile;
  const completion = profileCompletionPercent(employee);

  return (
    <div className="space-y-6">
      <PageHeader
        title={profile.userName}
        description={`Employee record · ${employee.employeeCode}`}
      >
        <ButtonLink variant="outline" href="/employee-records">
          <ArrowLeft className="size-4" />
          Back to records
        </ButtonLink>
      </PageHeader>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-16">
              {profile.userImage ? (
                <AvatarImage src={profile.userImage} alt={profile.userName} />
              ) : null}
              <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
                {getInitials(profile.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{profile.userName}</p>
              <p className="text-sm text-muted-foreground">{profile.userEmail}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {profile.memberRole}
                </Badge>
                <Badge variant="secondary">{completion}% profile complete</Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-3 text-sm sm:text-right">
            <DetailItem label="Department" value={profile.departmentName} />
            <DetailItem label="Designation" value={employee.designation} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="size-4" />
              Personal details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Phone" value={employee.phone} />
            <DetailItem
              label="Date of birth"
              value={formatEmployeeDate(employee.dateOfBirth)}
            />
            <div className="sm:col-span-2">
              <DetailItem label="Address" value={employee.address} />
            </div>
            <DetailItem label="City" value={employee.city} />
            <DetailItem label="State" value={employee.state} />
            <DetailItem label="Postal code" value={employee.postalCode} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="size-4" />
              Emergency contact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={employee.emergencyContactName} />
            <DetailItem label="Phone" value={employee.emergencyContactPhone} />
            <DetailItem
              label="Relationship"
              value={employee.emergencyContactRelation}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" />
              Bank details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="Bank name" value={employee.bankName} />
            <DetailItem
              label="Account holder"
              value={employee.bankAccountHolderName}
            />
            <DetailItem
              label="Account number"
              value={employee.bankAccountNumber}
            />
            <DetailItem label="IFSC code" value={employee.bankIfsc} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" />
              Employment
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem label="Employee code" value={employee.employeeCode} />
            <DetailItem
              label="Joining date"
              value={formatEmployeeDate(employee.joiningDate)}
            />
            <DetailItem label="Department" value={profile.departmentName} />
            <DetailItem label="Designation" value={employee.designation} />
          </CardContent>
        </Card>

        <RoleGate role={member.role} permission="manageEmployees">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="size-4" />
                Account access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SetEmployeePasswordForm
                userId={employee.userId}
                employeeName={profile.userName}
              />
            </CardContent>
          </Card>
        </RoleGate>
      </div>
    </div>
  );
}
