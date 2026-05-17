import { PackageStatus } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const packageSchema = z.object({
  senderName: z.string().min(2),
  senderNationalId: z.string().min(8),
  senderPhone: z.string().min(7),
  receiverName: z.string().min(2),
  receiverNationalId: z.string().min(8),
  receiverPhone: z.string().min(7),
  originBranchId: z.string().min(1),
  destinationBranchId: z.string().min(1),
  packageType: z.string().min(2),
  description: z.string().min(3),
  weightKg: z.coerce.number().nonnegative().optional().or(z.literal("").transform(() => undefined))
});

export const movementSchema = z.object({
  packageId: z.string().min(1),
  status: z.nativeEnum(PackageStatus),
  branchId: z.string().min(1),
  note: z.string().optional()
});

export const deliverySchema = z.object({
  packageId: z.string().min(1),
  providedNationalId: z.string().min(8)
});

export const branchSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(6).transform((value) => value.toUpperCase()),
  city: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STAFF", "ADMIN"]),
  branchId: z.string().optional()
});
