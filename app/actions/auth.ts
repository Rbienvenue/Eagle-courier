"use server";

import { redirect } from "next/navigation";
import { clearSession, setSession, verifyPassword } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

type LoginState = { error?: string };

export async function loginAction(formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await setSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
