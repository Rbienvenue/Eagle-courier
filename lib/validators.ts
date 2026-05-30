import { PackageStatus } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const packageSchema = z.object({
  senderName: z.string().min(2, "Sender name must be at least 2 characters."),
  senderNationalId: z.string().regex(/^[0-9]{16}$/, "Sender national ID must be exactly 16 digits."),
  senderPhone: z.string().regex(/^[0-9]{10}$/, "Sender phone number must be exactly 10 digits."),
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters."),
  receiverNationalId: z.string().regex(/^[0-9]{16}$/, "Receiver national ID must be exactly 16 digits."),
  receiverPhone: z.string().regex(/^[0-9]{10}$/, "Receiver phone number must be exactly 10 digits."),
  originBranchId: z.string().min(1, "Choose an origin branch."),
  destinationBranchId: z.string().min(1, "Choose a destination branch."),
  packageType: z.string().min(2, "Package type must be at least 2 characters."),
  description: z.string().min(3, "Description must be at least 3 characters."),
  weightKg: z.string()
    .min(1, "Weight is required.")
    .regex(/^[0-9]+(\.[0-9]+)?$/, "Weight must be a valid number.")
    .transform(Number)
    .refine((value) => value > 0, { message: "Weight must be greater than zero." })
}).superRefine((data, ctx) => {
  if (data.originBranchId && data.destinationBranchId && data.originBranchId === data.destinationBranchId) {
    ctx.addIssue({
      path: ["destinationBranchId"],
      code: z.ZodIssueCode.custom,
      message: "Origin and destination branches must be different."
    });
  }

  if (data.senderNationalId && data.receiverNationalId && data.senderNationalId === data.receiverNationalId) {
    ctx.addIssue({
      path: ["receiverNationalId"],
      code: z.ZodIssueCode.custom,
      message: "Sender and receiver national IDs must be different."
    });
  }

  if (data.senderPhone && data.receiverPhone && data.senderPhone === data.receiverPhone) {
    ctx.addIssue({
      path: ["receiverPhone"],
      code: z.ZodIssueCode.custom,
      message: "Sender and receiver phone numbers must be different."
    });
  }
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
