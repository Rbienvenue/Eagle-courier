"use server";

import { MovementType, PackageStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { generateTrackingCode } from "@/lib/tracking";
import { deliverySchema, movementSchema, packageSchema } from "@/lib/validators";

function movementTypeForStatus(status: PackageStatus) {
  if (status === PackageStatus.IN_TRANSIT) return MovementType.DISPATCHED;
  if (status === PackageStatus.ARRIVED) return MovementType.ARRIVED;
  if (status === PackageStatus.DELIVERED) return MovementType.DELIVERED;
  if (status === PackageStatus.CANCELLED) return MovementType.CANCELLED;
  return MovementType.NOTE;
}

export async function createPackageAction(_prevState: { error?: string; fieldErrors?: Record<string, string> }, formData: FormData) {
  const user = await requireUser();
  const submittedValues = Object.fromEntries(formData);
  const parsed = packageSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors = Object.fromEntries(
      Object.entries(flattened.fieldErrors).flatMap(([key, messages]) =>
        messages && messages.length ? [[key, messages[0]]] : []
      )
    ) as Record<string, string>;

    return {
      error: "Please fix the highlighted fields.",
      values: submittedValues,
      fieldErrors
    };
  }

  const data = parsed.data;

  const { trackingCode, sequenceNumber } = await generateTrackingCode(data.originBranchId);

  const pkg = await prisma.package.create({
    data: {
      trackingCode,
      sequenceNumber,
      senderName: data.senderName,
      senderNationalId: data.senderNationalId,
      senderPhone: data.senderPhone,
      receiverName: data.receiverName,
      receiverNationalId: data.receiverNationalId,
      receiverPhone: data.receiverPhone,
      packageType: data.packageType,
      description: data.description,
      weightKg: data.weightKg,
      originBranchId: data.originBranchId,
      destinationBranchId: data.destinationBranchId,
      createdById: user.id,
      movements: {
        create: {
          branchId: data.originBranchId,
          userId: user.id,
          type: MovementType.REGISTERED,
          status: PackageStatus.PENDING,
          note: "Package registered"
        }
      }
    }
  });

  revalidatePath("/dashboard/packages");
  redirect(`/dashboard/packages/${pkg.id}/receipt`);
}

export async function updateMovementAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const user = await requireUser();
  const parsed = movementSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Choose a valid status and branch." };
  }

  const pkg = await prisma.package.findUnique({
    where: { id: parsed.data.packageId },
    include: { originBranch: true, destinationBranch: true }
  });

  if (!pkg) {
    return { error: "Package was not found." };
  }

  if (pkg.status === PackageStatus.DELIVERED) {
    return { error: "Delivered packages cannot be moved." };
  }

  const note =
    parsed.data.note ||
    (parsed.data.status === PackageStatus.IN_TRANSIT
      ? `Package departed from ${pkg.originBranch.name}`
      : parsed.data.status === PackageStatus.ARRIVED
        ? `Package arrived at ${pkg.destinationBranch.name}`
        : parsed.data.status === PackageStatus.CANCELLED
          ? "Package was canceled"
          : `Package status updated to ${parsed.data.status}`);

  await prisma.$transaction([
    prisma.package.update({
      where: { id: pkg.id },
      data: { status: parsed.data.status }
    }),
    prisma.movement.create({
      data: {
        packageId: pkg.id,
        branchId: parsed.data.branchId,
        userId: user.id,
        type: movementTypeForStatus(parsed.data.status),
        status: parsed.data.status,
        note
      }
    })
  ]);

  revalidatePath(`/dashboard/packages/${pkg.id}`);
  revalidatePath(`/track/${pkg.trackingCode}`);
  return { success: "Movement updated." };
}

export async function deliverPackageAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  const user = await requireUser();
  const parsed = deliverySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Enter the receiver national ID." };
  }

  const pkg = await prisma.package.findUnique({
    where: { id: parsed.data.packageId },
    include: { destinationBranch: true }
  });

  if (!pkg) {
    return { error: "Package was not found." };
  }

  if (pkg.receiverNationalId !== parsed.data.providedNationalId) {
    return { error: "Receiver national ID does not match this package." };
  }

  await prisma.$transaction([
    prisma.package.update({
      where: { id: pkg.id },
      data: {
        status: PackageStatus.DELIVERED,
        deliveredAt: new Date(),
        deliveredToNationalId: parsed.data.providedNationalId
      }
    }),
    prisma.movement.create({
      data: {
        packageId: pkg.id,
        branchId: pkg.destinationBranchId,
        userId: user.id,
        type: MovementType.DELIVERED,
        status: PackageStatus.DELIVERED,
        note: "Package delivered successfully"
      }
    })
  ]);

  revalidatePath(`/dashboard/packages/${pkg.id}`);
  revalidatePath(`/track/${pkg.trackingCode}`);
  return { success: "Receiver verified and package delivered." };
}
