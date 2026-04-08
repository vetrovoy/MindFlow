"use client";

import { useEffect, useState } from "react";

import { getSyncStore, type SyncStatus } from "@/shared/model/sync-store";

const ICONS: Record<SyncStatus, string> = {
  idle: "⏸",
  syncing: "⟳",
  synced: "✓",
  error: "✗"
};

const COLORS: Record<SyncStatus, string> = {
  idle: "var(--text-secondary)",
  syncing: "var(--accent-primary)",
  synced: "var(--accent-success)",
  error: "var(--accent-alert)"
};

const LABELS: Record<SyncStatus, string> = {
  idle: "Idle",
  syncing: "Syncing...",
  synced: "Synced",
  error: "Sync Error"
};

export function SyncIndicator() {
  const [status, setStatus] = useState<SyncStatus>("idle");

  useEffect(() => {
    const store = getSyncStore();
    const unsubscribe = store.subscribe((state) => {
      setStatus(state.status);
    });

    setStatus(store.getState().status);

    return unsubscribe;
  }, []);

  const color = COLORS[status];
  const icon = ICONS[status];
  const label = LABELS[status];

  if (status === "idle") {
    return null;
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        color,
        backgroundColor: `${color}15`
      }}
    >
      {status === "syncing" ? (
        <span
          style={{
            display: "inline-block",
            animation: "spin 1s linear infinite"
          }}
        >
          {icon}
        </span>
      ) : (
        <span>{icon}</span>
      )}
      <span>{label}</span>
    </div>
  );
}
