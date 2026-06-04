"use client";

import { PackageStatus } from "@prisma/client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Truck } from "lucide-react";
import { updateMovementAction } from "@/app/actions/packages";

type Branch = {
  id: string;
  name: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="secondary-button" disabled={pending}>
      <Truck size={17} />
      {pending ? "Updating..." : "Add movement"}
    </button>
  );
}

export function MovementForm({ packageId, branches, destinationBranchId }: { packageId: string; branches: Branch[]; destinationBranchId: string }) {
  const [state, action] = React.useActionState(updateMovementAction, { error: "", success: "" });

  return (
    <form action={action} className="panel space-y-4">
      <input type="hidden" name="packageId" value={packageId} />
      <h2>Update Movement</h2>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <label className="field">
        <span>Status</span>
        <select name="status" defaultValue={PackageStatus.IN_TRANSIT}>
          <option value={PackageStatus.IN_TRANSIT}>In transit</option>
          <option value={PackageStatus.ARRIVED}>Arrived</option>
          <option value={PackageStatus.CANCELLED}>Cancelled</option>
        </select>
      </label>
      <label className="field">
        <span>Branch</span>
        <select name="branchId" defaultValue={destinationBranchId}>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Note</span>
        <textarea name="note" rows={3} placeholder="Optional movement note" />
      </label>
      <SubmitButton />
    </form>
  );
}
