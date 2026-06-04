"use client";

import type React from "react";
import { Printer } from "lucide-react";

export function PrintButton({ label = "Print", icon }: { label?: string; icon?: React.ReactNode }) {
  return (
    <button className="primary-button" onClick={() => window.print()}>
      {icon ?? <Printer size={18} />}
      {label}
    </button>
  );
}
