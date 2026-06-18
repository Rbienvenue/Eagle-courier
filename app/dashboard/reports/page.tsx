import Link from "next/link";
import { Printer, Download } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { getPeriodRange, packageFinancialWhere } from "@/lib/reports";
import type { ReportPeriod } from "@/lib/reports";
import { requireReportsAccess } from "@/lib/session";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function ReportsPage({
  searchParams
}: {
  searchParams: Promise<{ branchId?: string; period?: ReportPeriod; date?: string }>;
}) {
  await requireReportsAccess();
  const params = await searchParams;
  const period = params.period || "daily";
  const reportDate = params.date || toDateInputValue(new Date());
  const branchId = params.branchId || "";
  const { start, end } = getPeriodRange(period, reportDate);
  const dayRange = getPeriodRange("daily", reportDate);
  const weekRange = getPeriodRange("weekly", reportDate);
  const monthRange = getPeriodRange("monthly", reportDate);
  const yearRange = getPeriodRange("yearly", reportDate);

  const [branches, packages, aggregate, dayAgg, weekAgg, monthAgg, yearAgg] = await Promise.all([
    prisma.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.package.findMany({
      where: packageFinancialWhere(branchId || undefined, start, end),
      orderBy: { createdAt: "desc" },
      include: { originBranch: true, destinationBranch: true, createdBy: true }
    }),
    prisma.package.aggregate({
      where: packageFinancialWhere(branchId || undefined, start, end),
      _sum: { price: true },
      _count: true
    }),
    prisma.package.aggregate({
      where: packageFinancialWhere(branchId || undefined, dayRange.start, dayRange.end),
      _sum: { price: true },
      _count: true
    }),
    prisma.package.aggregate({
      where: packageFinancialWhere(branchId || undefined, weekRange.start, weekRange.end),
      _sum: { price: true },
      _count: true
    }),
    prisma.package.aggregate({
      where: packageFinancialWhere(branchId || undefined, monthRange.start, monthRange.end),
      _sum: { price: true },
      _count: true
    }),
    prisma.package.aggregate({
      where: packageFinancialWhere(branchId || undefined, yearRange.start, yearRange.end),
      _sum: { price: true },
      _count: true
    })
  ]);

  const downloadHref = `/dashboard/reports/download?period=${period}&date=${reportDate}${branchId ? `&branchId=${branchId}` : ""}`;

  return (
    <section className="page">
      <div className="print-actions" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
        <div>
          <h1>Financial Reports</h1>
          <p style={{ color: "var(--muted)" }}>Review package transactions and revenue by branch and period.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <PrintButton label="Print report" icon={<Printer size={18} />} />
          <Link className="secondary-button" href={downloadHref}>
            <Download size={18} />
            Download CSV
          </Link>
        </div>
      </div>

      <form className="panel print-actions" style={{ margin: "1rem 0", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
        <label className="field">
          <span>Branch</span>
          <select name="branchId" defaultValue={branchId}>
            <option value="">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Period</span>
          <select name="period" defaultValue={period}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label className="field">
          <span>Date</span>
          <input name="date" type="date" defaultValue={reportDate} />
        </label>
        <button className="primary-button" style={{ alignSelf: "end" }}>
          Apply filters
        </button>
      </form>

      <div className="stats-grid" style={{ margin: "1rem 0" }}>
        <div className="stat">
          <span>Selected period</span>
          <strong>{formatMoney(aggregate._sum.price ?? 0)}</strong>
          <span>{aggregate._count} packages</span>
        </div>
        <div className="stat">
          <span>Day total</span>
          <strong>{formatMoney(dayAgg._sum.price ?? 0)}</strong>
          <span>{dayAgg._count} packages</span>
        </div>
        <div className="stat">
          <span>Week total</span>
          <strong>{formatMoney(weekAgg._sum.price ?? 0)}</strong>
          <span>{weekAgg._count} packages</span>
        </div>
        <div className="stat">
          <span>Month total</span>
          <strong>{formatMoney(monthAgg._sum.price ?? 0)}</strong>
          <span>{monthAgg._count} packages</span>
        </div>
        <div className="stat">
          <span>Year total</span>
          <strong>{formatMoney(yearAgg._sum.price ?? 0)}</strong>
          <span>{yearAgg._count} packages</span>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Date</th>
              <th>Branch</th>
              <th>Route</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Staff</th>
              <th>Status</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>{pkg.trackingCode}</td>
                <td>{pkg.createdAt.toLocaleDateString()}</td>
                <td>{pkg.originBranch.name}</td>
                <td>
                  {pkg.originBranch.code} to {pkg.destinationBranch.code}
                </td>
                <td>{pkg.senderName}</td>
                <td>{pkg.receiverName}</td>
                <td>{pkg.createdBy?.name ?? "Unknown"}</td>
                <td>{pkg.status}</td>
                <td>{formatMoney(pkg.price)}</td>
              </tr>
            ))}
            {packages.length === 0 ? (
              <tr>
                <td colSpan={9}>No transactions found for this report.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
