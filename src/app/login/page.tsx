"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
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
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              type="email"
              {...register("email")}
              defaultValue={demo?.email}
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 pr-10"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                defaultValue={demo?.password}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm">{errors.password.message as string}</p>}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Demo accounts:</p>
            {[
              { label: "Demo Mentor", email: "mentor1@example.com", password: "Passw0rd!" },
              { label: "Demo User 1", email: "user1@example.com", password: "Passw0rd!" },
              { label: "Demo User 2", email: "user2@example.com", password: "Passw0rd!" },
            ].map((d) => (
              <button
                key={d.email}
                type="button"
                className="w-full text-left text-xs text-slate-200 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
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
      </div>
    </div>
  );
}
