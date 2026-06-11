"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { setupWorkspace } from "@/actions/onboarding";
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

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Card className="border-border/80 shadow-lg shadow-primary/5">
      <CardHeader className="space-y-1">
        <CardTitle className="font-heading text-2xl">Create workspace</CardTitle>
        <CardDescription>
          Set up your company and admin account
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
            const name = String(formData.get("name"));
            const email = String(formData.get("email"));
            const password = String(formData.get("password"));
            const companyName = String(formData.get("companyName"));

            const signUp = await authClient.signUp.email({
              name,
              email,
              password,
            });

            if (signUp.error) {
              const message = signUp.error.message ?? "Unable to register";
              setError(message);
              toast.error(message);
              setLoading(false);
              return;
            }

            const setupForm = new FormData();
            setupForm.set("companyName", companyName);
            const setupResult = await setupWorkspace(setupForm);

            if (setupResult.error) {
              setError(setupResult.error);
              toast.error(setupResult.error);
              setLoading(false);
              return;
            }

            toast.success("Workspace created successfully");
            router.push("/dashboard");
            router.refresh();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" className="h-10" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="h-10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" name="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              name="companyName"
              className="h-10"
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
            loadingText="Creating workspace..."
          >
            Create workspace
          </LoadingButton>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Joining an existing company?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Employee signup
          </Link>
          {" · "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export function SetupWorkspaceForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Card className="border-border/80 shadow-lg shadow-primary/5">
      <CardHeader className="space-y-1">
        <CardTitle className="font-heading text-2xl">Finish setup</CardTitle>
        <CardDescription>
          Create your company workspace to continue
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
            const result = await setupWorkspace(formData);
            if (result.error) {
              setError(result.error);
              toast.error(result.error);
              setLoading(false);
              return;
            }
            toast.success("Workspace created successfully");
            router.push("/dashboard");
            router.refresh();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              name="companyName"
              className="h-10"
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
            loadingText="Creating..."
          >
            Create workspace
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
