"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createPasswordHash, requireAdmin } from "@/lib/session";
import { branchSchema, userSchema } from "@/lib/validators";

export async function createBranchAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  await requireAdmin();
  const parsed = branchSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Enter valid branch details." };
  }

  await prisma.branch.create({ data: parsed.data });
  revalidatePath("/dashboard/admin");
  return { success: "Branch created." };
}

export async function createUserAction(_prevState: { error?: string; success?: string }, formData: FormData) {
  await requireAdmin();
  const parsed = userSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Enter valid staff details." };
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await createPasswordHash(parsed.data.password),
      role: parsed.data.role,
      branchId: parsed.data.branchId || null
    }
  });

  revalidatePath("/dashboard/admin");
  return { success: "Staff user created." };
}
