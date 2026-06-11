"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Join your company on Office Flow"
      subtitle="Create your employee account. After signup, ask your HR admin to add your email to the company workspace."
    >
      <Card className="border-border/80 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="font-heading text-2xl">Employee signup</CardTitle>
          <CardDescription>
            Use the same email your HR team will add to the company
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

              const signUp = await authClient.signUp.email({
                name,
                email,
                password,
              });

              if (signUp.error) {
                const message = signUp.error.message ?? "Unable to sign up";
                setError(message);
                toast.error(message);
                setLoading(false);
                return;
              }

              toast.success("Account created! Ask HR to add you to the team.");
              router.push("/pending");
              router.refresh();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
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
            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <LoadingButton
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Creating account..."
            >
              Create employee account
            </LoadingButton>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Starting a new company?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Create workspace
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
    </AuthShell>
  );
}
