import { getEmployeeProfiles } from "@/actions/employee-profile";
import { EmployeeRecordsTable } from "@/components/employee-records/employee-records-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { profileCompletionPercent } from "@/lib/employee-profile";
import { requirePermission } from "@/lib/session";

export default async function EmployeeRecordsPage() {
  await requirePermission("viewEmployeeRecords");
  const profiles = await getEmployeeProfiles();

  const completeProfiles = profiles.filter(
    (row) => profileCompletionPercent(row.employee) >= 80,
  ).length;
  const withBankDetails = profiles.filter(
    (row) => row.employee.bankAccountNumber,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee records"
        description="View personal and bank details submitted by your team for payroll and HR."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total employees" value={profiles.length} />
        <StatCard
          title="Profiles 80%+ complete"
          value={completeProfiles}
          accent="brand"
        />
        <StatCard title="Bank details added" value={withBankDetails} />
      </div>

      <EmployeeRecordsTable data={profiles} />
    </div>
  );
}
