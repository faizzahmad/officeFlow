import { notFound } from "next/navigation";

import { getPayslipById } from "@/actions/payroll";
import { DownloadPayslipButton } from "@/components/download-payslip-button";
import { PageHeader } from "@/components/page-header";
import { PayslipDocument } from "@/components/payroll/payslip-document";
import { ButtonLink } from "@/components/ui/button";

export default async function PayslipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payslip = await getPayslipById(id);
  if (!payslip) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary slip"
        description={`${payslip.employee.name} · ${payslip.periodLabel}`}
      >
        <div className="flex flex-wrap gap-2">
          <ButtonLink variant="outline" href="/payroll">
            Back to payroll
          </ButtonLink>
          <DownloadPayslipButton payslipId={id} />
        </div>
      </PageHeader>

      <div className="mx-auto max-w-4xl">
        <PayslipDocument data={payslip} />
      </div>
    </div>
  );
}
