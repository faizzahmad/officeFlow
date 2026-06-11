import { jsPDF } from "jspdf";

import { formatCurrency } from "@/lib/payroll";

export type PayslipPdfData = {
  organizationName: string;
  slipNumber: string;
  employeeName: string;
  employeeCode: string;
  period: string;
  baseSalary: string;
  bonus: string;
  incentives: string;
  leaveDeduction: string;
  lateDeduction: string;
  otherDeductions: string;
  netSalary: string;
  generatedAt: string;
};

export function generatePayslipPdf(data: PayslipPdfData): Uint8Array {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFillColor(44, 76, 253);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Office Flow", margin, 18);
  doc.setFontSize(11);
  doc.text("Salary Slip", 150, 18);

  doc.setTextColor(30, 41, 59);
  y = 40;
  doc.setFontSize(10);
  doc.text(`Organization: ${data.organizationName}`, margin, y);
  y += 7;
  doc.text(`Slip No: ${data.slipNumber}`, margin, y);
  y += 7;
  doc.text(`Period: ${data.period}`, margin, y);
  y += 7;
  doc.text(`Generated: ${data.generatedAt}`, margin, y);

  y += 12;
  doc.setFontSize(12);
  doc.text("Employee Details", margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(`Name: ${data.employeeName}`, margin, y);
  y += 7;
  doc.text(`Employee Code: ${data.employeeCode}`, margin, y);

  y += 14;
  doc.setFontSize(12);
  doc.text("Earnings & Deductions", margin, y);
  y += 10;

  const rows: [string, string][] = [
    ["Base Salary", formatCurrency(data.baseSalary)],
    ["Bonus", formatCurrency(data.bonus)],
    ["Incentives", formatCurrency(data.incentives)],
    ["Leave Deduction", `- ${formatCurrency(data.leaveDeduction)}`],
    ["Late Deduction", `- ${formatCurrency(data.lateDeduction)}`],
    ["Other Deductions", `- ${formatCurrency(data.otherDeductions)}`],
  ];

  doc.setFontSize(10);
  for (const [label, value] of rows) {
    doc.text(label, margin, y);
    doc.text(value, 150, y, { align: "right" });
    y += 8;
  }

  y += 4;
  doc.setDrawColor(44, 76, 253);
  doc.line(margin, y, 190, y);
  y += 10;
  doc.setFontSize(13);
  doc.setTextColor(44, 76, 253);
  doc.text("Net Salary", margin, y);
  doc.text(formatCurrency(data.netSalary), 150, y, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(
    "This is a computer-generated payslip and does not require a signature.",
    margin,
    285,
  );

  return new Uint8Array(doc.output("arraybuffer"));
}
