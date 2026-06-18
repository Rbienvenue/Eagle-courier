import { StaffForm } from "@/components/admin-forms";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogPortal, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import { Plus } from "lucide-react";

export default async function UsersPage() {
  await requireSuperAdmin();
  const [users, branches] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { branch: true } }),
    prisma.branch.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <section className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h1>Users</h1>
          <p style={{ color: "var(--muted)" }}>Manage authenticated users and their access roles.</p>
        </div>
        <DialogRoot>
          <DialogTrigger>
            <Button>
              <Plus size={16} />
              <span style={{ marginLeft: 8 }}>Add New User</span>
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>Create new user</h3>
              </div>
              <DialogClose>
                <button className="secondary-button">Close</button>
              </DialogClose>
            </div>
            <StaffForm branches={branches} />
          </DialogPortal>
        </DialogRoot>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.branch?.name ?? "All branches"}</td>
                <td>{user.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={5}>No users found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
