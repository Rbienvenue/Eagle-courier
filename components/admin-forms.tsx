"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Building2, UserPlus } from "lucide-react";
import { createBranchAction, createUserAction } from "@/app/actions/admin";
import { useActionStateFallback } from "@/lib/action-state";

type Branch = {
  id: string;
  name: string;
};

function BranchButton() {
  const { pending } = useFormStatus();
  return (
    <button className="secondary-button" disabled={pending}>
      <Building2 size={17} />
      {pending ? "Saving..." : "Add branch"}
    </button>
  );
}

function UserButton() {
  const { pending } = useFormStatus();
  return (
    <button className="secondary-button" disabled={pending}>
      <UserPlus size={17} />
      {pending ? "Saving..." : "Add staff"}
    </button>
  );
}

export function BranchForm() {
  const [state, action] = useActionStateFallback(createBranchAction, { error: "", success: "" });
  return (
    <form action={action} className="panel space-y-4">
      <h2>Add Branch</h2>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <label className="field">
        <span>Name</span>
        <input name="name" required />
      </label>
      <label className="field">
        <span>Code</span>
        <input name="code" placeholder="KGL" required />
      </label>
      <label className="field">
        <span>City</span>
        <input name="city" required />
      </label>
      <label className="field">
        <span>Address</span>
        <input name="address" />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" />
      </label>
      <BranchButton />
    </form>
  );
}

export function StaffForm({ branches }: { branches: Branch[] }) {
  const [state, action] = useActionStateFallback(createUserAction, { error: "", success: "" });
  return (
    <form action={action} className="panel space-y-4">
      <h2>Add Staff User</h2>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <label className="field">
        <span>Name</span>
        <input name="name" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input name="password" type="password" required />
      </label>
      <label className="field">
        <span>Role</span>
        <select name="role" defaultValue="SERVICE_PROVIDER">
          <option value="SERVICE_PROVIDER">Branch Service Provider</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </label>
      <label className="field">
        <span>Branch</span>
        <select name="branchId">
          <option value="">No branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>
      <UserButton />
    </form>
  );
}
