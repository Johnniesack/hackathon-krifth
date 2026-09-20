"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Bell, Trophy, Timer, Megaphone, UsersThree } from "@phosphor-icons/react";
import { useClock } from "./clock";
import { buildNotices, timeAgo, type NoticeKind } from "./notifications";

const READ_KEY = "krifth-dashboard-read";
const listeners = new Set<() => void>();

// Read ids live in this browser only. TODO: store read state on the server once accounts exist.
function readIds(): string {
  try { return localStorage.getItem(READ_KEY) ?? ""; } catch { return ""; }
}
function markRead(ids: string[]) {
  const set = new Set(readIds().split(",").filter(Boolean));
  ids.forEach((id) => set.add(id));
  try { localStorage.setItem(READ_KEY, [...set].join(",")); } catch {}
  listeners.forEach((l) => l());
}

const ICONS: Record<NoticeKind, typeof Bell> = {
  quest: Trophy,
  deadline: Timer,
  announcement: Megaphone,
  team: UsersThree,
};

const PANEL_WIDTH = 360;

export default function NotificationBell() {
  const { now, preview } = useClock();
  const readRaw = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    readIds,
    () => "",
  );
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const read = new Set(readRaw.split(",").filter(Boolean));
  const notices = buildNotices(now, preview).slice(0, 8);
  const unread = notices.filter((n) => !read.has(n.id)).length;
  const open = pos !== null;

  const toggle = () => {
    if (open) return setPos(null);
    const r = btnRef.current!.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - 32);
    const left = Math.min(Math.max(16, r.left), window.innerWidth - width - 16);
    setPos({ top: r.bottom + 8, left });
  };

  // Close on outside click, Escape, or resize.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) setPos(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setPos(null); btnRef.current?.focus(); }
    };
    const onResize = () => setPos(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="db-bell"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        aria-controls="db-notices"
        onClick={toggle}
      >
        <Bell size={18} weight={open ? "fill" : "regular"} />
        {unread > 0 && <span className="db-bell-badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div
          ref={panelRef}
          id="db-notices"
          className="db-notices"
          role="dialog"
          aria-label="Notifications"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="db-notices-head">
            <strong>Notifications</strong>
            <button
              type="button"
              className="db-link-btn"
              disabled={unread === 0}
              onClick={() => markRead(notices.map((n) => n.id))}
            >
              Mark all as read
            </button>
          </div>

          {notices.length === 0 ? (
            <p className="db-notices-empty">You&apos;re all caught up.</p>
          ) : (
            <ul className="db-notices-list">
              {notices.map((n) => {
                const Icon = ICONS[n.kind];
                const isUnread = !read.has(n.id);
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`db-notice db-notice-${n.kind}${isUnread ? " is-unread" : ""}`}
                      onClick={() => markRead([n.id])}
                    >
                      <span className="db-notice-icon" aria-hidden="true"><Icon size={16} weight="duotone" /></span>
                      <span className="db-notice-text">
                        <strong>{n.title}</strong>
                        {n.body && <span>{n.body}</span>}
                        <time dateTime={new Date(n.at).toISOString()}>{timeAgo(n.at, now)}</time>
                      </span>
                      {isUnread && <span className="db-notice-dot" aria-label="Unread" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <Link href="/dashboard/announcements" className="db-notices-all" onClick={() => setPos(null)}>
            View all announcements
          </Link>
        </div>
      )}
    </>
  );
}
