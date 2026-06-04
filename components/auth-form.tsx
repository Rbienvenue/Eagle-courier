"use client";

import React, { useTransition } from "react";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export function AuthForm() {
  const [error, setError] = React.useState<string>("");
  const [isPending, startTransition] = useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
      {error ? <p className="form-error">{error}</p> : null}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" defaultValue="admin@eaglecourier.rw" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" defaultValue="password123" required />
      </label>
      <button className="primary-button w-full" disabled={isPending} type="submit">
        <LogIn size={18} />
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
