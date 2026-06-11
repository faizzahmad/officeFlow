"use client";

import { Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function DownloadPayslipButton({ payslipId }: { payslipId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-2"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/payslips/${payslipId}/pdf`);
          if (!response.ok) throw new Error("Download failed");

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download =
            response.headers
              .get("Content-Disposition")
              ?.split("filename=")[1]
              ?.replace(/"/g, "") ?? "payslip.pdf";
          anchor.click();
          URL.revokeObjectURL(url);
          toast.success("Payslip downloaded");
        } catch {
          toast.error("Failed to download payslip");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Spinner className="size-3.5" /> : <Download className="size-3.5" />}
      PDF
    </Button>
  );
}
