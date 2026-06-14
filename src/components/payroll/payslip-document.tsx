import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  calculatePayslipDeductions,
  calculatePayslipGross,
  formatPayslipAmount,
  hasBankDetails,
  type PayslipViewData,
} from "@/lib/payslip";
import { cn } from "@/lib/utils";

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

function AmountRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border/60 py-3 last:border-b-0",
        emphasis && "font-semibold",
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm", emphasis && "text-base text-primary")}>
        {value}
      </span>
    </div>
  );
}

export function PayslipDocument({
  data,
  className,
}: {
  data: PayslipViewData;
  className?: string;
}) {
  const gross = calculatePayslipGross(data.earnings);
  const totalDeductions = calculatePayslipDeductions(data.deductions);
  const bankReady = hasBankDetails(data.bank);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm print:rounded-none print:border print:shadow-none",
        className,
      )}
    >
      <header className="border-b bg-muted/30 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background">
              {data.organization.logoUrl ? (
                <Image
                  src={data.organization.logoUrl}
                  alt={`${data.organization.name} logo`}
                  width={64}
                  height={64}
                  className="size-full object-contain p-2"
                />
              ) : (
                <span className="font-heading text-lg font-bold text-primary">
                  {data.organization.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-bold">
                {data.organization.name}
              </h2>
              {data.organization.address ? (
                <p className="max-w-md text-sm text-muted-foreground">
                  {data.organization.address}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {data.organization.contactEmail ? (
                  <span>{data.organization.contactEmail}</span>
                ) : null}
                {data.organization.contactPhone ? (
                  <span>{data.organization.contactPhone}</span>
                ) : null}
                {data.organization.website ? (
                  <span>{data.organization.website}</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <Badge className="mb-2">Salary slip</Badge>
            <p className="font-heading text-lg font-semibold">
              {data.periodLabel}
            </p>
            <p className="text-sm text-muted-foreground">{data.slipNumber}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Generated {data.generatedAt}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 border-b px-6 py-6 sm:grid-cols-2 sm:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Employee details
          </p>
          <DetailBlock label="Name" value={data.employee.name} />
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailBlock label="Employee code" value={data.employee.code} />
            <DetailBlock label="Department" value={data.employee.department} />
          </div>
          <DetailBlock label="Designation" value={data.employee.designation} />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Payment summary
          </p>
          <DetailBlock label="Pay period" value={data.periodLabel} />
          <DetailBlock label="Gross earnings" value={formatPayslipAmount(gross)} />
          <DetailBlock
            label="Total deductions"
            value={formatPayslipAmount(totalDeductions)}
          />
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Net payable
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-primary">
              {formatPayslipAmount(data.netSalary)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Earnings
          </p>
          <AmountRow
            label="Base salary"
            value={formatPayslipAmount(data.earnings.baseSalary)}
          />
          <AmountRow
            label="Bonus"
            value={formatPayslipAmount(data.earnings.bonus)}
          />
          <AmountRow
            label="Incentives"
            value={formatPayslipAmount(data.earnings.incentives)}
          />
          <AmountRow
            label="Gross earnings"
            value={formatPayslipAmount(gross)}
            emphasis
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Deductions
          </p>
          <AmountRow
            label="Leave deduction"
            value={`- ${formatPayslipAmount(data.deductions.leaveDeduction)}`}
          />
          <AmountRow
            label="Late deduction"
            value={`- ${formatPayslipAmount(data.deductions.lateDeduction)}`}
          />
          <AmountRow
            label="Other deductions"
            value={`- ${formatPayslipAmount(data.deductions.otherDeductions)}`}
          />
          <AmountRow
            label="Total deductions"
            value={`- ${formatPayslipAmount(totalDeductions)}`}
            emphasis
          />
        </div>
      </div>

      <footer className="border-t bg-muted/20 px-6 py-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bank account details
          </p>
          <Badge variant={bankReady ? "outline" : "secondary"}>
            {bankReady ? "Verified for transfer" : "Details pending"}
          </Badge>
        </div>

        {bankReady ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailBlock label="Bank name" value={data.bank.bankName} />
            <DetailBlock
              label="Account holder"
              value={data.bank.accountHolderName}
            />
            <DetailBlock
              label="Account number"
              value={data.bank.accountNumber}
            />
            <DetailBlock label="IFSC code" value={data.bank.ifsc} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bank details were not provided. Ask the employee to update their
            profile before the next payroll run.
          </p>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          This is a computer-generated salary slip and does not require a
          signature.
        </p>
      </footer>
    </article>
  );
}
