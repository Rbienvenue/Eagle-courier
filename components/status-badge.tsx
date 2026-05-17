import { PackageStatus } from "@prisma/client";
import { clsx } from "clsx";
import { statusLabels, statusTone } from "@/lib/status";

export function StatusBadge({ status }: { status: PackageStatus }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", statusTone[status])}>
      {statusLabels[status]}
    </span>
  );
}
