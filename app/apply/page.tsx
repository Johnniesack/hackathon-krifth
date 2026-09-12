"use client";

import React from "react";
import { ArrowLeft, Check, Storefront, Cpu, Lightning, ShoppingBagOpen, User, Users, Buildings, PaintBrush, CodeBlock, Database, TreeStructure, House, ChartBar, CreditCard } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

const TRACKS = [
  { id: "Shop Themes", title: "Shop themes with character", desc: "Build storefronts that reflect a unique visual identity.", icon: Storefront },
  { id: "Payment Templates", title: "Payment templates", desc: "Design trustworthy journeys to completed orders.", icon: CreditCard },
  { id: "Social-to-Checkout", title: "Instagram-to-checkout flows", desc: "Create seamless drops and buying journeys.", icon: Lightning },
  { id: "Multi-Brand", title: "Multi-brand commerce systems", desc: "Power multiple storefronts under one setup.", icon: ChartBar },
];

const TEAMS = [
  { id: "Solo Builder", title: "Solo Builder", icon: User },
  { id: "Small Team (2-3)", title: "Small Team", icon: Users },
  { id: "Full Studio (4+)", title: "Studio (4+)", icon: Buildings },
];

const SUPERPOWERS = [
  { id: "Design", title: "Design & UX", icon: PaintBrush },
  { id: "Frontend", title: "Frontend Eng", icon: CodeBlock },
  { id: "Backend", title: "Backend Systems", icon: Database },
  { id: "Full-Stack", title: "Full-Stack", icon: TreeStructure },
];

const STEP_IMAGES: Record<number, string> = {
  1: "/creative1.jpg",
  2: "/creative.jpg",
  3: "/creative2.jpg",
  4: "/creative4.jpg",
};

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    track: "Shop Themes",
    teamType: "Solo Builder",
    superpower: "Frontend",
    name: "",
    email: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (!formData.email || !formData.name) return;
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="ref-apply-shell">
      <div className="ref-apply-container">
        <div className="ref-card">
          {/* LEFT CONTENT */}
          <div className="ref-left">
            <header className="ref-header">
              <Link href="/" className="wordmark">
                Krifth<span className="wordmark-dot" />
              </Link>
            </header>

            {!submitted ? (
              <div className="ref-form-wrapper">
                {/* PROGRESS INDICATOR */}
                <div className="ref-progress">
                  <div className="ref-segments">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`ref-segment ${step >= s ? "active" : ""}`} />
                    ))}
                  </div>
                  <span className="ref-step-text">{step} of 4</span>
                </div>

                <form onSubmit={handleNext} className="ref-form">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="ref-step-content fade-in">
                      <h2>What kind of app are you building?</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {TRACKS.map((t) => {
                          const Icon = t.icon;
                          const isSelected = formData.track === t.id;
                          return (
                            <div
                              key={t.id}
                              className={`ref-option-card ${isSelected ? "selected" : ""}`}
                              onClick={() => setFormData({ ...formData, track: t.id })}
                              style={{ height: 'auto', padding: '24px 20px', alignItems: 'flex-start', textAlign: 'left', gap: '12px' }}
                            >
                              <div className="ref-option-icon" style={{ marginBottom: '4px' }}>
                                <Icon size={28} weight={isSelected ? "fill" : "duotone"} />
                              </div>
                              <span style={{ fontSize: '15.5px', lineHeight: '1.25' }}>{t.title}</span>
                              <span style={{ fontSize: '14px', color: isSelected ? 'rgba(237,255,254,0.85)' : 'var(--silver)', fontWeight: 400, marginTop: '2px', lineHeight: '1.5' }}>{t.desc}</span>
                              {isSelected && (
                                <div className="ref-option-check">
                                  <Check size={12} weight="bold" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="ref-step-content fade-in">
                      <h2>How will you participate?</h2>
                      <div className="ref-options-horizontal">
                        {TEAMS.map((t) => {
                          const Icon = t.icon;
                          const isSelected = formData.teamType === t.id;
                          return (
                            <div
                              key={t.id}
                              className={`ref-option-card ${isSelected ? "selected" : ""}`}
                              onClick={() => setFormData({ ...formData, teamType: t.id })}
                            >
                              <div className="ref-option-icon">
                                <Icon size={32} weight={isSelected ? "fill" : "duotone"} />
                              </div>
                              <span>{t.title}</span>
                              {isSelected && (
                                <div className="ref-option-check">
                                  <Check size={12} weight="bold" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="ref-step-content fade-in">
                      <h2>What is your primary superpower?</h2>
                      <div className="ref-options-horizontal">
                        {SUPERPOWERS.map((t) => {
                          const Icon = t.icon;
                          const isSelected = formData.superpower === t.id;
                          return (
                            <div
                              key={t.id}
                              className={`ref-option-card ${isSelected ? "selected" : ""}`}
                              onClick={() => setFormData({ ...formData, superpower: t.id })}
                            >
                              <div className="ref-option-icon">
                                <Icon size={32} weight={isSelected ? "fill" : "duotone"} />
                              </div>
                              <span>{t.title}</span>
                              {isSelected && (
                                <div className="ref-option-check">
                                  <Check size={12} weight="bold" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="ref-step-content fade-in">
                      <h2>Enter Details to Gain Access</h2>
                      <div className="ref-input-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                          type="text"
                          required
                          placeholder="Your Github or Username"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="ref-input"
                          autoFocus
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your email address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="ref-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTIONS */}
                  <div className="ref-actions">
                    {step === 4 ? (
                      <>
                        <button
                          type="button"
                          className="ref-btn-back"
                          onClick={handleBack}
                        >
                          Back
                        </button>

                        <button
                          type="button"
                          className="ref-btn-icon-home"
                          onClick={() => router.push("/")}
                          aria-label="Go home"
                          title="Home"
                        >
                          <House size={18} weight="fill" />
                        </button>

                        <button type="submit" className="ref-btn-continue">
                          Complete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="ref-btn-back"
                          onClick={handleBack}
                        >
                          {step === 1 ? "Return" : "Back"}
                        </button>
                        <button type="submit" className="ref-btn-continue">
                          Continue
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="ref-success fade-in">
                <h2>All set, {formData.name}!</h2>
                <p>We've registered <strong>{formData.email}</strong>.</p>
                <div className="ref-success-details">
                  <div>Track: <span>{formData.track}</span></div>
                  <div>Team: <span>{formData.teamType}</span></div>
                  <div>Skill: <span>{formData.superpower}</span></div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <Link href="/" className="ref-btn-continue" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    Home
                  </Link>
                  <Link href="/" className="ref-btn-back" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    Return Home
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT VISUAL */}
          <div className="ref-right">
            <div className="ref-image-wrapper">
              <Image
                key={step}
                src={STEP_IMAGES[step] ?? "/creative.jpg"}
                alt={`Step ${step} visual`}
                fill
                sizes="(max-width: 960px) 100vw, 50vw"
                loading="eager"
                priority={step === 1}
                className="ref-image"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
