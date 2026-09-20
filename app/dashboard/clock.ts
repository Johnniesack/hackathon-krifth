import { useSyncExternalStore } from "react";
import { HACK_START } from "./data";

export const DAY = 86_400_000;

export const localTime = (iso: string, h = 0, m = 0, s = 0) =>
  new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), h, m, s).getTime();

export const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Preview (?preview in the URL) pretends it's 1 Nov, 09:24 — day 2 of the build — with sample data.
export const PREVIEW_NOW = localTime("2026-11-01", 9, 24);

/**
 * Current time (re-read every 20s) and whether preview mode is on.
 * Read on the client only, so the static export renders a stable first pass.
 */
export function useClock() {
  const snap = useSyncExternalStore(
    (cb) => {
      const id = window.setInterval(cb, 20_000);
      return () => window.clearInterval(id);
    },
    () => {
      const minute = Math.floor(Date.now() / 60_000);
      const preview = new URLSearchParams(window.location.search).has("preview") ? 1 : 0;
      return `${minute}|${preview}`;
    },
    () => null,
  );

  const preview = snap?.endsWith("|1") ?? false;
  const now = preview ? PREVIEW_NOW : snap ? +snap.split("|")[0] * 60_000 : localTime(HACK_START);
  return { now, preview, ready: snap !== null };
}

/**
 * Ticks once a second, for countdowns only — the rest of the page stays on the 20s clock.
 * In preview mode it still ticks, counting down from the pretend date.
 */
export function useTicker(preview: boolean) {
  const seconds = useSyncExternalStore(
    (cb) => {
      const id = window.setInterval(cb, 1000);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
  if (seconds === null) return preview ? PREVIEW_NOW : localTime(HACK_START);
  return preview ? PREVIEW_NOW + (seconds - Math.floor(PREVIEW_START_REAL / 1000)) * 1000 : seconds * 1000;
}

// Fixed point the preview countdown advances from, so it ticks instead of sitting still.
const PREVIEW_START_REAL = Date.now();
