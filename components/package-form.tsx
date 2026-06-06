"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { PackagePlus } from "lucide-react";
import { createPackageAction } from "@/app/actions/packages";
import { useActionStateFallback } from "@/lib/action-state";

type Branch = {
  id: string;
  name: string;
  code: string;
};

type FieldErrors = Partial<Record<
  | "senderName"
  | "senderNationalId"
  | "senderPhone"
  | "receiverName"
  | "receiverNationalId"
  | "receiverPhone"
  | "originBranchId"
  | "destinationBranchId"
  | "packageType"
  | "description"
  | "price"
  | "weightKg",
  string
>>;

type PackageFormState = {
  error?: string;
  values?: Record<string, string>;
  fieldErrors?: Record<string, string>;
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

function renderFieldError(fieldId: string, message?: string) {
  if (!message) return null;
  return (
    <p id={`${fieldId}Error`} className="text-sm text-rose-700">
      {message}
    </p>
  );
}

export function PackageForm({ branches, defaultOriginId }: { branches: Branch[]; defaultOriginId?: string | null }) {
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [state, action] = useActionStateFallback(createPackageAction, {
    error: "",
    values: {},
    fieldErrors: {}
  } satisfies PackageFormState);
  const serverFieldErrors = (state.fieldErrors ?? {}) as FieldErrors;
  const errors = { ...serverFieldErrors, ...fieldErrors };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const values = {
      senderName: formData.get("senderName")?.toString().trim() ?? "",
      senderNationalId: formData.get("senderNationalId")?.toString().trim() ?? "",
      senderPhone: formData.get("senderPhone")?.toString().trim() ?? "",
      receiverName: formData.get("receiverName")?.toString().trim() ?? "",
      receiverNationalId: formData.get("receiverNationalId")?.toString().trim() ?? "",
      receiverPhone: formData.get("receiverPhone")?.toString().trim() ?? "",
      originBranchId: formData.get("originBranchId")?.toString().trim() ?? "",
      destinationBranchId: formData.get("destinationBranchId")?.toString().trim() ?? "",
      packageType: formData.get("packageType")?.toString().trim() ?? "",
      description: formData.get("description")?.toString().trim() ?? "",
      price: formData.get("price")?.toString().trim() ?? "",
      weightKg: formData.get("weightKg")?.toString().trim() ?? ""
    };

    const nextErrors: FieldErrors = {};

    if (!values.senderName) nextErrors.senderName = "Sender full name is required.";
    else if (values.senderName.length < 2) nextErrors.senderName = "Sender name must be at least 2 characters.";

    if (!values.senderNationalId) nextErrors.senderNationalId = "Sender national ID is required.";
    else if (!/^[0-9]{16}$/.test(values.senderNationalId)) nextErrors.senderNationalId = "Sender national ID must be exactly 16 digits.";

    if (!values.senderPhone) nextErrors.senderPhone = "Sender phone number is required.";
    else if (!/^[0-9]{10}$/.test(values.senderPhone)) nextErrors.senderPhone = "Sender phone number must be exactly 10 digits.";

    if (!values.receiverName) nextErrors.receiverName = "Receiver full name is required.";
    else if (values.receiverName.length < 2) nextErrors.receiverName = "Receiver name must be at least 2 characters.";

    if (!values.receiverNationalId) nextErrors.receiverNationalId = "Receiver national ID is required.";
    else if (!/^[0-9]{16}$/.test(values.receiverNationalId)) nextErrors.receiverNationalId = "Receiver national ID must be exactly 16 digits.";

    if (!values.receiverPhone) nextErrors.receiverPhone = "Receiver phone number is required.";
    else if (!/^[0-9]{10}$/.test(values.receiverPhone)) nextErrors.receiverPhone = "Receiver phone number must be exactly 10 digits.";

    if (values.senderNationalId && values.receiverNationalId && values.senderNationalId === values.receiverNationalId) {
      nextErrors.receiverNationalId = "Receiver national ID must be different from sender national ID.";
    }

    if (values.senderPhone && values.receiverPhone && values.senderPhone === values.receiverPhone) {
      nextErrors.receiverPhone = "Receiver phone number must be different from sender phone number.";
    }

    if (!values.originBranchId) nextErrors.originBranchId = "Choose an origin branch.";
    if (!values.destinationBranchId) nextErrors.destinationBranchId = "Choose a destination branch.";
    if (values.originBranchId && values.destinationBranchId && values.originBranchId === values.destinationBranchId) {
      nextErrors.destinationBranchId = "Origin and destination branches must be different.";
    }

    if (!values.packageType) nextErrors.packageType = "Package type is required.";
    else if (values.packageType.length < 2) nextErrors.packageType = "Package type must be at least 2 characters.";

    if (!values.description) nextErrors.description = "Description is required.";
    else if (values.description.length < 3) nextErrors.description = "Description must be at least 3 characters.";

    if (!values.price) nextErrors.price = "Price is required.";
    else if (!/^[0-9]+(\.[0-9]+)?$/.test(values.price)) nextErrors.price = "Price must be a valid amount.";
    else if (Number(values.price) < 0) nextErrors.price = "Price cannot be negative.";

    if (!values.weightKg) nextErrors.weightKg = "Weight is required.";
    else if (!/^[0-9]+(\.[0-9]+)?$/.test(values.weightKg)) nextErrors.weightKg = "Weight must be a valid number.";
    else if (Number(values.weightKg) <= 0) nextErrors.weightKg = "Weight must be greater than zero.";

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
  };

  return (
    <form action={action} onSubmit={handleSubmit} className="grid gap-5">
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <section className="form-section">
        <h2>Sender</h2>
        <div className="form-grid">
          <label className="field">
            <span>Full name</span>
            <input
              name="senderName"
              required
              defaultValue={state.values?.senderName ?? ""}
              aria-describedby={errors.senderName ? "senderNameError" : undefined}
              aria-invalid={errors.senderName ? "true" : "false"}
            />
            {renderFieldError("senderName", errors.senderName)}
          </label>
          <label className="field">
            <span>National ID</span>
            <input
              name="senderNationalId"
              required
              defaultValue={state.values?.senderNationalId ?? ""}
              aria-describedby={errors.senderNationalId ? "senderNationalIdError" : undefined}
              aria-invalid={errors.senderNationalId ? "true" : "false"}
            />
            {renderFieldError("senderNationalId", errors.senderNationalId)}
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              name="senderPhone"
              required
              defaultValue={state.values?.senderPhone ?? ""}
              aria-describedby={errors.senderPhone ? "senderPhoneError" : undefined}
              aria-invalid={errors.senderPhone ? "true" : "false"}
            />
            {renderFieldError("senderPhone", errors.senderPhone)}
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>Receiver</h2>
        <div className="form-grid">
          <label className="field">
            <span>Full name</span>
            <input
              name="receiverName"
              required
              defaultValue={state.values?.receiverName ?? ""}
              aria-describedby={errors.receiverName ? "receiverNameError" : undefined}
              aria-invalid={errors.receiverName ? "true" : "false"}
            />
            {renderFieldError("receiverName", errors.receiverName)}
          </label>
          <label className="field">
            <span>National ID</span>
            <input
              name="receiverNationalId"
              required
              defaultValue={state.values?.receiverNationalId ?? ""}
              aria-describedby={errors.receiverNationalId ? "receiverNationalIdError" : undefined}
              aria-invalid={errors.receiverNationalId ? "true" : "false"}
            />
            {renderFieldError("receiverNationalId", errors.receiverNationalId)}
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              name="receiverPhone"
              required
              defaultValue={state.values?.receiverPhone ?? ""}
              aria-describedby={errors.receiverPhone ? "receiverPhoneError" : undefined}
              aria-invalid={errors.receiverPhone ? "true" : "false"}
            />
            {renderFieldError("receiverPhone", errors.receiverPhone)}
          </label>
        </div>
      </section>
      <section className="form-section">
        <h2>Delivery</h2>
        <div className="form-grid">
          <label className="field">
            <span>Origin branch</span>
            <select
              name="originBranchId"
              defaultValue={state.values?.originBranchId ?? defaultOriginId ?? ""}
              required
              aria-describedby={errors.originBranchId ? "originBranchIdError" : undefined}
              aria-invalid={errors.originBranchId ? "true" : "false"}
            >
              <option value="">Choose branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
            {renderFieldError("originBranchId", errors.originBranchId)}
          </label>
          <label className="field">
            <span>Destination branch</span>
            <select
              name="destinationBranchId"
              defaultValue={state.values?.destinationBranchId ?? ""}
              required
              aria-describedby={errors.destinationBranchId ? "destinationBranchIdError" : undefined}
              aria-invalid={errors.destinationBranchId ? "true" : "false"}
            >
              <option value="">Choose branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} ({branch.code})
                </option>
              ))}
            </select>
            {renderFieldError("destinationBranchId", errors.destinationBranchId)}
          </label>
          <label className="field">
            <span>Package type</span>
            <input
              name="packageType"
              placeholder="Documents, box, fragile cargo"
              required
              defaultValue={state.values?.packageType ?? ""}
              aria-describedby={errors.packageType ? "packageTypeError" : undefined}
              aria-invalid={errors.packageType ? "true" : "false"}
            />
            {renderFieldError("packageType", errors.packageType)}
          </label>
          <label className="field">
            <span>Price / Amount paid</span>
            <input
              name="price"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={state.values?.price ?? ""}
              aria-describedby={errors.price ? "priceError" : undefined}
              aria-invalid={errors.price ? "true" : "false"}
            />
            {renderFieldError("price", errors.price)}
          </label>
          <label className="field">
            <span>Weight kg</span>
            <input
              name="weightKg"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={state.values?.weightKg ?? ""}
              aria-describedby={errors.weightKg ? "weightKgError" : undefined}
              aria-invalid={errors.weightKg ? "true" : "false"}
            />
            {renderFieldError("weightKg", errors.weightKg)}
          </label>
          <label className="field wide">
            <span>Description</span>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={state.values?.description ?? ""}
              aria-describedby={errors.description ? "descriptionError" : undefined}
              aria-invalid={errors.description ? "true" : "false"}
            />
            {renderFieldError("description", errors.description)}
          </label>
        </div>
      </section>
      <SubmitButton />
    </form>
  );
}
