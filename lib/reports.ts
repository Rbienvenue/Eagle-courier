import { Prisma } from "@prisma/client";

export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";

export function getPeriodRange(period: ReportPeriod, dateValue?: string) {
  const base = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);

  if (period === "weekly") {
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);
    end.setTime(start.getTime());
    end.setDate(start.getDate() + 7);
    return { start, end };
  }

  if (period === "monthly") {
    start.setDate(1);
    end.setTime(start.getTime());
    end.setMonth(start.getMonth() + 1);
    return { start, end };
  }

  if (period === "yearly") {
    start.setMonth(0, 1);
    end.setTime(start.getTime());
    end.setFullYear(start.getFullYear() + 1);
    return { start, end };
  }

  end.setDate(start.getDate() + 1);
  return { start, end };
}

export function packageFinancialWhere(branchId: string | undefined, start: Date, end: Date): Prisma.PackageWhereInput {
  return {
    createdAt: {
      gte: start,
      lt: end
    },
    ...(branchId ? { originBranchId: branchId } : {})
  };
}

export function csvEscape(value: unknown) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}
