"use client";

import React, { useState } from "react";
import Link from "next/link";
import SocialButtons from "../SocialButtons";
import {
  ArrowLeft, ArrowRight, Check, Eye, EyeSlash,
  Storefront, CreditCard, Lightning, ChartBar, User, Users, UsersThree,
} from "@phosphor-icons/react";

const TRACKS = [
  { id: "shop-themes", title: "Shop themes", icon: Storefront },
  { id: "payment-templates", title: "Payment templates", icon: CreditCard },
  { id: "social-checkout", title: "Instagram-to-checkout", icon: Lightning },
  { id: "multi-brand", title: "Multi-brand systems", icon: ChartBar },
];

const TEAM_TYPES = [
  { id: "solo", title: "Solo", icon: User },
  { id: "create", title: "Create a team", icon: UsersThree },
  { id: "join", title: "Join a team", icon: Users },
];

const ROLES = ["Design", "Frontend", "Backend", "Full-stack", "Product", "Other"];

const STEPS = ["Account", "Profile", "Team"];

function passwordScore(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    country: "",
    role: "Frontend",
    otherRole: "",
    github: "",
    track: "shop-themes",
    teamType: "solo",
    teamName: "",
    inviteCode: "",
    agree: false,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const score = passwordScore(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = "Enter your full name.";
      if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email.";
      if (form.password.length < 8) e.password = "Use at least 8 characters.";
    }
    if (step === 1) {
      if (!form.country.trim()) e.country = "Tell us where you're based.";
      if (form.role === "Other" && !form.otherRole.trim()) e.otherRole = "Tell us your role.";
    }
    if (step === 2) {
      if (form.teamType === "create" && !form.teamName.trim()) e.teamName = "Name your team.";
      if (form.teamType === "join" && !form.inviteCode.trim()) e.inviteCode = "Paste the invite code from your team lead.";
      if (!form.agree) e.agree = "You need to accept the rules to register.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true); // TODO: send `form` to the registration API
  };

  if (done) {
    const track = TRACKS.find((t) => t.id === form.track)?.title;
    return (
      <div className="auth-card auth-success">
        <span className="auth-success-icon"><Check size={26} weight="bold" /></span>
        <p className="auth-eyebrow">You&apos;re registered</p>
        <h1 className="auth-title">Welcome, {form.fullName.split(" ")[0]}.</h1>
        <p className="auth-sub">
          We sent a confirmation to <strong>{form.email}</strong>. Your dashboard opens when the build starts on 31 October.
        </p>
        <dl className="auth-summary">
          <div><dt>Track</dt><dd>{track}</dd></div>
          <div><dt>Role</dt><dd>{form.role === "Other" ? form.otherRole : form.role}</dd></div>
          <div>
            <dt>Team</dt>
            <dd>{form.teamType === "solo" ? "Solo" : form.teamType === "create" ? form.teamName : "Joining with invite"}</dd>
          </div>
        </dl>
        <Link href="/login" className="auth-submit">Go to login <ArrowRight size={16} weight="bold" /></Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <p className="auth-eyebrow">Registration · closes 29 Oct</p>
      <h1 className="auth-title">Join the hackathon.</h1>
      <p className="auth-sub">
        Already registered? <Link href="/login">Log in</Link>
      </p>

      <ol className="auth-steps" aria-label="Registration progress">
        {STEPS.map((label, i) => (
          <li key={label} className={i < step ? "is-done" : i === step ? "is-current" : undefined}>
            <span>{i < step ? <Check size={11} weight="bold" /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {step === 0 && (
          <>
            <SocialButtons />
            <div className="auth-divider"><span>or with email</span></div>

            <label className="auth-field">
              <span>Full name</span>
              <input autoComplete="name" placeholder="Ada Mensah" value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)} aria-invalid={!!errors.fullName} />
              {errors.fullName && <em className="auth-field-error">{errors.fullName}</em>}
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} />
              {errors.email && <em className="auth-field-error">{errors.email}</em>}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className="auth-input-wrap">
                <input type={showPassword ? "text" : "password"} autoComplete="new-password"
                  placeholder="At least 8 characters" value={form.password}
                  onChange={(e) => set("password", e.target.value)} aria-invalid={!!errors.password} />
                <button type="button" className="auth-eye"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {form.password && (
                <span className={`auth-strength s${score}`} aria-live="polite">
                  <i /><i /><i /><i />
                  <b>{["Too weak", "Weak", "Okay", "Good", "Strong"][score]}</b>
                </span>
              )}
              {errors.password && <em className="auth-field-error">{errors.password}</em>}
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <div className="auth-grid-2">
              <label className="auth-field">
                <span>Country</span>
                <input autoComplete="country-name" placeholder="Ghana" value={form.country}
                  onChange={(e) => set("country", e.target.value)} aria-invalid={!!errors.country} />
                {errors.country && <em className="auth-field-error">{errors.country}</em>}
              </label>
              <label className="auth-field">
                <span>GitHub <small>optional</small></span>
                <input placeholder="username" value={form.github}
                  onChange={(e) => set("github", e.target.value)} />
              </label>
            </div>

            <fieldset className="auth-fieldset">
              <legend>Your main role</legend>
              <div className="auth-chips">
                {ROLES.map((r) => (
                  <button type="button" key={r} aria-pressed={form.role === r}
                    className="auth-chip" onClick={() => set("role", r)}>{r}</button>
                ))}
              </div>
              {form.role === "Other" && (
                <>
                  <input className="auth-other-input" autoFocus aria-label="Your role"
                    placeholder="e.g. Data science, Marketing, DevOps" value={form.otherRole}
                    onChange={(e) => set("otherRole", e.target.value)} aria-invalid={!!errors.otherRole} />
                  {errors.otherRole && <em className="auth-field-error">{errors.otherRole}</em>}
                </>
              )}
            </fieldset>

            <fieldset className="auth-fieldset">
              <legend>Track</legend>
              <div className="auth-options">
                {TRACKS.map(({ id, title, icon: Icon }) => (
                  <button type="button" key={id} aria-pressed={form.track === id}
                    className="auth-option" onClick={() => set("track", id)}>
                    <Icon size={20} weight={form.track === id ? "fill" : "duotone"} />
                    {title}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 2 && (
          <>
            <fieldset className="auth-fieldset">
              <legend>How are you taking part?</legend>
              <div className="auth-options auth-options-3">
                {TEAM_TYPES.map(({ id, title, icon: Icon }) => (
                  <button type="button" key={id} aria-pressed={form.teamType === id}
                    className="auth-option" onClick={() => set("teamType", id)}>
                    <Icon size={20} weight={form.teamType === id ? "fill" : "duotone"} />
                    {title}
                  </button>
                ))}
              </div>
            </fieldset>

            {form.teamType === "create" && (
              <label className="auth-field">
                <span>Team name</span>
                <input placeholder="e.g. Checkout Club" value={form.teamName}
                  onChange={(e) => set("teamName", e.target.value)} aria-invalid={!!errors.teamName} />
                <small className="auth-hint">You&apos;ll get an invite code to share once you&apos;re registered. Teams can have up to 4 people.</small>
                {errors.teamName && <em className="auth-field-error">{errors.teamName}</em>}
              </label>
            )}

            {form.teamType === "join" && (
              <label className="auth-field">
                <span>Invite code</span>
                <input placeholder="KRF-XXXX" value={form.inviteCode}
                  onChange={(e) => set("inviteCode", e.target.value.toUpperCase())} aria-invalid={!!errors.inviteCode} />
                {errors.inviteCode && <em className="auth-field-error">{errors.inviteCode}</em>}
              </label>
            )}

            <label className="auth-check">
              <input type="checkbox" checked={form.agree} onChange={(e) => set("agree", e.target.checked)} />
              I agree to the hackathon rules and code of conduct.
            </label>
            {errors.agree && <em className="auth-field-error">{errors.agree}</em>}
          </>
        )}

        <div className="auth-actions">
          {step > 0 && (
            <button type="button" className="auth-ghost" onClick={() => { setErrors({}); setStep(step - 1); }}>
              <ArrowLeft size={16} weight="bold" /> Back
            </button>
          )}
          <button type="submit" className="auth-submit">
            {step === STEPS.length - 1 ? "Complete registration" : "Continue"} <ArrowRight size={16} weight="bold" />
          </button>
        </div>
      </form>
    </div>
  );
}
