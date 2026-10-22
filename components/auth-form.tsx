"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function AuthForm() {
  const [error, setError] = React.useState<string>("");
  const [isPending, startTransition] = useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      let result: { error?: string } = {};
      try {
        result = await response.json();
      } catch {
        // Non-JSON response (e.g. server error page) — fall back to generic message
      }

      if (!response.ok) {
        setError(result.error ?? "Invalid email or password. Please try again.");
        return;
      }

      router.push("/dashboard");
    });
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
      {error ? <p className="form-error">{error}</p> : null}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" placeholder="you@eaglecourier.rw" autoComplete="username" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" placeholder="Your password" autoComplete="current-password" required />
      </label>
      <button className="primary-button w-full" disabled={isPending} type="submit">
        <LogIn size={18} />
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
