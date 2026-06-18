"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

export function DialogRoot({ children }: { children: React.ReactNode }) {
  return <Dialog.Root>{children}</Dialog.Root>;
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>;
}

export function DialogPortal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog.Portal>
      <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.6)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Dialog.Content style={{ background: 'var(--surface)', borderRadius: 12, padding: 18, width: 760, maxWidth: '95%' }}>
            {children}
          </Dialog.Content>
        </div>
      </div>
    </Dialog.Portal>
  );
}

export function DialogClose({ children }: { children: React.ReactNode }) {
  return <Dialog.Close asChild>{children}</Dialog.Close>;
}
