import { BranchForm, StaffForm } from "@/components/admin-forms";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";

export default async function AdminPage() {
  await requireSuperAdmin();
  const [branches, users] = await Promise.all([
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { branch: true } })
  ]);

  return (
    <section className="page">
      <h1>Admin</h1>
      <p style={{ color: "var(--muted)" }}>Manage branches and authenticated staff users.</p>
      <div className="admin-grid" style={{ margin: "1rem 0" }}>
        <BranchForm />
        <StaffForm branches={branches} />
      </div>
      <div className="admin-grid">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Code</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td>{branch.name}</td>
                  <td>{branch.code}</td>
                  <td>{branch.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.branch?.name ?? "All branches"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
