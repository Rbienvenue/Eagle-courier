import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { csvEscape, getPeriodRange, packageFinancialWhere } from "@/lib/reports";
import type { ReportPeriod } from "@/lib/reports";
import { requireReportsAccess } from "@/lib/session";

export async function GET(request: NextRequest) {
  await requireReportsAccess();
  const searchParams = request.nextUrl.searchParams;
  const period = (searchParams.get("period") || "daily") as ReportPeriod;
  const branchId = searchParams.get("branchId") || undefined;
  const date = searchParams.get("date") || undefined;
  const { start, end } = getPeriodRange(period, date);

  const packages = await prisma.package.findMany({
    where: packageFinancialWhere(branchId, start, end),
    orderBy: { createdAt: "asc" },
    include: { originBranch: true, destinationBranch: true, createdBy: true }
  });

  const rows = [
    ["Tracking Code", "Date", "Origin Branch", "Destination Branch", "Sender", "Receiver", "Status", "Price", "Created By"],
    ...packages.map((pkg) => [
      pkg.trackingCode,
      pkg.createdAt.toISOString(),
      pkg.originBranch.name,
      pkg.destinationBranch.name,
      pkg.senderName,
      pkg.receiverName,
      pkg.status,
      pkg.price.toString(),
      pkg.createdBy.name
    ])
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="eagle-financial-report-${period}.csv"`
    }
  });
}
