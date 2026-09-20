"use client";

import { useSyncExternalStore } from "react";
import { MY_TEAM } from "./team";

/*
 * Small "have they done this yet" flags for the get-ready checklist.
 * Stored in this browser. TODO: move to the account once there's a backend.
 */

const KEY = `krifth-progress-${MY_TEAM.inviteCode}`;
const listeners = new Set<() => void>();

export type Step = "readRules" | "pickedMerchant";

function readRaw() {
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}

export function markDone(step: Step) {
  const set = new Set(readRaw().split(",").filter(Boolean));
  if (set.has(step)) return;
  set.add(step);
  try { localStorage.setItem(KEY, [...set].join(",")); } catch {}
  listeners.forEach((l) => l());
}

export function useProgress() {
  const raw = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    readRaw,
    () => "",
  );
  const done = new Set(raw.split(",").filter(Boolean));
  return (step: Step) => done.has(step);
}
