"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { BadgeCheck } from "lucide-react";
import { deliverPackageAction } from "@/app/actions/packages";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="primary-button" disabled={pending}>
      <BadgeCheck size={18} />
      {pending ? "Verifying..." : "Verify and deliver"}
    </button>
  );
}

export function DeliveryForm({ packageId }: { packageId: string }) {
  const [state, action] = React.useActionState(deliverPackageAction, { error: "", success: "" });

  return (
    <form action={action} className="panel space-y-4">
      <input type="hidden" name="packageId" value={packageId} />
      <h2>Receiver Verification</h2>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.success ? <p className="form-success">{state.success}</p> : null}
      <label className="field">
        <span>Provided national ID</span>
        <input name="providedNationalId" required />
      </label>
      <SubmitButton />
    </form>
  );
}
