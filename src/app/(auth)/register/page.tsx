import { Suspense } from "react";

import { RegisterPageContent } from "./register-page-content";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/20">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
