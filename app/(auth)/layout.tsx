import type { ReactNode } from "react";
import Link from "next/link";
import "./auth.css";

const KEY_DATES = [
  { date: "21 Sep", label: "Registration opens" },
  { date: "29 Oct", label: "Registration closes" },
  { date: "31 Oct – 3 Nov", label: "Build window", major: true },
  { date: "6 Nov", label: "Winners announced" },
];

const PERKS = [
  "Your team, track and submission in one dashboard",
  "Live announcements and schedule updates",
  "Krifth platform access for every participant",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <header className="auth-top">
          <Link href="/" className="wordmark">
            Krifth<span className="wordmark-dot" />
          </Link>
          <Link href="/" className="auth-back">← Back to site</Link>
        </header>
        <div className="auth-form-area">{children}</div>
        <footer className="auth-foot">
          Need help? <a href="mailto:contact@krifth.com">contact@krifth.com</a>
        </footer>
      </section>

      <aside className="auth-aside" aria-label="Hackathon overview">
        <div className="auth-aside-glow" aria-hidden="true" />
        <div className="auth-aside-inner">
          <p className="auth-kicker">Krifth Hackathon · 2026</p>
          <h2 className="auth-aside-title">
            One place for<br />
            <span>everything you build.</span>
          </h2>

          <ul className="auth-perks">
            {PERKS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          <div className="auth-dates">
            <p className="auth-dates-label">Key dates</p>
            <ol>
              {KEY_DATES.map(({ date, label, major }) => (
                <li key={label} className={major ? "is-major" : undefined}>
                  <span>{date}</span>
                  <strong>{label}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>
    </main>
  );
}
