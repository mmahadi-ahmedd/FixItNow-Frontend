"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { apiClient, getErrorMessage } from "@/lib/api-client";
import { getCurrentUser } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleRedirect = (role: string, name: string) => {
    toast.success(`Welcome back, ${name}!`);
    if (role === "ADMIN") router.push("/auth/dashboard/admin");
    else if (role === "TECHNICIAN") router.push("/auth/dashboard/technician");
    else router.push("/auth/dashboard/customer");
  };

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/login", data);
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Login succeeded but could not fetch user. Please try again.");
        return;
      }
      handleRedirect(user.role, user.name);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await apiClient.post("/auth/login", {
        email: "admin@fixitnow.com",
        password: "Admin@123",
      });
      const user = await getCurrentUser();
      if (!user) {
        toast.error("Demo login failed. Please try again.");
        return;
      }
      handleRedirect(user.role, user.name);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-lg">FixItNow</span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to your FixItNow account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Demo Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-2"
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
          >
            {isDemoLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              "⚡"
            )}
            {isDemoLoading ? "Logging in as Admin..." : "Demo Login (Admin)"}
          </Button>

          {/* Google Login Button (UI only) */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled
            title="Google login coming soon"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
            <span className="text-xs text-gray-400 ml-1">(Coming soon)</span>
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 px-2 text-xs text-gray-400">
              or login with email
            </span>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Admin: admin@fixitnow.com / Admin@123</p>
            <p>Customer: customer@fixitnow.com / Customer@123</p>
            <p>Technician: technician@fixitnow.com / Tech@123</p>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm text-gray-500 gap-1">
          Dont have an account?
          <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}