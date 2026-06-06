"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="secondary-button"
      style={{ minHeight: 36, padding: "0.45rem 0.7rem" }}
    >
      <LogOut size={16} /> {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
