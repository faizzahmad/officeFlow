"use client";

import { Building2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UploadButton } from "@/lib/uploadthing";

export function OrganizationLogoUpload({
  organizationName,
  logoUrl,
}: {
  organizationName: string;
  logoUrl?: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(logoUrl ?? null);

  useEffect(() => {
    setPreview(logoUrl ?? null);
  }, [logoUrl]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
        {preview ? (
          <Image
            src={preview}
            alt={`${organizationName} logo`}
            width={80}
            height={80}
            className="size-full object-contain p-2"
          />
        ) : (
          <Building2 className="size-8 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-2">
        <UploadButton
          endpoint="organizationLogo"
          appearance={{
            button:
              "inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground ut-uploading:opacity-60",
            allowedContent: "text-xs text-muted-foreground",
            container: "w-fit",
          }}
          content={{
            button({ ready, isUploading }) {
              if (isUploading) return "Uploading...";
              if (!ready) return "Loading...";
              return preview ? "Change logo" : "Upload logo";
            },
          }}
          onClientUploadComplete={async (files) => {
            const url = files[0]?.ufsUrl ?? files[0]?.url;
            if (!url) {
              toast.error("Upload finished but no logo URL was returned");
              return;
            }
            setPreview(url);
            toast.success("Company logo updated");
            router.refresh();
          }}
          onUploadError={(error) => {
            toast.error(error.message);
          }}
        />
        <p className="text-xs text-muted-foreground">
          Shown on salary slips and company documents. PNG or JPG up to 2 MB.
        </p>
      </div>
    </div>
  );
}
