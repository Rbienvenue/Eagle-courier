"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { PackagePlus } from "lucide-react";
import { createPackageAction } from "@/app/actions/packages";

type Branch = {
  id: string;
  name: string;
  code: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-button">
      <PackagePlus size={18} />
      {pending ? "Creating..." : "Create package"}
    </button>
  );
}

export function PackageForm({ branches, defaultOriginId }: { branches: Branch[]; defaultOriginId?: string | null }) {
  const [state, action] = React.useActionState(createPackageAction, {});

  return (
    <form action={action} className="grid gap-5">
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <section className="form-section">
        <h2>Sender</h2>
        <div className="form-grid">
          <label className="field">
            <span>Full name</span>
            <input name="senderName" required defaultValue={state.values?.senderName ?? ""} />
          </label>
          <label className="field">
            <span>National ID</span>
            <input name="senderNationalId" required defaultValue={state.values?.senderNationalId ?? ""} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input name="senderPhone" required defaultValue={state.values?.senderPhone ?? ""} />
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>Receiver</h2>
        <div className="form-grid">
          <label className="field">
            <span>Full name</span>
            <input name="receiverName" required defaultValue={state.values?.receiverName ?? ""} />
          </label>
          <label className="field">
            <span>National ID</span>
            <input name="receiverNationalId" required defaultValue={state.values?.receiverNationalId ?? ""} />
          </label>
          <label className="field">
            <span>Phone</span>
            <input name="receiverPhone" required defaultValue={state.values?.receiverPhone ?? ""} />
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>Delivery</h2>
        <div className="form-grid">
          <label className="field">
            <span>Origin branch</span>
            <select name="originBranchId" defaultValue={state.values?.originBranchId ?? defaultOriginId ?? ""} required>
              <option value="">Choose branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Destination branch</span>
            <select name="destinationBranchId" defaultValue={state.values?.destinationBranchId ?? ""} required>
              <option value="">Choose branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Package type</span>
            <input name="packageType" placeholder="Documents, box, fragile cargo" required defaultValue={state.values?.packageType ?? ""} />
          </label>
          <label className="field">
            <span>Weight kg</span>
            <input name="weightKg" type="number" step="0.01" min="0" defaultValue={state.values?.weightKg ?? ""} />
          </label>
          <label className="field wide">
            <span>Description</span>
            <textarea name="description" rows={3} required defaultValue={state.values?.description ?? ""} />
          </label>
        </div>
      </section>
      <SubmitButton />
    </form>
  );
}
