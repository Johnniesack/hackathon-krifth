"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState, useSyncExternalStore } from "react";
import { Flag } from "@phosphor-icons/react";
import { MY_TEAM } from "./team";
import type { Quest } from "./data";

/*
 * A team's quest claims, waiting for the Krifth team to review.
 * Stored in this browser only. TODO: send claims to the backend and load their review status from it.
 */

export type Claim = { proof: string; note: string; at: number };
type Claims = Record<string, Claim>;

const KEY = `krifth-claims-${MY_TEAM.inviteCode}`;
const listeners = new Set<() => void>();

function readRaw() {
  try { return localStorage.getItem(KEY) ?? "{}"; } catch { return "{}"; }
}
function save(next: Claims) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
}
function parse(raw: string): Claims {
  try { return JSON.parse(raw) as Claims; } catch { return {}; }
}

export function useClaims() {
  const raw = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    readRaw,
    () => "{}",
  );
  const claims = parse(raw);
  return {
    claims,
    add: (id: string, c: Claim) => save({ ...claims, [id]: c }),
    withdraw: (id: string) => {
      const next = { ...claims };
      delete next[id];
      save(next);
    },
  };
}

/* ── dialog ── */

export type ClaimDialogHandle = { open: (q: Quest) => void };

const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]+$/i;

export const ClaimDialog = forwardRef<ClaimDialogHandle, { onClaim: (id: string, c: Claim) => void }>(
  function ClaimDialog({ onClaim }, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [quest, setQuest] = useState<Quest | null>(null);
    const [proof, setProof] = useState("");
    const [note, setNote] = useState("");
    const [error, setError] = useState("");

    useImperativeHandle(ref, () => ({
      open: (q) => {
        setQuest(q);
        setProof("");
        setNote("");
        setError("");
        dialogRef.current?.showModal();
      },
    }));

    const close = () => dialogRef.current?.close();

    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!quest) return;
      if (!proof.trim()) return setError("Add a link to your proof.");
      if (!URL_RE.test(proof.trim())) return setError("Enter a full link starting with https://");
      onClaim(quest.id, { proof: proof.trim(), note: note.trim(), at: Date.now() });
      close();
    };

    return (
      <dialog
        ref={dialogRef}
        className="db-dialog cl-dialog"
        aria-labelledby="cl-title"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <form className="db-dialog-body" onSubmit={submit} noValidate>
          <span className="db-dialog-icon sb-dialog-icon" aria-hidden="true"><Flag size={20} /></span>
          <h2 id="cl-title">Claim &ldquo;{quest?.title}&rdquo;</h2>
          <p className="cl-rule"><b>To win:</b> {quest?.rule}</p>

          <div className="sb-field">
            <label htmlFor="cl-proof">Proof link</label>
            <input
              id="cl-proof"
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={proof}
              onChange={(e) => { setProof(e.target.value); setError(""); }}
              aria-invalid={!!error}
              aria-describedby="cl-proof-hint"
              autoFocus
            />
            <div className="sb-field-foot" id="cl-proof-hint">
              {error ? <em>{error}</em> : <span>A screen recording, live link or screenshot folder the Krifth team can open.</span>}
            </div>
          </div>

          <div className="sb-field">
            <label htmlFor="cl-note">Note for the reviewers <small className="cl-optional">optional</small></label>
            <textarea
              id="cl-note"
              rows={3}
              placeholder="Anything that helps them check it quickly, like a test login."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <p className="cl-fine">
            The first valid claim wins. The Krifth team reviews claims in the order they arrive and announces the winner here.
          </p>

          <div className="db-dialog-actions">
            <button type="button" className="db-btn" onClick={close}>Cancel</button>
            <button type="submit" className="db-btn db-btn-primary">Send claim</button>
          </div>
        </form>
      </dialog>
    );
  },
);
