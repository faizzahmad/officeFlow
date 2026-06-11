"use client";

import { useActionState, useEffect, useRef } from "react";

import type { ActionResult } from "@/lib/action-result";
import { showActionToast } from "@/lib/toast-action";
import { cn } from "@/lib/utils";

type FormAction = (
  prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

export function ActionForm({
  action,
  successMessage,
  resetOnSuccess = false,
  onSuccess,
  className,
  children,
}: {
  action: FormAction;
  successMessage?: string;
  resetOnSuccess?: boolean;
  onSuccess?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;
    showActionToast(state, successMessage);
    if (state.ok) {
      if (resetOnSuccess) formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, successMessage, resetOnSuccess, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className={cn(className)}>
      {children}
    </form>
  );
}
