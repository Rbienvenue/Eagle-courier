"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-button w-full" disabled={pending}>
      <LogIn size={18} />
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function AuthForm() {
  const [state, action] = React.useActionState(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" defaultValue="admin@eaglecourier.rw" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" defaultValue="password123" required />
      </label>
      <SubmitButton />
    </form>
  );
}
