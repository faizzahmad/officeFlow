"use client";

import { useSearchParams } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";

import { RegisterForm, SetupWorkspaceForm } from "./register-form";

export function RegisterPageContent() {
  const searchParams = useSearchParams();
  const setupOnly = searchParams.get("setup") === "required";

  if (setupOnly) {
    return (
      <AuthShell
        title="Almost there"
        subtitle="Create your company workspace to unlock employees, attendance, payroll, and tasks."
      >
        <SetupWorkspaceForm />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Start your Office Flow workspace"
      subtitle="Create your company account and launch HRMS, payroll, attendance, and task management in minutes."
    >
      <RegisterForm />
    </AuthShell>
  );
}
