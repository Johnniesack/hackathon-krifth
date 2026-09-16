"use client";

import React, { useState } from "react";
import Link from "next/link";
import SocialButtons from "../SocialButtons";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    // TODO: replace with the real auth call, then route to /dashboard
    window.setTimeout(() => setLoading(false), 900);
  };

  return (
    <div className="auth-card">
      <p className="auth-eyebrow">Participant login</p>
      <h1 className="auth-title">Welcome back.</h1>
      <p className="auth-sub">
        Log in to your hackathon dashboard. New here? <Link href="/register">Create an account</Link>
      </p>

      <SocialButtons />

      <div className="auth-divider"><span>or with email</span></div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="auth-field">
          <span className="auth-field-row">
            Password
            <Link href="/login" className="auth-link-sm">Forgot password?</Link>
          </span>
          <span className="auth-input-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-eye"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <label className="auth-check">
          <input type="checkbox" defaultChecked /> Keep me logged in
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Logging in…" : <>Log in <ArrowRight size={16} weight="bold" /></>}
        </button>
      </form>
    </div>
  );
}
