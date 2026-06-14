import { jsPDF } from "jspdf";

import {
  calculatePayslipDeductions,
  calculatePayslipGross,
  formatPayslipAmount,
  hasBankDetails,
  type PayslipViewData,
} from "@/lib/payslip";

async function loadLogoDataUrl(
  logoUrl: string | null,
): Promise<{ dataUrl: string; format: "PNG" | "JPEG" } | null> {
  if (!logoUrl) return null;

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());
    const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
    const format = contentType.includes("jpeg") || contentType.includes("jpg")
      ? "JPEG"
      : "PNG";

    return { dataUrl, format };
  } catch {
    return null;
  }
}

function writeLines(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5,
) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
}

export async function generatePayslipPdf(
  data: PayslipViewData,
): Promise<Uint8Array> {
  const doc = new jsPDF();
  const margin = 16;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const logo = await loadLogoDataUrl(data.organization.logoUrl);
  if (logo) {
    doc.addImage(logo.dataUrl, logo.format, margin, y, 22, 22);
  }

  const headerX = logo ? margin + 28 : margin;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.text(data.organization.name, headerX, y + 8);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);

  let headerY = y + 14;
  if (data.organization.address) {
    headerY = writeLines(
      doc,
      data.organization.address,
      headerX,
      headerY,
      contentWidth - 70,
      4.5,
    );
  }

  const contactParts = [
    data.organization.contactEmail,
    data.organization.contactPhone,
    data.organization.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    doc.text(contactParts.join("  •  "), headerX, headerY);
    headerY += 5;
  }

  doc.setFontSize(12);
  doc.setTextColor(44, 76, 253);
  doc.text("SALARY SLIP", pageWidth - margin, y + 8, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(data.periodLabel, pageWidth - margin, y + 15, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(data.slipNumber, pageWidth - margin, y + 21, { align: "right" });
  doc.text(`Generated ${data.generatedAt}`, pageWidth - margin, y + 27, {
    align: "right",
  });

  y = Math.max(headerY, y + 32) + 6;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("EMPLOYEE DETAILS", margin, y);
  doc.text("PAYMENT SUMMARY", pageWidth / 2 + 4, y);
  y += 8;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.text(`Name: ${data.employee.name}`, margin, y);
  doc.text(`Pay period: ${data.periodLabel}`, pageWidth / 2 + 4, y);
  y += 6;
  doc.text(`Code: ${data.employee.code}`, margin, y);
  doc.text(
    `Gross: ${formatPayslipAmount(calculatePayslipGross(data.earnings))}`,
    pageWidth / 2 + 4,
    y,
  );
  y += 6;
  doc.text(`Department: ${data.employee.department ?? "—"}`, margin, y);
  doc.text(
    `Deductions: ${formatPayslipAmount(calculatePayslipDeductions(data.deductions))}`,
    pageWidth / 2 + 4,
    y,
  );
  y += 6;
  doc.text(`Designation: ${data.employee.designation ?? "—"}`, margin, y);
  doc.setTextColor(44, 76, 253);
  doc.setFontSize(12);
  doc.text(
    `Net payable: ${formatPayslipAmount(data.netSalary)}`,
    pageWidth / 2 + 4,
    y + 2,
  );

  y += 16;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const earnings = [
    ["Base salary", formatPayslipAmount(data.earnings.baseSalary)],
    ["Bonus", formatPayslipAmount(data.earnings.bonus)],
    ["Incentives", formatPayslipAmount(data.earnings.incentives)],
    ["Gross earnings", formatPayslipAmount(calculatePayslipGross(data.earnings))],
  ];

  const deductions = [
    ["Leave deduction", `- ${formatPayslipAmount(data.deductions.leaveDeduction)}`],
    ["Late deduction", `- ${formatPayslipAmount(data.deductions.lateDeduction)}`],
    [
      "Other deductions",
      `- ${formatPayslipAmount(data.deductions.otherDeductions)}`,
    ],
    [
      "Total deductions",
      `- ${formatPayslipAmount(calculatePayslipDeductions(data.deductions))}`,
    ],
  ];

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("EARNINGS", margin, y);
  doc.text("DEDUCTIONS", pageWidth / 2 + 4, y);
  y += 8;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  for (let i = 0; i < earnings.length; i += 1) {
    const rowY = y + i * 7;
    doc.text(earnings[i][0], margin, rowY);
    doc.text(earnings[i][1], margin + 78, rowY, { align: "right" });
    doc.text(deductions[i][0], pageWidth / 2 + 4, rowY);
    doc.text(deductions[i][1], pageWidth - margin, rowY, { align: "right" });
  }

  y += earnings.length * 7 + 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("BANK ACCOUNT DETAILS", margin, y);
  y += 8;

  doc.setTextColor(30, 41, 59);
  if (hasBankDetails(data.bank)) {
    doc.text(`Bank: ${data.bank.bankName}`, margin, y);
    y += 6;
    doc.text(`Account holder: ${data.bank.accountHolderName}`, margin, y);
    y += 6;
    doc.text(`Account number: ${data.bank.accountNumber}`, margin, y);
    y += 6;
    doc.text(`IFSC: ${data.bank.ifsc}`, margin, y);
  } else {
    doc.text("Bank details not provided by employee.", margin, y);
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This is a computer-generated salary slip and does not require a signature.",
    margin,
    285,
  );

  return new Uint8Array(doc.output("arraybuffer"));
}
