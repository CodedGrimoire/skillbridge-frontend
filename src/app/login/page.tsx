"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertTriangle, LogIn } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [demo, setDemo] = useState<{ email: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    const email = localStorage.getItem("demo_email");
    const password = localStorage.getItem("demo_password");
    if (email && password) {
      setDemo({ email, password });
      setValue("email", email);
      setValue("password", password);
    }
  }, [setValue]);

  const demoAccounts = [
    { label: "Demo Admin", email: "mentor1@example.com", password: "Passw0rd!" },
    { label: "Demo User", email: "user1@example.com", password: "Passw0rd!" },
  ];

  const fillDemo = (d: { email: string; password: string }) => {
    localStorage.setItem("demo_email", d.email);
    localStorage.setItem("demo_password", d.password);
    setDemo(d);
    setValue("email", d.email);
    setValue("password", d.password);
  };

  const socialBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      setSuccess(null);
      await login(data.email, data.password);
      setSuccess("Signed in successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    }
  };

  const socialLogin = (provider: "google" | "facebook") => {
    window.location.href = `${socialBase}/auth/${provider}`;
  };

  return (
    <div className="sb-page py-12">
      <Card className="p-6 space-y-5 max-w-md mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted">Access your SkillBridge AI dashboard.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Email" htmlFor="email" error={errors.email?.message as string | undefined}>
            <Input id="email" type="email" autoComplete="email" {...register("email")}/>
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message as string | undefined}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-text"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          {error && (
            <p className="flex items-center gap-2 text-sm text-danger">
              <AlertTriangle size={16} /> {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 size={16} /> {success}
            </p>
          )}

          <Button className="w-full" loading={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <div className="space-y-2">
            <p className="text-xs text-muted">Demo logins</p>
            <div className="grid gap-2">
              {demoAccounts.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  className="w-full text-left text-xs text-text px-2 py-2 rounded bg-card hover:bg-primary/5"
                  onClick={() => fillDemo(d)}
                >
                  {d.label} — {d.email}
                </button>
              ))}
            </div>
            {demo && (
              <Button variant="secondary" className="w-full" onClick={() => handleSubmit(onSubmit)()}>
                <LogIn className="h-4 w-4" /> Use demo credentials
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted">Continue with</p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={() => socialLogin("google")}>Google</Button>
              <Button type="button" variant="secondary" onClick={() => socialLogin("facebook")}>Facebook</Button>
            </div>
            <p className="text-xs text-muted">We’ll redirect to the provider and back here.</p>
          </div>

          <p className="text-xs text-muted">
            New here? <a href="/register" className="text-primary">Create an account</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
