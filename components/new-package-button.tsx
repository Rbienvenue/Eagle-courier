"use client";

import React from "react";
import { DialogRoot, DialogTrigger, DialogPortal, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PackageForm } from "@/components/package-form";

type Branch = { id: string; name: string; code: string };

export default function NewPackageButton({ branches, defaultOriginId }: { branches: Branch[]; defaultOriginId?: string | null }) {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button>New package</Button>
      </DialogTrigger>
      <DialogPortal>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>Create package</h3>
          <DialogClose>
            <button className="secondary-button">Close</button>
          </DialogClose>
        </div>
        <PackageForm branches={branches} defaultOriginId={defaultOriginId} />
      </DialogPortal>
    </DialogRoot>
  );
}
