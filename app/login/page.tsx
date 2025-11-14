"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validation schema
const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-border bg-surface shadow-2xl transition-all duration-150 ease-in-out hover:border-border-emphasis hover:shadow-lg">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-text-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-text-secondary">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <Alert
                variant="destructive"
                className="border-error/20 bg-error/10 text-error"
              >
                {error}
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-text-primary"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="artist@example.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                className={`
                  h-12 rounded-button border-border bg-surface-elevated 
                  px-4 text-text-primary placeholder:text-text-muted
                  transition-all duration-150 ease
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${
                    errors.email
                      ? "border-error focus:border-error focus:ring-error/20"
                      : ""
                  }
                `}
              />
              {errors.email && (
                <p className="text-sm font-medium text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-text-primary"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                {...register("password")}
                className={`
                  h-12 rounded-button border-border bg-surface-elevated 
                  px-4 text-text-primary placeholder:text-text-muted
                  transition-all duration-150 ease
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  disabled:cursor-not-allowed disabled:opacity-50
                  ${
                    errors.password
                      ? "border-error focus:border-error focus:ring-error/20"
                      : ""
                  }
                `}
              />
              {errors.password && (
                <p className="text-sm font-medium text-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full h-12 rounded-button bg-primary font-semibold text-primary-foreground transition-all duration-150 ease-in-out hover:bg-primary-hover hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
