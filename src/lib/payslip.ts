import { formatCurrency } from "@/lib/payroll";

export type PayslipViewData = {
  slipNumber: string;
  periodLabel: string;
  generatedAt: string;
  organization: {
    name: string;
    logoUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
    address: string | null;
  };
  employee: {
    name: string;
    code: string;
    department: string | null;
    designation: string | null;
  };
  bank: {
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    ifsc: string | null;
  };
  earnings: {
    baseSalary: string;
    bonus: string;
    incentives: string;
  };
  deductions: {
    leaveDeduction: string;
    lateDeduction: string;
    otherDeductions: string;
  };
  netSalary: string;
};

export function formatPayslipPeriod(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function calculatePayslipGross(data: {
  baseSalary: string;
  bonus: string;
  incentives: string;
}): number {
  return (
    Number(data.baseSalary) + Number(data.bonus) + Number(data.incentives)
  );
}

export function calculatePayslipDeductions(data: {
  leaveDeduction: string;
  lateDeduction: string;
  otherDeductions: string;
}): number {
  return (
    Number(data.leaveDeduction) +
    Number(data.lateDeduction) +
    Number(data.otherDeductions)
  );
}

export function maskPayslipAccount(value: string | null): string {
  if (!value) return "Not provided";
  if (value.length <= 4) return value;
  return `•••• •••• ${value.slice(-4)}`;
}

export function formatPayslipAmount(value: string | number): string {
  return formatCurrency(value);
}

export function hasBankDetails(bank: PayslipViewData["bank"]): boolean {
  return Boolean(
    bank.bankName &&
      bank.accountNumber &&
      bank.ifsc &&
      bank.accountHolderName,
  );
}
