"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";

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

  return (
    <div className="sb-page py-12">
      <Card className="p-6 space-y-4 max-w-md mx-auto">
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
            <p className="text-xs text-muted">Demo accounts:</p>
            {[
              { label: "Demo Mentor", email: "mentor1@example.com", password: "Passw0rd!" },
              { label: "Demo User 1", email: "user1@example.com", password: "Passw0rd!" },
              { label: "Demo User 2", email: "user2@example.com", password: "Passw0rd!" },
            ].map((d) => (
              <button
                key={d.email}
                type="button"
                className="w-full text-left text-xs text-text px-2 py-1 rounded bg-card hover:bg-primary/5"
                onClick={() => {
                  localStorage.setItem("demo_email", d.email);
                  localStorage.setItem("demo_password", d.password);
                  setDemo({ email: d.email, password: d.password });
                  setValue("email", d.email);
                  setValue("password", d.password);
                }}
              >
                {d.label} — {d.email} / {d.password}
              </button>
            ))}
          </div>
        </form>
      </Card>
    </div>
  );
}
