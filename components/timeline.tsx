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
    <ol className="tl">
      {items.map((item) => (
        <li key={item.id} className="tl-row">
          <div className="tl-dot" aria-hidden="true">
            <CheckCircle2 size={18} />
          </div>
          <div className="tl-card">
            <div className="tl-card-head">
              <p>{item.note}</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="tl-meta">
              {item.branch.name}, {item.branch.city} • {format(item.createdAt, "PPp")}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
