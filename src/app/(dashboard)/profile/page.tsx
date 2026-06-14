import { getMyEmployeeProfile } from "@/actions/employee-profile";
import {
  BankDetailsForm,
  PersonalDetailsForm,
} from "@/components/profile/employee-details-forms";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ProfileAvatarUpload } from "@/components/profile/profile-avatar-upload";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileCompletionPercent } from "@/lib/employee-profile";
import { requireWorkspace } from "@/lib/session";

export default async function ProfilePage() {
  const { session, employee, member } = await requireWorkspace();
  const profile = employee ? await getMyEmployeeProfile() : null;
  const completion = profile
    ? profileCompletionPercent(profile.employee)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="Update your photo, personal information, and bank details for payroll."
      />

      {profile ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Employee code" value={profile.employee.employeeCode} />
          <StatCard
            title="Department"
            value={profile.departmentName ?? "Unassigned"}
            accent="secondary"
          />
          <StatCard
            title="Profile completion"
            value={`${completion}%`}
            hint={completion >= 80 ? "Ready for payroll" : "Add missing details"}
            accent="brand"
          />
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile photo</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileAvatarUpload
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
            />
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">{session.user.name}</p>
              <p className="text-muted-foreground">{session.user.email}</p>
              <Badge variant="outline" className="mt-2 capitalize">
                {member.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {profile ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Contact information and emergency contact for HR records.
                  </p>
                </CardHeader>
                <CardContent>
                  <PersonalDetailsForm employee={profile.employee} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Used for salary transfers. Keep this information accurate.
                  </p>
                </CardHeader>
                <CardContent>
                  <BankDetailsForm employee={profile.employee} />
                </CardContent>
              </Card>

            </>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Your employee profile has not been set up yet. Ask your admin or
                HR team to add you as an employee.
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account security</CardTitle>
              <p className="text-sm text-muted-foreground">
                Change your login password for this workspace.
              </p>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
