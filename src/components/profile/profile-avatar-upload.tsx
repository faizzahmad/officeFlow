"use client";

import { Camera, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileAvatarUpload({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(image ?? null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    setPreview(image ?? null);
  }, [image]);

  async function removePhoto() {
    setRemoving(true);
    try {
      const { error } = await authClient.updateUser({ image: null });
      if (error) {
        toast.error(error.message ?? "Could not remove photo");
        return;
      }

      setPreview(null);
      toast.success("Profile photo removed");
      router.refresh();
    } catch {
      toast.error("Could not remove photo");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <Avatar size="lg" className="size-24">
        {preview ? <AvatarImage src={preview} alt={name} /> : null}
        <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-3">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <UploadButton
            endpoint="profileImage"
            appearance={{
              button: cn(
                "inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground",
                "transition-colors hover:bg-primary/90 ut-uploading:cursor-not-allowed ut-uploading:opacity-60",
              ),
              allowedContent: "text-xs text-muted-foreground",
              container: "w-fit",
            }}
            content={{
              button({ ready, isUploading }) {
                if (isUploading) return "Uploading...";
                if (!ready) return "Loading...";
                return (
                  <>
                    <Camera className="size-4" />
                    Upload photo
                  </>
                );
              },
            }}
            onClientUploadComplete={async (files) => {
              const url = files[0]?.ufsUrl ?? files[0]?.url;
              if (!url) {
                toast.error("Upload finished but no image URL was returned");
                return;
              }

              const { error } = await authClient.updateUser({ image: url });
              if (error) {
                toast.error(error.message ?? "Could not save profile photo");
                return;
              }

              setPreview(url);
              toast.success("Profile photo updated");
              router.refresh();
            }}
            onUploadError={(error) => {
              toast.error(error.message);
            }}
          />

          {preview ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={removing}
              onClick={() => void removePhoto()}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground">
          JPG, PNG, or WebP up to 4 MB.
        </p>
      </div>
    </div>
  );
}
