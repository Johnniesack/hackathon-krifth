import { localTime } from "./clock";
import type { Quest, Winner } from "./data";

const hm = (t: string | undefined, fallback: [number, number]): [number, number] =>
  t ? [+t.slice(0, 2), +t.slice(3, 5)] : fallback;

export const opensAt = (q: Quest) => localTime(q.opens, ...hm(q.opensTime, [0, 0]));
// Without a time a quest runs to the end of its last day; an explicit time (e.g. "24:00" for midnight) is exact.
export const closesAt = (q: Quest) =>
  q.closesTime ? localTime(q.closes, ...hm(q.closesTime, [0, 0])) : localTime(q.closes, 23, 59, 59);

export const wonAtMs = (w: Winner) => localTime(w.wonOn, ...hm(w.wonAt, [12, 0]));

export type Status = "won" | "open" | "upcoming" | "closed";

export function statusAt(q: Quest, winner: Winner | null, now: number): Status {
  if (winner) return "won";
  if (now < opensAt(q)) return "upcoming";
  if (now > closesAt(q)) return "closed";
  return "open";
}

/** Points right now. A bounty grows from opening until the quest is won or closes. */
export function pointsAt(q: Quest, winner: Winner | null, now: number) {
  if (!q.bounty) return q.points;
  const stop = Math.min(winner ? wonAtMs(winner) : now, closesAt(q));
  const hours = Math.max(0, (stop - opensAt(q)) / 3_600_000);
  return q.points + q.bounty.step * Math.floor(hours / q.bounty.everyHours);
}

/** Milliseconds until the bounty next grows, or null if it won't. */
export function nextBountyIn(q: Quest, now: number) {
  if (!q.bounty || now < opensAt(q) || now >= closesAt(q)) return null;
  const every = q.bounty.everyHours * 3_600_000;
  const next = opensAt(q) + (Math.floor((now - opensAt(q)) / every) + 1) * every;
  return next > closesAt(q) ? null : next - now;
}

/** "1h 36m" / "2 days" style time left. */
export function timeLeft(ms: number) {
  const mins = Math.max(0, Math.floor(ms / 60_000));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24) return mins % 60 ? `${h}h ${mins % 60}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? "day" : "days"}`;
}
