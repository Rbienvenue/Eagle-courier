"use client";

import React from "react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.6)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'white', borderRadius: 12, padding: 18, width: 760, maxWidth: '95%' }}>
        {title ? <h3 style={{ marginTop: 0 }}>{title}</h3> : null}
        <div>{children}</div>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button onClick={onClose} className="secondary-button">Close</button>
        </div>
      </div>
    </div>
  );
}
