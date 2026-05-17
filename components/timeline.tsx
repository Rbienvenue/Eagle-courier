import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

type TimelineItem = {
  id: string;
  note: string;
  status: "PENDING" | "IN_TRANSIT" | "ARRIVED" | "DELIVERED" | "CANCELLED";
  createdAt: Date;
  branch: { name: string; city: string };
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[32px_1fr] gap-3">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={18} />
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-950">{item.note}</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {item.branch.name}, {item.branch.city} • {format(item.createdAt, "PPp")}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
