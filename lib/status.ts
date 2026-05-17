import { PackageStatus } from "@prisma/client";

export const statusLabels: Record<PackageStatus, string> = {
  PENDING: "Pending",
  IN_TRANSIT: "In Transit",
  ARRIVED: "Arrived",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled"
};

export const statusTone: Record<PackageStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  IN_TRANSIT: "bg-blue-100 text-blue-900",
  ARRIVED: "bg-teal-100 text-teal-900",
  DELIVERED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-rose-100 text-rose-900"
};
