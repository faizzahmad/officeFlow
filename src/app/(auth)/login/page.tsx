"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth-shell";
import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Welcome back to Office Flow"
      subtitle="Sign in to manage employees, attendance, payroll, tasks, and performance from one dashboard."
    >
      <Card className="border-border/80 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="font-heading text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);

              const formData = new FormData(event.currentTarget);
              const email = String(formData.get("email"));
              const password = String(formData.get("password"));

              const result = await authClient.signIn.email({
                email,
                password,
              });

              if (result.error) {
                const message = result.error.message ?? "Unable to sign in";
                setError(message);
                toast.error(message);
                setLoading(false);
                return;
              }

              toast.success("Welcome back!");
              router.push("/dashboard");
              router.refresh();
              setLoading(false);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <LoadingButton
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Signing in..."
            >
              Sign in
            </LoadingButton>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New company?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create workspace
            </Link>
            {" · "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Employee signup
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
