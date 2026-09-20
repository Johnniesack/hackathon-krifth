"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import { Check, CheckCircle, PaperPlaneTilt, PencilSimple, LockSimple, ArrowSquareOut } from "@phosphor-icons/react";
import { HACK_START, SUBMIT_DEADLINE } from "../data";
import { MY_TEAM, ME_ID } from "../team";
import { DAY, localTime, useClock } from "../clock";
import { markDone } from "../onboarding";

/* ── storage (this browser only). TODO: save drafts and submissions to the backend so the whole team shares them. ── */

type Fields = {
  project: string;
  merchant: string;
  storefront: string;
  video: string;
  repo: string;
  summary: string;
};

type Saved = {
  fields: Fields;
  status: "draft" | "submitted";
  savedAt: number;
  savedBy: string;
};

const EMPTY: Fields = { project: "", merchant: "", storefront: "", video: "", repo: "", summary: "" };
const KEY = `krifth-submission-${MY_TEAM.inviteCode}`;
const listeners = new Set<() => void>();

function readRaw() {
  try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}
function write(s: Saved) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  listeners.forEach((l) => l());
}
function parse(raw: string | null): Saved | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as Saved; } catch { return null; }
}

/* ── field rules ── */

const SUMMARY_MAX = 400;

const FIELDS: {
  key: keyof Fields;
  label: string;
  hint: string;
  placeholder: string;
  type: "text" | "url" | "textarea";
}[] = [
  { key: "project", label: "Project name", hint: "What judges will call your project.", placeholder: "e.g. Adinkra Threads storefront", type: "text" },
  { key: "merchant", label: "Merchant", hint: "The real shop or Instagram seller you built for.", placeholder: "e.g. @adinkrathreads or Makola Fabrics, Accra", type: "text" },
  { key: "storefront", label: "Live storefront link", hint: "The published Krifth store judges will try.", placeholder: "https://…", type: "url" },
  { key: "video", label: "Demo video", hint: "3 minutes or less. YouTube, Loom or Google Drive, viewable by anyone with the link.", placeholder: "https://…", type: "url" },
  { key: "repo", label: "Code repository", hint: "Public, or shared with the Krifth judges.", placeholder: "https://github.com/…", type: "url" },
  { key: "summary", label: "Short description", hint: "What you built, who it's for, and how a customer goes from discovery to paid order.", placeholder: "", type: "textarea" },
];

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.project.trim()) e.project = "Add a project name.";
  if (!f.merchant.trim()) e.merchant = "Name the merchant you built for.";
  for (const k of ["storefront", "video", "repo"] as const) {
    const v = f[k].trim();
    if (!v) e[k] = "Add a link.";
    else if (!/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v)) e[k] = "Enter a full link starting with https://";
  }
  if (!f.summary.trim()) e.summary = "Describe your project in a few sentences.";
  else if (f.summary.length > SUMMARY_MAX) e.summary = `Keep it under ${SUMMARY_MAX} characters.`;
  return e;
}

const CRITERIA = [
  { name: "Brand experience", weight: 30, check: "The store feels like the merchant's brand, not a template." },
  { name: "Design quality", weight: 30, check: "It looks right on a phone as well as a laptop." },
  { name: "Functionality", weight: 20, check: "A judge can add to cart and reach a paid order without help." },
  { name: "Innovation", weight: 20, check: "Your video shows what's new about your approach." },
];

const fmtTime = (ms: number) =>
  new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/* ── page ── */

export default function SubmissionPage() {
  const { now, ready } = useClock();
  const raw = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    readRaw,
    () => null,
  );
  const saved = parse(raw);

  const opens = localTime(HACK_START);
  const closes = localTime(SUBMIT_DEADLINE, 23, 59, 59);
  const phase = now < opens ? "before" : now <= closes ? "open" : "closed";
  const left = Math.max(0, closes - now);

  return (
    <>
      <header className="db-head">
        <div>
          <p className="db-eyebrow">Submission · {MY_TEAM.name}</p>
          <h1>Submit your project</h1>
        </div>
        <span className={`db-chip ${saved?.status === "submitted" ? "db-chip-live" : ""}`}>
          <span className="db-dot" />
          {saved?.status === "submitted" ? "Submitted" : saved ? "Draft saved" : "Not started"}
        </span>
      </header>

      <div className={`sb-deadline sb-${phase}`}>
        {phase === "closed" ? <LockSimple size={18} /> : <span className="db-dot" />}
        <p>
          {phase === "before" && <>Submissions open with the build on <b>31 Oct</b>. You can start a draft now.</>}
          {phase === "open" && (
            <>
              Submissions close <b>4 Nov at 23:59</b>
              {" · "}
              <b className="sb-left">
                {Math.floor(left / DAY)}d {Math.floor((left % DAY) / 3_600_000)}h {Math.floor((left % 3_600_000) / 60_000)}m left
              </b>
            </>
          )}
          {phase === "closed" && <>Submissions closed on <b>4 Nov at 23:59</b>. Your last saved version is what judges will see.</>}
        </p>
      </div>

      <div className="sb-layout">
        {/* mounted only after the saved draft has been read on the client, so it starts from it */}
        {ready && raw !== null ? (
          <SubmissionForm saved={saved} phase={phase} />
        ) : (
          <div className="sb-card sb-loading" aria-busy="true" />
        )}

        <aside className="sb-side">
          <div className="sb-card">
            <p className="db-eyebrow">What judges score</p>
            <ul className="sb-criteria">
              {CRITERIA.map((c) => (
                <li key={c.name}>
                  <div><strong>{c.name}</strong><span>{c.weight}%</span></div>
                  <p>{c.check}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="sb-card sb-note">
            <p className="db-eyebrow">Good to know</p>
            <ul>
              <li>One submission per team. Anyone on the team can edit it.</li>
              <li>You can change it as often as you like until the deadline.</li>
              <li>Keep your storefront live until judging ends on 5 Nov.</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

function SubmissionForm({ saved, phase }: { saved: Saved | null; phase: "before" | "open" | "closed" }) {
  const [fields, setFields] = useState<Fields>(saved?.fields ?? EMPTY);
  const [editing, setEditing] = useState(saved?.status !== "submitted");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [flash, setFlash] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const me = MY_TEAM.members.find((m) => m.id === ME_ID)?.name ?? "You";
  const locked = phase === "closed";
  const dirty = JSON.stringify(fields) !== JSON.stringify(saved?.fields ?? EMPTY);

  const set = (k: keyof Fields, v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const saveDraft = () => {
    if (fields.merchant.trim()) markDone("pickedMerchant");
    write({ fields, status: "draft", savedAt: Date.now(), savedBy: me });
    setFlash("Draft saved");
  };

  const trySubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`sb-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    dialogRef.current?.showModal();
  };

  const submit = () => {
    if (fields.merchant.trim()) markDone("pickedMerchant");
    dialogRef.current?.close();
    write({ fields, status: "submitted", savedAt: Date.now(), savedBy: me });
    setEditing(false);
  };

  /* submitted: read-only summary */
  if (!editing || locked) {
    const f = saved?.fields ?? fields;
    return (
      <section className="sb-card sb-summary">
        <div className="sb-summary-head">
          {saved?.status === "submitted" ? (
            <span className="sb-done"><CheckCircle size={22} weight="fill" /> Submitted</span>
          ) : (
            <span className="sb-done sb-done-muted"><LockSimple size={20} /> Not submitted</span>
          )}
          {saved && <span className="sb-meta">Last saved {fmtTime(saved.savedAt)} by {saved.savedBy}</span>}
        </div>
        <dl className="sb-dl">
          {FIELDS.map(({ key, label, type }) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd>
                {!f[key] ? <span className="sb-empty">Not added</span>
                  : type === "url" ? <a href={f[key]} target="_blank" rel="noreferrer">{f[key]} <ArrowSquareOut size={13} /></a>
                  : f[key]}
              </dd>
            </div>
          ))}
        </dl>
        {!locked && (
          <button type="button" className="db-btn" onClick={() => setEditing(true)}>
            <PencilSimple size={15} /> Edit submission
          </button>
        )}
      </section>
    );
  }

  /* editing */
  return (
    <form className="sb-card sb-form" onSubmit={trySubmit} noValidate>
      {saved?.status === "submitted" && (
        <p className="sb-banner">You&apos;re editing a submitted project. Submit again to update what judges see.</p>
      )}

      {FIELDS.map(({ key, label, hint, placeholder, type }) => (
        <div key={key} className="sb-field">
          <label htmlFor={`sb-${key}`}>{label}</label>
          {type === "textarea" ? (
            <textarea
              id={`sb-${key}`}
              rows={5}
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              aria-invalid={!!errors[key]}
              aria-describedby={`sb-${key}-hint`}
            />
          ) : (
            <input
              id={`sb-${key}`}
              type={type}
              inputMode={type === "url" ? "url" : undefined}
              placeholder={placeholder}
              value={fields[key]}
              onChange={(e) => set(key, e.target.value)}
              aria-invalid={!!errors[key]}
              aria-describedby={`sb-${key}-hint`}
            />
          )}
          <div className="sb-field-foot" id={`sb-${key}-hint`}>
            {errors[key] ? <em>{errors[key]}</em> : <span>{hint}</span>}
            {key === "summary" && (
              <span className={fields.summary.length > SUMMARY_MAX ? "sb-over" : ""}>
                {fields.summary.length}/{SUMMARY_MAX}
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="sb-actions">
        <span className="sb-meta" aria-live="polite">
          {flash && !dirty ? <><Check size={13} weight="bold" /> {flash}</>
            : dirty ? "Unsaved changes"
            : saved ? `Last saved ${fmtTime(saved.savedAt)} by ${saved.savedBy}` : ""}
        </span>
        {saved?.status === "submitted" && (
          <button type="button" className="db-btn" onClick={() => { setFields(saved.fields); setErrors({}); setEditing(false); }}>
            Cancel
          </button>
        )}
        {saved?.status !== "submitted" && (
          <button type="button" className="db-btn" onClick={saveDraft} disabled={!dirty}>
            Save draft
          </button>
        )}
        <button type="submit" className="db-btn db-btn-primary" disabled={phase === "before"}
          title={phase === "before" ? "Submissions open on 31 Oct" : undefined}>
          <PaperPlaneTilt size={15} /> {saved?.status === "submitted" ? "Update submission" : "Submit project"}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="db-dialog"
        aria-labelledby="sb-dialog-title"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      >
        <div className="db-dialog-body">
          <span className="db-dialog-icon sb-dialog-icon" aria-hidden="true"><PaperPlaneTilt size={20} /></span>
          <h2 id="sb-dialog-title">{saved?.status === "submitted" ? "Update your submission?" : "Submit your project?"}</h2>
          <p>
            Judges will see <b>{fields.project || "your project"}</b> for {fields.merchant || "your merchant"}.
            You can still edit it until 4 Nov at 23:59.
          </p>
          <div className="db-dialog-actions">
            <button type="button" className="db-btn" autoFocus onClick={() => dialogRef.current?.close()}>Keep editing</button>
            <button type="button" className="db-btn db-btn-primary" onClick={submit}>
              {saved?.status === "submitted" ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </dialog>
    </form>
  );
}
