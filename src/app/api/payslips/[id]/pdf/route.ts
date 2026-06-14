import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { getPayslipById } from "@/actions/payroll";
import { generatePayslipPdf } from "@/lib/payslip-pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const payslip = await getPayslipById(id);

  if (!payslip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await generatePayslipPdf(payslip);

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${payslip.slipNumber}.pdf"`,
    },
  });
}
