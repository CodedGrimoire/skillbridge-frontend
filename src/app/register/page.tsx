"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6, "Confirm your password"),
    role: z.enum(["USER", "ADMIN", "MENTOR"]).default("USER"),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords must match",
  });

export default function RegisterPage() {
  const { register: signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      setSuccess(null);
      await signup(data.name, data.email, data.password, data.role);
      setSuccess("Account created. Redirecting...");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="sb-page py-12">
      <Card className="p-6 space-y-5 max-w-md mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-muted">Join SkillBridge AI to get tailored mentor guidance.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Full Name" htmlFor="name" error={errors.name?.message as string | undefined}>
            <Input id="name" type="text" autoComplete="name" {...register("name")} />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email?.message as string | undefined}>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message as string | undefined}>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <FormField label="Confirm Password" htmlFor="confirm" error={errors.confirm?.message as string | undefined}>
            <Input id="confirm" type="password" autoComplete="new-password" {...register("confirm")} />
          </FormField>

          <FormField label="Role" htmlFor="role" error={errors.role?.message as string | undefined}>
            <select id="role" className="sb-input" {...register("role")}>
              <option value="USER">Jobseeker</option>
              <option value="MENTOR">Mentor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-muted">Choose Mentor/Admin only if you have access.</p>
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
            {isSubmitting ? "Creating..." : "Register"}
          </Button>

          <div className="space-y-2">
            <p className="text-xs text-muted">Or continue with</p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api"}/auth/google`}>Google</Button>
              <Button type="button" variant="secondary" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api"}/auth/facebook`}>Facebook</Button>
            </div>
          </div>

          <p className="text-xs text-muted">
            Already have an account? <a href="/login" className="text-primary">Login</a>
          </p>
        </form>
      </Card>
    </div>
  );
}
