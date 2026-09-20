"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { House, Flag, UsersThree, UploadSimple, Megaphone, SignOut, Sun, Moon } from "@phosphor-icons/react";
import { QUESTS } from "./data";
import NotificationBell from "./NotificationBell";
import "./dashboard.css";

// TODO: replace with the signed-in participant once auth is connected
const ME = { name: "Cephas", team: "Checkout Club", role: "Full Stack" };

const NAV = [
  { href: "/dashboard", label: "Overview", icon: House },
  { href: "/dashboard/quests", label: "Side quests", icon: Flag },
  { href: "/dashboard/team", label: "My team", icon: UsersThree },
  { href: "/dashboard/submission", label: "Submission", icon: UploadSimple },
  { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
];

type Theme = "dark" | "light";
const THEME_KEY = "krifth-dashboard-theme";
const listeners = new Set<() => void>();

// Saved choice first, then the device setting; dark on the server render.
function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function setTheme(t: Theme) {
  try { localStorage.setItem(THEME_KEY, t); } catch {}
  listeners.forEach((l) => l());
}

function useTheme() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    readTheme,
    (): Theme => "dark",
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const router = useRouter();
  const logoutRef = useRef<HTMLDialogElement>(null);

  const logOut = () => {
    logoutRef.current?.close();
    // TODO: clear the real session here once auth is connected
    router.push("/login");
  };
  const openCount = QUESTS.filter((q) => !q.winner).length;
  const initials = ME.name.split(" ").map((w) => w[0]).join("");

  return (
    <div className="db-shell" data-theme={theme}>
      <aside className="db-side">
        <div className="db-brand">
          <Link href="/" className="wordmark">Krifth<span className="wordmark-dot" /></Link>
          <NotificationBell />
        </div>

        <nav className="db-nav" aria-label="Dashboard">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === "/dashboard" || pathname === "/dashboard/" : pathname?.startsWith(href);
            return (
              <Link key={href} href={href} className="db-nav-link" aria-current={active ? "page" : undefined}>
                <Icon size={17} weight={active ? "fill" : "regular"} />
                <span>{label}</span>
                {href === "/dashboard/quests" && <em>{openCount} open</em>}
              </Link>
            );
          })}
        </nav>

        <div className="db-bottom">
          <button
            type="button"
            className="db-theme"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>

        <div className="db-me">
          <span className="db-avatar" aria-hidden="true">{initials}</span>
          <div>
            <strong>{ME.name}</strong>
            <small>{ME.team} · {ME.role}</small>
          </div>
          <button
            type="button"
            className="db-signout"
            aria-label="Log out"
            title="Log out"
            onClick={() => logoutRef.current?.showModal()}
          >
            <SignOut size={16} />
          </button>
        </div>
        </div>
      </aside>

      <main className="db-main">{children}</main>

      <dialog
        ref={logoutRef}
        className="db-dialog"
        aria-labelledby="db-logout-title"
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      >
        <div className="db-dialog-body">
          <span className="db-dialog-icon" aria-hidden="true"><SignOut size={20} /></span>
          <h2 id="db-logout-title">Log out of Krifth?</h2>
          <p>You&apos;ll need your email and password to get back into your dashboard.</p>
          <div className="db-dialog-actions">
            <button type="button" className="db-btn" autoFocus onClick={() => logoutRef.current?.close()}>
              Cancel
            </button>
            <button type="button" className="db-btn db-btn-danger" onClick={logOut}>
              Log out
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
