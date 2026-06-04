import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "eagle_session";

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: { branch: true }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  return requireSuperAdmin();
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireSuperAdmin() {
  return requireRole([UserRole.SUPER_ADMIN]);
}

export async function requirePackageOperator() {
  return requireRole([UserRole.SERVICE_PROVIDER, UserRole.SUPER_ADMIN]);
}

export async function requireReportsAccess() {
  return requireRole([UserRole.ACCOUNTANT, UserRole.SUPER_ADMIN]);
}

export function canOperatePackages(role: UserRole) {
  return role === UserRole.SERVICE_PROVIDER || role === UserRole.SUPER_ADMIN;
}

export function canViewReports(role: UserRole) {
  return role === UserRole.ACCOUNTANT || role === UserRole.SUPER_ADMIN;
}

export function canManageSystem(role: UserRole) {
  return role === UserRole.SUPER_ADMIN;
}
