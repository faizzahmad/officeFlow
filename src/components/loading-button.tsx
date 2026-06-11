"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LoadingButton({
  loading,
  loadingText,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: string;
}) {
  return (
    <Button
      className={cn("gap-2", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner className="size-4" /> : null}
      {loading ? (loadingText ?? children) : children}
    </Button>
  );
}
