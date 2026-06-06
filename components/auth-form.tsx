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

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Invalid email or password.");
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
