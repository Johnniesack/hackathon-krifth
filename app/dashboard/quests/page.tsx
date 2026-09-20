"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trophy, UsersThree, User, Flag, HourglassMedium, Lightning, TrendUp } from "@phosphor-icons/react";
import { QUESTS, PREVIEW_WINNERS, HACK_START, HACK_END } from "../data";
import { statusAt, pointsAt, nextBountyIn, closesAt, opensAt, timeLeft } from "../quest-rules";
import { DAY, isoOf, localTime, useClock, useTicker } from "../clock";
import { ClaimDialog, useClaims, type ClaimDialogHandle } from "../claims";
import { markDone } from "../onboarding";

const toDay = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const daysBetween = (from: string, to: string) => Math.round((toDay(to) - toDay(from)) / DAY);
const fmt = (iso: string) =>
  new Date(toDay(iso)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const FILTERS = ["All", "Open", "Claimed"] as const;

export default function QuestsPage() {
  useEffect(() => markDone("readRules"), []);

  const { now, preview } = useClock();
  const tick = useTicker(preview); // seconds-accurate, for the countdown
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { claims, add, withdraw } = useClaims();
  const claimRef = useRef<ClaimDialogHandle>(null);
  // Withdrawing gives up your place in the review queue, so it takes a second tap.
  const [confirmWithdraw, setConfirmWithdraw] = useState<string | null>(null);

  const today = isoOf(new Date(now));

  // Countdown target: build start, then build close (23:59 on the last day).
  const start = localTime(HACK_START, 0, 0, 0);
  const end = localTime(HACK_END, 23, 59, 59);
  const phase = now < start ? "before" : now <= end ? "live" : "after";
  const remaining = Math.max(0, (phase === "before" ? start : end) - tick);
  const cd = {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1000),
  };
  const buildDay = daysBetween(HACK_START, today) + 1;
  const buildLength = daysBetween(HACK_START, HACK_END) + 1;

  const rows = QUESTS.map((q) => {
    const winner = q.winner ?? (preview ? PREVIEW_WINNERS[q.id] ?? null : null);
    return { q, winner, status: statusAt(q, winner, now), points: pointsAt(q, winner, now) };
  })
    // A live flash quest jumps to the top; flash quests that ended unclaimed drop out of sight.
    .filter((r) => !(r.q.flash && r.status === "closed"))
    .sort((a, b) => {
      const live = (r: { q: { flash?: boolean }; status: string }) => (r.q.flash && r.status === "open" ? 1 : 0);
      return live(b) - live(a);
    });
  const claimed = rows.filter((r) => r.status === "won");
  const open = rows.filter((r) => r.status === "open" || r.status === "upcoming");
  const pointsLeft = open.reduce((n, r) => n + r.points, 0);
  const shown = rows.filter((r) =>
    filter === "All" ? true : filter === "Claimed" ? r.status === "won" : r.status === "open" || r.status === "upcoming",
  );

  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">Side quests</p>
          <h1>Race for the firsts</h1>
        </div>
        <span className={`db-chip db-chip-${phase}`}>
          <span className="db-dot" />
          {phase === "before"
            ? `Build starts ${fmt(HACK_START)}`
            : phase === "live"
              ? `Build is live · day ${buildDay} of ${buildLength}`
              : "Build closed"}
        </span>
      </header>

      {preview && <p className="db-preview">Preview mode: showing 1 Nov, day 2 of the build, with sample winners.</p>}

      <section className="db-summary" aria-label="Quest summary">
        <div className="db-countdown" aria-live="polite">
          <span className="db-eyebrow">
            {phase === "before" ? "Build starts in" : phase === "live" ? `Build closes ${fmt(HACK_END)} · 23:59` : "Build has closed"}
          </span>
          <div className="db-digits">
            {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
              <div key={k}>
                <strong>{String(cd[k]).padStart(2, "0")}</strong>
                <span>{k}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="db-stats">
          <div><strong>{open.length}</strong><span>quests open</span></div>
          <div><strong>{claimed.length}</strong><span>claimed</span></div>
          <div><strong>{pointsLeft.toLocaleString()}</strong><span>points still available</span></div>
        </div>
      </section>

      <section aria-labelledby="db-list-title">
        <div className="db-list-head">
          <h2 id="db-list-title">All quests</h2>
          <div className="db-filters" role="tablist" aria-label="Filter quests">
            {FILTERS.map((f) => (
              <button key={f} type="button" role="tab" aria-selected={filter === f} className="db-filter" onClick={() => setFilter(f)}>
                {f}
                <span>{f === "All" ? rows.length : f === "Claimed" ? claimed.length : open.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="db-table" role="table" aria-label="Side quests">
          <div className="db-tr db-th" role="row">
            <span role="columnheader">Quest</span>
            <span role="columnheader" className="db-type">Type</span>
            <span role="columnheader">Points</span>
            <span role="columnheader">Winner / time left</span>
          </div>

          {shown.length === 0 && (
            <p className="db-none">
              {filter === "Claimed" ? "No quest has been claimed yet. The first one could be yours." : "Every quest has been claimed."}
            </p>
          )}

          {shown.map(({ q, winner, status, points }) => {
            const left = daysBetween(today, q.closes);
            const hidden = q.flash && status === "upcoming";
            const liveFlash = q.flash && status === "open";
            const bountyIn = status === "open" ? nextBountyIn(q, now) : null;
            return (
              <div key={q.id} role="row" className={`db-tr db-row is-${status}${liveFlash ? " is-flash" : ""}${hidden ? " is-hidden" : ""}`}>
                {status === "won" && <span className="db-ribbon" aria-hidden="true">Claimed</span>}
                <div role="cell" className="db-quest">
                  {q.flash && (
                    <span className="fq-label"><Lightning size={12} weight="fill" /> {liveFlash ? "Flash quest · live now" : "Flash quest"}</span>
                  )}
                  <strong>{hidden ? "??? Hidden quest" : q.title}</strong>
                  <p>{hidden ? q.hint : q.rule}</p>
                </div>
                <div role="cell" className="db-type"><span className="db-tag">{q.type === "race" ? "First to finish" : "Judged"}</span></div>
                <div role="cell" className="db-points">
                  <span>{points}<small> pts</small></span>
                  {q.bounty && status !== "won" && status !== "closed" && (
                    <span className="bq-rise" title={`Grows by ${q.bounty.step} points every ${q.bounty.everyHours} hours until someone claims it`}>
                      <TrendUp size={12} weight="bold" /> +{q.bounty.step}{bountyIn !== null ? ` in ${timeLeft(bountyIn)}` : ` / ${q.bounty.everyHours}h`}
                    </span>
                  )}
                </div>
                <div role="cell" className="db-state">
                  {status === "won" && winner ? (
                    <div className="db-winner">
                      <span className="db-avatar db-avatar-gold" aria-hidden="true">{initials(winner.name)}</span>
                      <div>
                        <strong><Trophy size={12} weight="fill" /> {winner.name}</strong>
                        <small>
                          {winner.kind === "team" ? <UsersThree size={12} /> : <User size={12} />}
                          {winner.kind === "team" ? "Team" : "Solo"} · {fmt(winner.wonOn)}
                        </small>
                      </div>
                    </div>
                  ) : status === "open" ? (
                    <div className="cl-cell">
                      <span className="db-left">
                        {q.flash ? `${timeLeft(closesAt(q) - now)} left`
                          : left === 0 ? "Last day" : `${left} ${left === 1 ? "day" : "days"} left`}
                      </span>
                      {q.type === "race" && (claims[q.id] ? (
                        <div className="cl-pending">
                          <span className="cl-chip"><HourglassMedium size={12} weight="fill" /> Claim in review</span>
                          <button
                            type="button"
                            className="db-link-btn cl-withdraw"
                            onClick={() => {
                              if (confirmWithdraw === q.id) { withdraw(q.id); setConfirmWithdraw(null); }
                              else { setConfirmWithdraw(q.id); window.setTimeout(() => setConfirmWithdraw(null), 4000); }
                            }}
                          >
                            {confirmWithdraw === q.id ? "Tap again to withdraw" : "Withdraw"}
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="db-btn db-btn-sm cl-btn" onClick={() => claimRef.current?.open(q)}>
                          <Flag size={13} weight="fill" /> Claim
                        </button>
                      ))}
                    </div>
                  ) : hidden ? (
                    <span className="db-muted">Drops without warning · {timeLeft(closesAt(q) - opensAt(q))} window</span>
                  ) : status === "upcoming" ? (
                    <span className="db-muted">Opens {fmt(q.opens)} · closes {fmt(q.closes)}</span>
                  ) : (
                    <span className="db-muted">Closed · unclaimed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="db-foot">
          Quest points are separate from the main judging score. The Krifth team checks every claim before a winner appears here.
        </p>
      </section>

      <ClaimDialog ref={claimRef} onClaim={add} />
    </>
  );
}
