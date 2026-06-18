import { BranchForm } from "@/components/admin-forms";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogPortal, DialogRoot, DialogTrigger } from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import { Plus } from "lucide-react";

export default async function BranchesPage() {
  await requireSuperAdmin();
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div>
          <h1>Branches</h1>
          <p style={{ color: "var(--muted)" }}>View and manage branch locations.</p>
        </div>
        <DialogRoot>
          <DialogTrigger>
            <Button>
              <Plus size={16} />
              <span style={{ marginLeft: 8 }}>Add New Branch</span>
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0 }}>Create new branch</h3>
              </div>
              <DialogClose>
                <button className="secondary-button">Close</button>
              </DialogClose>
            </div>
            <BranchForm />
          </DialogPortal>
        </DialogRoot>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>City</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td>{branch.name}</td>
                <td>{branch.code}</td>
                <td>{branch.city}</td>
                <td>{branch.address ?? "—"}</td>
                <td>{branch.phone ?? "—"}</td>
              </tr>
            ))}
            {branches.length === 0 ? (
              <tr>
                <td colSpan={5}>No branches found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
