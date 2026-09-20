"use client";

import React, { useRef, useState } from "react";
import {
  Copy, Check, Crown, Trophy, UserPlus, UserMinus, SignOut, UsersThree,
} from "@phosphor-icons/react";
import { MY_TEAM, ME_ID, MAX_TEAM_SIZE, type Member, type Team } from "../team";
import { QUESTS, PREVIEW_WINNERS } from "../data";
import { useClock } from "../clock";
import { pointsAt } from "../quest-rules";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const todayIso = () => new Date().toISOString().slice(0, 10);

function GithubMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

type Pending = { kind: "remove"; member: Member } | { kind: "leave" } | null;

export default function TeamPage() {
  const { preview, now } = useClock();
  // Local only for now. TODO: send joins, removals and leaves to the backend.
  const [team, setTeam] = useState<Team | null>(MY_TEAM);
  const [copied, setCopied] = useState<"code" | "message" | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const ask = (p: Pending) => {
    setPending(p);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const confirm = () => {
    if (pending?.kind === "remove" && team) {
      setTeam({ ...team, members: team.members.filter((m) => m.id !== pending.member.id) });
    } else if (pending?.kind === "leave") {
      setTeam(null);
    }
    close();
  };

  const copy = async (what: "code" | "message") => {
    if (!team) return;
    const text =
      what === "code"
        ? team.inviteCode
        : `Join my team "${team.name}" for the Krifth Hackathon. Register at ${window.location.origin}/register and choose "Join a team" with the code ${team.inviteCode}.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked; the code is still visible to copy by hand */
    }
  };

  if (!team) return <NoTeam onJoin={setTeam} />;

  const me = team.members.find((m) => m.id === ME_ID);
  const iAmLead = !!me?.lead;
  const openSlots = Math.max(0, MAX_TEAM_SIZE - team.members.length);

  const wins = QUESTS.flatMap((q) => {
    const w = q.winner ?? (preview ? PREVIEW_WINNERS[q.id] : null);
    return w && w.name === team.name ? [{ q, w, pts: pointsAt(q, w, now) }] : [];
  });
  const points = wins.reduce((n, { pts }) => n + pts, 0);

  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">My team</p>
          <h1>{team.name}</h1>
        </div>
        <span className="db-chip">
          <UsersThree size={14} /> {team.members.length} of {MAX_TEAM_SIZE} members · {team.track}
        </span>
      </header>

      <section className="tm-top">
        <div className="tm-invite">
          <p className="db-eyebrow">Invite code</p>
          {openSlots > 0 ? (
            <>
              <div className="tm-code-row">
                <code className="tm-code">{team.inviteCode}</code>
                <button type="button" className="db-btn" onClick={() => copy("code")}>
                  {copied === "code" ? <><Check size={15} weight="bold" /> Copied</> : <><Copy size={15} /> Copy code</>}
                </button>
              </div>
              <p className="tm-hint">
                Teammates choose <strong>Join a team</strong> when they register and paste this code.{" "}
                {openSlots === 1 ? "1 place left." : `${openSlots} places left.`}
              </p>
              <button type="button" className="db-link-btn" onClick={() => copy("message")}>
                {copied === "message" ? "Invite message copied" : "Copy an invite message to send"}
              </button>
            </>
          ) : (
            <p className="tm-hint">Your team is full. Remove a member to free up a place.</p>
          )}
        </div>

        <div className="tm-points">
          <p className="db-eyebrow">Team quest points</p>
          <strong>{points.toLocaleString()}</strong>
          {wins.length === 0 ? (
            <span>No quests claimed yet.</span>
          ) : (
            <ul>
              {wins.map(({ q, pts }) => (
                <li key={q.id}><Trophy size={13} weight="fill" /> {q.title} <b>+{pts}</b></li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="tm-members-title">
        <div className="db-list-head">
          <h2 id="tm-members-title">Members</h2>
        </div>
        <ul className="tm-members">
          {team.members.map((m) => (
            <li key={m.id} className="tm-member">
              <span className={`db-avatar${m.lead ? " db-avatar-gold" : ""}`} aria-hidden="true">{initials(m.name)}</span>
              <div className="tm-who">
                <strong>
                  {m.name}
                  {m.id === ME_ID && <span className="tm-you">You</span>}
                </strong>
                <span>
                  {m.role} · joined {fmt(m.joinedOn)}
                </span>
              </div>
              <span className="tm-lead">{m.lead && <><Crown size={13} weight="fill" /> Team lead</>}</span>
              {m.github ? (
                <a className="tm-gh" href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer">
                  <GithubMark /> {m.github}
                </a>
              ) : (
                <span className="tm-gh tm-gh-none">No GitHub added</span>
              )}
              <div className="tm-actions">
                {iAmLead && m.id !== ME_ID && (
                  <button type="button" className="db-btn db-btn-sm" onClick={() => ask({ kind: "remove", member: m })}>
                    <UserMinus size={14} /> Remove
                  </button>
                )}
              </div>
            </li>
          ))}
          {Array.from({ length: openSlots }, (_, i) => (
            <li key={`slot-${i}`} className="tm-member tm-slot">
              <span className="tm-slot-icon" aria-hidden="true"><UserPlus size={16} /></span>
              <div className="tm-who">
                <strong>Open place</strong>
                <span>Share the invite code {team.inviteCode} to fill it.</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="tm-danger">
        <div>
          <strong>Leave team</strong>
          <p>
            {iAmLead && team.members.length > 1
              ? "You're the team lead. If you leave, the longest-standing member becomes lead."
              : "You'll lose access to this team's submission. Any quest points stay with the team."}
          </p>
        </div>
        <button type="button" className="db-btn db-btn-danger-outline" onClick={() => ask({ kind: "leave" })}>
          <SignOut size={15} /> Leave team
        </button>
      </section>

      <dialog
        ref={dialogRef}
        className="db-dialog"
        aria-labelledby="tm-dialog-title"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className="db-dialog-body">
          <span className="db-dialog-icon" aria-hidden="true">
            {pending?.kind === "remove" ? <UserMinus size={20} /> : <SignOut size={20} />}
          </span>
          <h2 id="tm-dialog-title">
            {pending?.kind === "remove" ? `Remove ${pending.member.name}?` : `Leave ${team.name}?`}
          </h2>
          <p>
            {pending?.kind === "remove"
              ? `They'll lose access to the team's dashboard and submission. They can rejoin with the invite code while there's a free place.`
              : "You can rejoin later with the invite code if there's still a free place."}
          </p>
          <div className="db-dialog-actions">
            <button type="button" className="db-btn" autoFocus onClick={close}>Cancel</button>
            <button type="button" className="db-btn db-btn-danger" onClick={confirm}>
              {pending?.kind === "remove" ? "Remove" : "Leave team"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/* Shown after leaving: create a new team or join one with a code. */
function NoTeam({ onJoin }: { onJoin: (t: Team) => void }) {
  const [mode, setMode] = useState<"join" | "create">("join");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (mode === "join") {
      // TODO: look the code up on the backend. Locally only the example team's code works.
      if (v.toUpperCase() !== MY_TEAM.inviteCode) return setError("No team uses that code. Check it with your team lead.");
      // You left as lead, so the longest-standing other member took over; you rejoin as a member.
      const others = MY_TEAM.members.filter((m) => m.id !== ME_ID).map((m, i) => ({ ...m, lead: i === 0 }));
      const me = MY_TEAM.members.find((m) => m.id === ME_ID)!;
      onJoin({ ...MY_TEAM, members: [...others, { ...me, lead: false, joinedOn: todayIso() }] });
    } else {
      if (!v) return setError("Give your team a name.");
      const me = MY_TEAM.members.find((m) => m.id === ME_ID)!;
      onJoin({
        name: v,
        mode: "team",
        track: MY_TEAM.track,
        inviteCode: `KRF-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        members: [{ ...me, lead: true, joinedOn: todayIso() }],
      });
    }
  };

  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">My team</p>
          <h1>You&apos;re not in a team</h1>
        </div>
      </header>
      <section className="tm-empty">
        <div className="db-filters" role="tablist" aria-label="Team options">
          <button type="button" role="tab" aria-selected={mode === "join"} className="db-filter"
            onClick={() => { setMode("join"); setError(""); setValue(""); }}>Join a team</button>
          <button type="button" role="tab" aria-selected={mode === "create"} className="db-filter"
            onClick={() => { setMode("create"); setError(""); setValue(""); }}>Create a team</button>
        </div>
        <form className="tm-form" onSubmit={submit} noValidate>
          <label htmlFor="tm-input">{mode === "join" ? "Invite code" : "Team name"}</label>
          <div className="tm-code-row">
            <input
              id="tm-input"
              className="tm-input"
              value={value}
              placeholder={mode === "join" ? "KRF-XXXX" : "e.g. Checkout Club"}
              onChange={(e) => { setValue(mode === "join" ? e.target.value.toUpperCase() : e.target.value); setError(""); }}
              aria-invalid={!!error}
            />
            <button type="submit" className="db-btn db-btn-primary">{mode === "join" ? "Join team" : "Create team"}</button>
          </div>
          {error && <p className="tm-error" role="alert">{error}</p>}
          <p className="tm-hint">
            {mode === "join"
              ? "Ask your team lead for the code on their My team page."
              : "You'll be the team lead and get a code to invite up to 3 teammates."}
          </p>
        </form>
      </section>
    </>
  );
}
