"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const { register: signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      await signup(data.name, data.email, data.password);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              type="text"
              {...register("name")}
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2"
              type="email"
              {...register("email")}
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
            {isSubmitting ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
