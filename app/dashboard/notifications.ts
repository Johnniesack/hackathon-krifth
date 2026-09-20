import { QUESTS, PREVIEW_WINNERS } from "./data";
import { localTime } from "./clock";
import { opensAt, closesAt, pointsAt, wonAtMs } from "./quest-rules";

export type NoticeKind = "quest" | "deadline" | "announcement" | "team";

export type Notice = {
  id: string;
  kind: NoticeKind;
  title: string;
  body?: string;
  at: number; // when it appeared (ms)
};

/* Posts from the Krifth team. TODO: load these from the backend. */
const ANNOUNCEMENTS: Notice[] = [
  {
    id: "welcome",
    kind: "announcement",
    title: "Welcome to your Krifth dashboard",
    body: "Side quests open on 31 October. Read the quest rules now so you're ready to race.",
    at: localTime("2026-09-18", 10),
  },
];

/* Reminders show from `at` until `until`, worked out from the event dates. */
const REMINDERS: (Notice & { until: number })[] = [
  {
    id: "reg-closes",
    kind: "deadline",
    title: "Registration closes 29 Oct",
    body: "Make sure every teammate has registered and joined your team.",
    at: localTime("2026-10-22", 9),
    until: localTime("2026-10-29", 23, 59),
  },
  {
    id: "build-tomorrow",
    kind: "deadline",
    title: "The build starts tomorrow",
    body: "Side quests open at midnight on 31 October.",
    at: localTime("2026-10-30", 9),
    until: localTime("2026-10-30", 23, 59),
  },
  {
    id: "build-24h",
    kind: "deadline",
    title: "Build closes in 24 hours",
    body: "Unclaimed quests close at 23:59 on 3 November.",
    at: localTime("2026-11-02", 23, 59),
    until: localTime("2026-11-03", 23, 59),
  },
  {
    id: "submission",
    kind: "deadline",
    title: "Submissions close 4 Nov at 23:59",
    body: "Add your storefront link, demo video and repo on the Submission page.",
    at: localTime("2026-11-03", 12),
    until: localTime("2026-11-04", 23, 59),
  },
];

/* Sample activity shown only in preview mode. */
const PREVIEW_EXTRA: Notice[] = [
  { id: "p-team", kind: "team", title: "Kofi Boateng joined Checkout Club", at: localTime("2026-10-24", 15, 10) },
  {
    id: "p-judging",
    kind: "announcement",
    title: "Judging schedule posted",
    body: "Each team gets a 5-minute demo slot on 5 November.",
    at: localTime("2026-11-01", 8, 30),
  },
];

export function buildNotices(now: number, preview: boolean): Notice[] {
  const claims: Notice[] = QUESTS.flatMap((q) => {
    const w = q.winner ?? (preview ? PREVIEW_WINNERS[q.id] : null);
    if (!w) return [];
    return [{
      id: `claim-${q.id}`,
      kind: "quest" as const,
      title: `${w.name} claimed "${q.title}"`,
      body: `+${pointsAt(q, w, wonAtMs(w))} points · ${w.kind === "team" ? "Team" : "Solo"}`,
      at: wonAtMs(w),
    }];
  });

  const flashes: Notice[] = QUESTS.filter((q) => q.flash && now >= opensAt(q) && now <= closesAt(q)).map((q) => ({
    id: `flash-${q.id}`,
    kind: "deadline" as const,
    title: `Flash quest is live: ${q.title}`,
    body: `${q.points} points, first to finish. Closes at ${q.closesTime === "24:00" ? "midnight" : q.closesTime}.`,
    at: opensAt(q),
  }));

  const reminders: Notice[] = REMINDERS.filter((r) => now >= r.at && now <= r.until);

  return [...ANNOUNCEMENTS, ...claims, ...flashes, ...reminders, ...(preview ? PREVIEW_EXTRA : [])]
    .filter((n) => n.at <= now)
    .sort((a, b) => b.at - a.at);
}

export function timeAgo(at: number, now: number) {
  const mins = Math.max(0, Math.round((now - at) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
