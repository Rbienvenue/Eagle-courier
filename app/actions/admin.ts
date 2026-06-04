"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createPasswordHash, requireSuperAdmin } from "@/lib/session";
import { branchSchema, userSchema } from "@/lib/validators";

type ActionMessageState = {
  error?: string;
  success?: string;
};

export async function createBranchAction(_prevState: ActionMessageState, formData: FormData): Promise<ActionMessageState> {
  await requireSuperAdmin();
  const parsed = branchSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Enter valid branch details." };
  }

  await prisma.branch.create({ data: parsed.data });
  revalidatePath("/dashboard/admin");
  return { success: "Branch created." };
}

export async function createUserAction(_prevState: ActionMessageState, formData: FormData): Promise<ActionMessageState> {
  await requireSuperAdmin();
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
