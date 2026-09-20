"use client";

import Link from "next/link";
import { Check, ArrowRight, ChatCircle, Flag, UsersThree } from "@phosphor-icons/react";
import { QUESTS, HACK_START, HACK_END, SUBMIT_DEADLINE } from "./data";
import { MY_TEAM, MAX_TEAM_SIZE, ME_ID } from "./team";
import { DAY, localTime, useClock, useTicker } from "./clock";
import { statusAt, pointsAt } from "./quest-rules";
import { useProgress } from "./onboarding";

const CONTACT = "contact@krifth.com";

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

export default function OverviewPage() {
  const { now, preview } = useClock();
  const tick = useTicker(preview);
  const isDone = useProgress();

  const me = MY_TEAM.members.find((m) => m.id === ME_ID);
  const firstName = (me?.name ?? "there").split(" ")[0];
  const openSlots = Math.max(0, MAX_TEAM_SIZE - MY_TEAM.members.length);

  const hour = new Date(tick).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const start = localTime(HACK_START);
  const end = localTime(HACK_END, 23, 59, 59);
  const judged = localTime("2026-11-06", 23, 59, 59);
  const phase = now < start ? "before" : now <= end ? "live" : now <= judged ? "after" : "over";
  const daysToStart = Math.ceil((start - now) / DAY);

  const rows = QUESTS.map((q) => ({ q, status: statusAt(q, q.winner, now) }));
  const openQuests = rows.filter((r) => r.status === "open").length;
  const teamPoints = QUESTS.reduce(
    (n, q) => (q.winner?.name === MY_TEAM.name ? n + pointsAt(q, q.winner, now) : n),
    0,
  );

  const solo = MY_TEAM.mode === "solo";

  const steps = [
    { id: "registered", label: "You're registered", done: true, href: null, cta: null, optional: false },
    {
      id: "team",
      label: solo ? "You're entered as a solo builder" : `Team created — ${MY_TEAM.name}`,
      done: true,
      href: null,
      cta: null,
      optional: false,
    },
    // Inviting is never required: solo entries are welcome, and small teams are fine.
    ...(solo || openSlots === 0
      ? []
      : [{
          id: "invite",
          label: `Invite teammates — ${openSlots} ${openSlots === 1 ? "place" : "places"} left`,
          done: false,
          href: "/dashboard/team",
          cta: "Get invite code",
          optional: true,
        }]),
    {
      id: "merchant",
      label: "Pick a merchant to build for",
      done: isDone("pickedMerchant"),
      href: "/dashboard/submission",
      cta: "Add merchant",
      optional: false,
    },
    {
      id: "rules",
      label: "Read the quest rules",
      done: isDone("readRules"),
      href: "/dashboard/quests",
      cta: "Read them",
      optional: false,
    },
  ];

  const required = steps.filter((s) => !s.optional);
  const requiredDone = required.filter((s) => s.done).length;

  const allDone = requiredDone === required.length;

  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">Overview</p>
          <h1>{greeting}, {firstName}.</h1>
        </div>
        <span className={`db-chip ${phase === "live" ? "db-chip-live" : ""}`}>
          <span className="db-dot" />
          {phase === "before"
            ? `Build starts ${fmt(HACK_START)}`
            : phase === "live"
              ? `Build is live · ${openQuests} quests open`
              : phase === "after"
                ? "Judging in progress"
                : "Hackathon complete"}
        </span>
      </header>

      <section className={`ov-card${allDone ? " ov-card-slim" : ""}`}>
        <div className="ov-headline">
          <span className="ov-tick" aria-hidden="true"><Check size={18} weight="bold" /></span>
          <div>
            <h2>{MY_TEAM.name} is registered for the Krifth Hackathon.</h2>
            <p>
              {phase === "before" && (
                <>
                  Nothing is due yet. The build starts on <b>{fmt(HACK_START)}</b>
                  {daysToStart > 0 && <> — {daysToStart} {daysToStart === 1 ? "day" : "days"} away</>}. We&apos;ll tell you here when anything changes.
                </>
              )}
              {phase === "live" && (
                <>The build is running until <b>{fmt(HACK_END)}</b>. Claim quests as you finish them and submit by <b>{fmt(SUBMIT_DEADLINE)}</b>.</>
              )}
              {phase === "after" && <>Submissions are closed and judging is under way. Winners are announced on <b>6 November</b>.</>}
              {phase === "over" && <>That&apos;s a wrap. Thanks for building with Krifth.</>}
            </p>
          </div>
        </div>

        {!allDone && (
          <>
            <div className="ov-progress" aria-label={`${requiredDone} of ${required.length} steps done`}>
              <div className="ov-bar"><i style={{ width: `${(requiredDone / required.length) * 100}%` }} /></div>
              <span>{requiredDone} of {required.length} done</span>
            </div>

            <ul className="ov-steps">
              {steps.map((s) => (
                <li key={s.id} className={s.done ? "is-done" : undefined}>
                  <span className="ov-step-mark" aria-hidden="true">{s.done ? <Check size={12} weight="bold" /> : null}</span>
                  <span className="ov-step-label">
                    {s.label}
                    {s.optional && <em className="ov-optional">Optional</em>}
                  </span>
                  {!s.done && s.href && (
                    <Link href={s.href} className="db-btn db-btn-sm">
                      {s.cta} <ArrowRight size={13} weight="bold" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        {solo && (
          <p className="ov-solo">
            Building solo is completely fine — solo entries are judged the same way.{" "}
            <Link href="/dashboard/team">Invite someone</Link> any time if you change your mind.
          </p>
        )}

        <p className="ov-help">
          <ChatCircle size={15} /> Stuck or unsure about anything? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> — no question is too small.
        </p>
      </section>

      <section className="ov-grid">
        <Link href="/dashboard/quests" className="ov-tile">
          <span className="ov-tile-icon"><Flag size={18} weight="fill" /></span>
          <strong>{phase === "before" ? QUESTS.length : openQuests}</strong>
          <span>{phase === "before" ? "quests waiting" : "quests open now"}</span>
        </Link>
        <Link href="/dashboard/team" className="ov-tile">
          <span className="ov-tile-icon"><UsersThree size={18} weight="fill" /></span>
          <strong>{MY_TEAM.members.length} of {MAX_TEAM_SIZE}</strong>
          <span>teammates joined</span>
        </Link>
        <Link href="/dashboard/quests" className="ov-tile">
          <span className="ov-tile-icon"><Check size={18} weight="bold" /></span>
          <strong>{teamPoints.toLocaleString()}</strong>
          <span>quest points earned</span>
        </Link>
      </section>
    </>
  );
}
