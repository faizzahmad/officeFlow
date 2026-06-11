type PayrollInput = {
  baseSalary: number;
  bonus?: number;
  incentives?: number;
  leaveDeduction?: number;
  lateDeduction?: number;
  otherDeductions?: number;
};

export function calculateNetSalary({
  baseSalary,
  bonus = 0,
  incentives = 0,
  leaveDeduction = 0,
  lateDeduction = 0,
  otherDeductions = 0,
}: PayrollInput): number {
  const gross = baseSalary + bonus + incentives;
  const deductions = leaveDeduction + lateDeduction + otherDeductions;
  return Math.max(0, Math.round((gross - deductions) * 100) / 100);
}

export function formatCurrency(amount: string | number, currency = "INR"): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateSlipNumber(
  year: number,
  month: number,
  employeeCode: string,
): string {
  const monthStr = String(month).padStart(2, "0");
  return `SLIP-${year}${monthStr}-${employeeCode}`;
}
