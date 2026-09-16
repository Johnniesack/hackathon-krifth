"use client";

import React, { useState } from "react";
import { ArrowUpRight, Sparkle, Trophy, Timer, Key, Coins, RocketLaunch, ShoppingBag, ChartBar, Lightning, List, X, ChatCircle, Copy, Check, EnvelopeSimple } from "@phosphor-icons/react";
import LightPillar from "./components/LightPillar";
import KrifthLogo from "./components/KrifthLogo";

/* ─────────────── DATA ─────────────── */



/* ─────────────── THE CHALLENGE ─────────────── */

function TheChallenge() {
  return (
    <section className="challenge-section" id="challenge">
      <div className="challenge-inner">
        <div className="challenge-header">
          <p className="eyebrow">The challenge / 01</p>
          <h2>Make small brands<br /><span className="challenge-accent">easy to buy from.</span></h2>
          <p className="challenge-brief">
            Take a real local shop or Instagram-first brand from “look at this” to “I’ll take it.” Design the storefront, payment flow, or complete buying experience they need to sell with confidence.
          </p>

          <div className="challenge-goal-box">
            <div className="goal-label">
              <Sparkle size={14} weight="fill" /> Goal
            </div>
            <p className="goal-text">
              Choose a real local shop or Instagram brand and build the template they need: a storefront theme, a payment flow, or both. Make it easy for their customers to discover, trust, and buy.
            </p>
          </div>
        </div>

        <aside className="challenge-signal" aria-label="The challenge in three parts">
          <div className="signal-header">
            <span>Build brief</span>
            <span className="signal-status"><i /> Open to interpretation</span>
          </div>
          <div className="signal-phrase" aria-hidden="true">
            <span>shop</span><b>→</b><span>story</span><b>→</b><span>checkout</span>
          </div>
          <p className="signal-copy">One connected experience for the brands already building an audience in public.</p>
          <div className="signal-steps">
            <div><span>01</span><strong>Choose a brand</strong><em>local shop or Instagram seller</em></div>
            <div><span>02</span><strong>Shape the system</strong><em>theme, payment flow, or both</em></div>
            <div><span>03</span><strong>Make the sale feel natural</strong><em>clear, trusted, unmistakably theirs</em></div>
          </div>
        </aside>

      </div>
    </section>
  );
}

/* ─────────────── WHAT YOU CAN BUILD ─────────────── */

function WhatYouCanBuild() {
  const cards = [
    {
      icon: <ShoppingBag size={20} weight="duotone" />,
      title: "Shop themes with character",
      desc: "Build a storefront that reflects a local shop or Instagram brand, from its visual identity to the way products are discovered.",
    },
    {
      icon: <Sparkle size={20} weight="duotone" />,
      title: "Payment templates",
      desc: "Design a clear, trustworthy payment journey that helps small brands turn social attention into completed orders.",
    },
    {
      icon: <Lightning size={20} weight="duotone" />,
      title: "Instagram-to-checkout flows",
      desc: "Create product drops, collection pages, and buying journeys that feel natural from an Instagram post all the way to checkout.",
    },
    {
      icon: <ChartBar size={20} weight="duotone" />,
      title: "Multi-brand commerce systems",
      desc: "Power multiple storefronts under one merchant setup, each with its own look, audience, and selling strategy.",
    },
  ];

  return (
    <section className="build-section" id="about">
      <div className="build-inner">
        <div className="build-header">
          <div className="build-header-left">
            <p className="eyebrow">What you can build</p>
            <h2>What you can build<br />with Krifth.</h2>
            <p className="build-tagline">Build the shop your community already wants to buy from.</p>
          </div>
          <div className="build-header-right">
            <p className="build-body">
              Krifth gives builders a fast path to creating commerce templates for real small businesses. Start with a shop or Instagram brand, shape its story, and make buying feel effortless.
            </p>
            <div className="build-header-ctas">
              <a className="aurora-button" href="#register">Start building <ArrowUpRight size={15} weight="bold" /></a>
            </div>
          </div>
        </div>

        <div className="build-grid">
          {cards.map(({ icon, title, desc }) => (
            <article className="build-card" key={title}>
              <div className="build-card-top">
                <span className="build-icon">{icon}</span>
                <span className="build-accent-dot" />
              </div>
              <h3 className="build-title">{title}</h3>
              <p className="build-desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ─────────────── TIMELINE ─────────────── */

const SCHEDULE = [
  { start: "2026-09-21", end: "2026-09-21", day: "21", month: "Sep", title: "Registration opens", note: "Teams can start applying" },
  { start: "2026-10-29", end: "2026-10-29", day: "29", month: "Oct", title: "Registration ends", note: "Last day to apply" },
  { start: "2026-10-30", end: "2026-10-30", day: "30", month: "Oct", title: "Introduction", note: "Kickoff and brief walkthrough" },
  { start: "2026-10-31", end: "2026-11-03", day: "31", dayEnd: "03", month: "Oct", monthEnd: "Nov", title: "Hackathon", note: "Four days of building", major: true },
  { start: "2026-11-04", end: "2026-11-04", day: "04", month: "Nov", title: "Submission deadline", note: "Final builds due" },
  { start: "2026-11-05", end: "2026-11-05", day: "05", month: "Nov", title: "Judging", note: "Judges review every demo" },
  { start: "2026-11-06", end: "2026-11-06", day: "06", month: "Nov", title: "Closing & prizes", note: "Winners announced" },
];

function Timeline() {
  const [today, setToday] = useState<string | null>(null);
  React.useEffect(() => {
    const d = new Date();
    setToday(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  const status = (start: string, end: string) => {
    if (!today) return "upcoming";
    if (today > end) return "done";
    if (today >= start) return "live";
    return "upcoming";
  };
  const nextIdx = today ? SCHEDULE.findIndex(({ end }) => today <= end) : -1;

  return (
    <section className="timeline-section" id="timeline">
      <div className="timeline-container">
        <div className="timeline-header-premium">
          <div className="eyebrow-wrapper">
            <span className="premium-eyebrow">Timeline</span>
            <div className="eyebrow-line"></div>
          </div>
          <h2>Key dates,<br/><span className="text-gradient">September to November.</span></h2>
          <p className="timeline-subtext-premium">
            Registration opens 21 September. The build runs from 31 October to 3 November, and winners are announced on 6 November.
          </p>
        </div>

        <ol className="sched">
          {SCHEDULE.map(({ start, end, day, dayEnd, month, monthEnd, title, note, major }, idx) => {
            const st = status(start, end);
            return (
              <li
                key={start}
                className={`sched-item sched-${st}${major ? " sched-major" : ""}${idx === nextIdx ? " sched-next" : ""}`}
              >
                <span className="sched-node" aria-hidden="true" />
                <time className="sched-date" dateTime={start}>
                  <span className="sched-day">{day}{dayEnd && <>–{dayEnd}</>}</span>
                  <span className="sched-month">{month}{monthEnd && <> – {monthEnd}</>}</span>
                </time>
                <div className="sched-body">
                  <h3 className="sched-title">{title}</h3>
                  <p className="sched-note">{note}</p>
                </div>
                {st === "live" ? (
                  <span className="sched-tag sched-tag-live">Live now</span>
                ) : idx === nextIdx ? (
                  <span className="sched-tag">Up next</span>
                ) : major ? (
                  <span className="sched-tag">4 days</span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────── JUDGING CRITERIA ─────────────── */

function JudgingCriteria() {
  const criteria = [
    {
      num: "01",
      title: "Brand experience",
      tag: "30% Weight",
      desc: "Does the storefront clearly communicate the brand’s personality and product story?",
    },
    {
      num: "02",
      title: "Design quality",
      tag: "30% Weight",
      desc: "Is the visual design refined, modern, and consistent across devices?",
    },
    {
      num: "03",
      title: "Functionality",
      tag: "20% Weight",
      desc: "Does the theme work as a believable commerce experience with clear structure and flow?",
    },
    {
      num: "04",
      title: "Innovation",
      tag: "20% Weight",
      desc: "Does the concept show originality, strategy, and a strong understanding of Krifth’s capabilities?",
    },
  ];

  return (
    <section className="judging-section" id="judging">
      <div className="judging-inner">
        <div className="judging-top-bar">
          <div>
            <p className="eyebrow">Evaluation Rubric</p>
            <h2>Judging criteria</h2>
          </div>
          <p className="judging-lead-copy">
            We’re rewarding creativity, polish, and real product thinking.
          </p>
        </div>

        <div className="judging-matrix">
          {criteria.map(({ num, title, tag, desc }) => (
            <div className="judging-row" key={title}>
              <div className="judging-row-num">{num}</div>
              <div className="judging-row-main">
                <div className="judging-row-head">
                  <h3 className="judging-row-title">{title}</h3>
                  <span className="judging-row-tag">{tag}</span>
                </div>
                <p className="judging-row-desc">{desc}</p>
              </div>
              <div className="judging-row-accent" aria-hidden="true">
                <span className="judging-signal-dot" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── REWARDS & PRIZES ─────────────── */

function Prizes() {
  const rewards = [
    {
      icon: <Key size={22} weight="duotone" />,
      title: "Access to Krifth",
      desc: "Unlock access to the Krifth platform and continue building beyond the hackathon.",
      badge: "Platform Access",
      featured: false,
    },
    {
      icon: <Coins size={22} weight="duotone" />,
      title: "Token access",
      desc: "Earn token access for promising teams and standout product ideas.",
      badge: "Ecosystem Grant",
      featured: false,
    },
    {
      icon: <Trophy size={22} weight="duotone" />,
      title: "Cash prize",
      desc: "Compete for a cash reward for the strongest storefront experience or most impactful concept.",
      badge: "Grand Award",
      featured: true,
    },
    {
      icon: <RocketLaunch size={22} weight="duotone" />,
      title: "Support + visibility",
      desc: "Get feedback, exposure, and the opportunity to continue developing your idea with the Krifth team.",
      badge: "Incubation",
      featured: false,
    },
  ];

  return (
    <section className="prizes-section" id="prizes">
      <div className="prizes-inner">
        <div className="prizes-header">
          <p className="eyebrow">Rewards</p>
          <h2>What you can win.</h2>
          <p className="prizes-subtext">Win access, build with Krifth, and get rewarded for standout execution.</p>
        </div>

        <div className="rewards-grid">
          {rewards.map(({ icon, title, desc, badge, featured }) => (
            <article key={title} className={`reward-card${featured ? " reward-featured" : ""}`}>
              <div className="reward-card-top">
                <span className="reward-icon">{icon}</span>
                <span className="reward-badge">{badge}</span>
              </div>
              <h3 className="reward-title">{title}</h3>
              <p className="reward-desc">{desc}</p>
              <div className="reward-bottom-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FINAL CTA ─────────────── */

/* ─────────────── FOOTER ─────────────── */

function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <KrifthLogo className="footer-wordmark" href="#top" dotClassName="wordmark-dot" />
          <p className="footer-tagline">
            Building the future of business operations.
          </p>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-nav">
          <a href="#about">About</a>
          <a href="#challenge">Challenge</a>
          <a href="#timeline">Timeline</a>
          <a href="#judging">Judging criteria</a>
          <a href="#prizes">Rewards</a>
        </div>

        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} KRIFTH. ALL RIGHTS RESERVED.</small>
          <small className="footer-legal">BUILT FOR MERCHANTS & OPERATORS</small>
        </div>
      </div>
    </footer>
  );
}

const CONTACT_EMAIL = "contact@krifth.com";

/* ─────────────── PAGE ─────────────── */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const openContact = () => {
    setEmailCopied(false);
    setContactOpen(true);
  };

  const closeContact = () => setContactOpen(false);

  const copyContactEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      /* clipboard unavailable */
    }
  };

  React.useEffect(() => {
    if (!contactOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactOpen]);

  return (
    <main className="krifth-shell">
      {/* NAV */}
      <nav className="site-nav" aria-label="Main navigation">
        <KrifthLogo href="#top" />
        <div className="nav-pill">
          <span className="nav-home-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
          </span>
          <a href="#about">About</a>
          <a href="#challenge">Challenge</a>
          <a href="#timeline">Timeline</a>
          <a href="#judging">Judging criteria</a>
          <a href="#prizes">Rewards</a>
        </div>
        <a className="nav-cta-pill" href="/apply">
          Apply now <ArrowUpRight size={14} weight="bold" />
        </a>
        <button
          className="mobile-menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </nav>
      {/* MOBILE DRAWER */}
      <div className={`mobile-drawer${menuOpen ? ' mobile-drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-drawer-inner">
          <a href="#about"    onClick={closeMenu}>About</a>
          <a href="#challenge" onClick={closeMenu}>Challenge</a>
          <a href="#timeline"  onClick={closeMenu}>Timeline</a>
          <a href="#judging"   onClick={closeMenu}>Judging criteria</a>
          <a href="#prizes"    onClick={closeMenu}>Rewards</a>
          <a href="/apply" className="mobile-drawer-cta" onClick={closeMenu}>
            Apply now <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="top" style={{ position: 'relative', overflow: 'hidden' }}>
        <LightPillar 
          intensity={0.8} 
          glowAmount={0.007} 
          pillarWidth={4.0}
          pillarHeight={0.6}
          topColor="#7dff9a"
          bottomColor="#08733f"
          interactive={true} 
          className="hero-background-pillar"
        />
        <div className="hero-inner" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-copy">
            <p className="hero-kicker">The Krifth hackathon · build for the real world</p>
            <h1>
              <span className="hero-title-line">Hack with</span>
              <span className="hero-highlight-text hero-title-line">Krifth.</span>
            </h1>
            <p className="hero-intro">
              Join the Krifth Hackathon to create a theme or payment template for a local shop <br className="hero-copy-break" />or Instagram-first brand then turn their products, story, and checkout into one polished experience.
            </p>
            <div className="hero-actions">
              <a className="aurora-button" href="/apply">
                Apply now <ArrowUpRight size={16} weight="bold" />
              </a>
              <a className="ghost-button" href="#challenge">
                View challenge <ArrowUpRight size={16} weight="bold" />
              </a>
            </div>
            <div className="hero-event-pills">
              <div className="event-pill">
                <Timer size={15} weight="bold" className="event-pill-icon" />
                <span>4 Days to Build</span>
              </div>
              <div className="event-pill-divider" />
              <div className="event-pill">
                <Trophy size={15} weight="bold" className="event-pill-icon" />
                <span>Exclusive Platform Rewards</span>
              </div>
              <div className="event-pill-divider" />
              <div className="event-pill">
                <Sparkle size={15} weight="bold" className="event-pill-icon" />
                <span>Global Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL SECTIONS */}
      <WhatYouCanBuild />
      <TheChallenge />
      <Timeline />
      <JudgingCriteria />
      <Prizes />
      
      {/* FINAL CTA WITH APPLY NAVIGATION */}
      <section className="final-cta" id="register">
        <div className="final-cta-inner">
          <div className="cta-sparkles" aria-hidden="true">
            <Sparkle size={14} weight="fill" className="sp sp1" />
            <Sparkle size={9} weight="fill" className="sp sp2" />
            <Sparkle size={11} weight="fill" className="sp sp3" />
            <Sparkle size={7} weight="fill" className="sp sp4" />
          </div>
          <h2 className="cta-heading">
            Build the next storefront<br />
            <span className="cta-gradient">story with Krifth.</span>
          </h2>
          <p className="cta-body">
          Join the Krifth Hackathon to help a local shop or Instagram brand look better online, accept payments with confidence, and turn attention into sales.
          </p>
          <div className="cta-actions">
            <a className="aurora-button" href="/apply">
              Apply now <ArrowUpRight size={16} weight="bold" />
            </a>
            <a className="ghost-button" href="#timeline">
              See timeline <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
        <div className="cta-glow" aria-hidden="true" />
      </section>

      <Footer />

      <button
        type="button"
        className="contact-fab"
        aria-label="Contact Krifth"
        aria-haspopup="dialog"
        aria-expanded={contactOpen}
        onClick={openContact}
      >
        <ChatCircle size={26} weight="fill" aria-hidden />
      </button>

      {contactOpen ? (
        <div className="contact-modal-root" role="presentation">
          <button
            type="button"
            className="contact-modal-backdrop"
            aria-label="Close contact dialog"
            onClick={closeContact}
          />
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <button
              type="button"
              className="contact-modal-close"
              aria-label="Close"
              onClick={closeContact}
            >
              <X size={18} weight="bold" />
            </button>
            <div className="contact-modal-icon" aria-hidden>
              <EnvelopeSimple size={28} weight="duotone" />
            </div>
            <p className="contact-modal-eyebrow">Get in touch</p>
            <h2 id="contact-modal-title" className="contact-modal-title">
              Contact the Krifth team
            </h2>
            <p className="contact-modal-copy">
              Questions about the hackathon, partnerships, or access? Reach us anytime.
            </p>
            <p className="contact-modal-email">{CONTACT_EMAIL}</p>
            <div className="contact-modal-actions">
              <button
                type="button"
                className="aurora-button contact-modal-btn"
                onClick={copyContactEmail}
              >
                {emailCopied ? (
                  <>
                    Copied <Check size={16} weight="bold" />
                  </>
                ) : (
                  <>
                    Copy email <Copy size={16} weight="bold" />
                  </>
                )}
              </button>
              <button type="button" className="ghost-button contact-modal-btn" onClick={closeContact}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
