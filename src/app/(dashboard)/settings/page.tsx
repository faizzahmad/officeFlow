import { getOrganizationSettings } from "@/actions/organization-settings";
import { PageHeader } from "@/components/page-header";
import { OrganizationLogoUpload } from "@/components/settings/organization-logo-upload";
import {
  OrganizationSettingsForm,
  WorkSettingsForm,
} from "@/components/settings/organization-settings-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requirePermission } from "@/lib/session";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  await requirePermission("manageOrganization");
  const data = await getOrganizationSettings();
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization settings"
        description="Manage your company profile, contact details, and workplace policies."
      />

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Company profile</TabsTrigger>
          <TabsTrigger value="policies">Work policies</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Company profile</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update how your organization appears on payslips and across the CRM.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <OrganizationLogoUpload
                organizationName={data.organization.name}
                logoUrl={data.organization.logoUrl}
              />
              <OrganizationSettingsForm organization={data.organization} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Work policies</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure standard work hours and attendance rules for your team.
              </p>
            </CardHeader>
            <CardContent>
              <WorkSettingsForm settings={data.workSettings} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
