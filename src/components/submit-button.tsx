"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  loadingText,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  loadingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn("gap-2", className)}
      disabled={pending || props.disabled}
      aria-disabled={pending || props.disabled}
      {...props}
    >
      {pending ? <Spinner className="size-4" /> : null}
      {pending && loadingText ? loadingText : children}
    </Button>
  );
}
