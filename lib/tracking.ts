import { prisma } from "@/lib/prisma";

export async function generateTrackingCode(branchId: string) {
  const branch = await prisma.branch.findUniqueOrThrow({
    where: { id: branchId },
    select: { code: true }
  });
  const year = new Date().getFullYear();

  const sequence = await prisma.trackingSequence.upsert({
    where: { branchId_year: { branchId, year } },
    update: { value: { increment: 1 } },
    create: { branchId, year, value: 1 }
  });

  const padded = sequence.value.toString().padStart(6, "0");
  return {
    trackingCode: `EAG-${branch.code}-${year}-${padded}`,
    sequenceNumber: sequence.value
  };
}

export function trackingUrl(trackingCode: string) {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/track/${trackingCode}`;
}
