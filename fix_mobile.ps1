$f = "$PSScriptRoot\app\globals.css"
$css = Get-Content $f -Raw -Encoding UTF8

$startMarker = '@media (max-width: 820px)'
$endMarker420 = '@media (max-width: 420px)'

$si = $css.IndexOf($startMarker)
# Find end of the 420px block - the last `}` after the 420px query
$ei = $css.IndexOf($endMarker420)
# Walk forward to find the closing `}` of that block
$depth = 0
$pos = $ei
while ($pos -lt $css.Length) {
    if ($css[$pos] -eq '{') { $depth++ }
    if ($css[$pos] -eq '}') {
        $depth--
        if ($depth -eq 0) { break }
    }
    $pos++
}
$endIdx = $pos + 1  # include the closing }

$newBlock = @'
@media (max-width: 820px) {
  .site-nav {
    width: calc(100% - 32px);
    grid-template-columns: 1fr auto;
    gap: 12px;
  }

  .nav-pill { display: none; }
  .nav-cta-pill { justify-self: end; }

  .hero { min-height: auto; padding-bottom: 48px; }

  .hero-inner {
    width: min(100% - 28px, 1200px);
    gap: 32px;
    text-align: center;
    align-items: center;
  }

  .hero-copy {
    max-width: 620px;
    margin-top: 8px;
    align-items: center;
    text-align: center;
  }

  .hero-intro { max-width: 100%; }
  .hero-actions, .hero-event-pills { justify-content: center; }
  .hero-visual { max-width: 560px; margin: 8px auto 0; }

  .how-inner, .judging-top-bar {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .visual-pill { display: none; }
  .challenge-inner { grid-template-columns: 1fr; gap: 40px; }
  .challenge-signal { min-height: auto; }
  .build-header { grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 760px) {
  .site-nav {
    width: calc(100% - 28px);
    height: 64px;
    grid-template-columns: 1fr auto auto;
    gap: 10px;
  }

  .mobile-menu-btn { display: inline-flex; }
  .nav-cta-pill { display: none; }

  .hero { padding-top: 100px; }
  .hero-inner { gap: 28px; }
  .hero-copy { max-width: 100%; }

  .hero-copy h1 {
    max-width: 520px;
    font-size: clamp(2.7rem, 11vw, 4.2rem);
  }

  .hero-actions, .hero-event-pills { justify-content: center; width: 100%; }
  .hero-actions { flex-direction: column; align-items: stretch; }

  .hero-actions .aurora-button,
  .hero-actions .ghost-button,
  .cta-actions .aurora-button,
  .cta-actions .ghost-button {
    width: 100%;
    justify-content: center;
  }

  .hero-event-pills { flex-wrap: wrap; gap: 10px 8px; }
  .event-pill-divider { display: none; }

  .signal-band { width: calc(100% - 32px); grid-template-columns: 1fr 1fr; }
  .signal-band div { min-height: 150px; padding: 24px 18px; }
  .signal-band div:nth-child(2) { border-right: 0; }
  .signal-band div:nth-child(-n+2) { border-bottom: 1px solid rgba(237, 255, 254, .16); }

  .tracks-section, .schedule-section {
    width: calc(100% - 28px);
    grid-template-columns: 1fr;
  }
  .tracks-section { gap: 62px; }
  .schedule-section { gap: 50px; }
  .register-well { margin: 0 12px; }
  .register-well h2 { font-size: clamp(3rem, 13vw, 4.4rem); }
  .signal-phrase { margin: 40px 0 14px; font-size: clamp(1.8rem, 9vw, 3.4rem); }
}

@media (max-width: 560px) {
  .site-nav {
    width: calc(100% - 20px);
    height: 60px;
    gap: 10px;
    grid-template-columns: 1fr auto;
  }
  .wordmark { font-size: 22px; }
  .mobile-menu-btn { display: inline-flex; }

  .hero { padding-top: 88px; }
  .hero-inner { width: calc(100% - 24px); gap: 24px; }
  .hero-copy { margin-top: 10px; }
  .hero-copy h1 { font-size: clamp(2.3rem, 12vw, 3.4rem); line-height: 0.94; }
  .hero-intro { font-size: 14.5px; line-height: 1.6; }
  .hero-actions { flex-direction: column; width: 100%; gap: 12px; }
  .hero-event-pills { gap: 8px; margin-top: 28px; padding-top: 20px; }
  .event-pill { font-size: 10px; padding: 7px 10px; }
  .event-pill-divider { display: none; }

  .tracks-section, .schedule-section, .build-inner, .challenge-inner,
  .how-inner, .judging-inner, .prizes-inner, .what-inner,
  .footer-inner, .final-cta-inner { width: calc(100% - 24px); }

  .what-section { padding-top: clamp(72px, 14vw, 110px); }
  .challenge-section { padding: clamp(64px, 12vw, 100px) 0; }
  .build-section { padding: clamp(64px, 12vw, 100px) 0; }
  .how-section { padding: clamp(72px, 12vw, 110px) 0; }
  .judging-section { padding: clamp(64px, 12vw, 100px) 0; }
  .prizes-section { padding: clamp(64px, 12vw, 100px) 0; }

  .section-heading h2, .schedule-copy h2, .register-well h2, .judging-top-bar h2,
  .prizes-header h2, .timeline-header h2, .build-header-left h2,
  .challenge-header h2, .what-header h2, .how-header h2 {
    font-size: clamp(2.2rem, 10vw, 3.2rem);
  }

  .how-inner { grid-template-columns: 1fr; gap: 36px; }
  .how-step { grid-template-columns: 60px 1fr; gap: 14px; padding: 22px 18px; }
  .how-step::after { right: 14px; top: 14px; }
  .step-title { font-size: clamp(1.45rem, 7vw, 2rem); }

  .challenge-inner { grid-template-columns: 1fr; gap: 32px; }
  .challenge-signal { min-height: auto; padding: 20px; }
  .signal-phrase { font-size: clamp(1.6rem, 8vw, 2.8rem); margin: 32px 0 12px; }
  .signal-copy { max-width: 100%; margin-bottom: 28px; }
  .tl-head { flex-wrap: wrap; gap: 8px; }

  .what-cards-grid { grid-template-columns: 1fr; gap: 12px; }
  .what-card { padding: 22px 18px 18px; }

  .build-header { grid-template-columns: 1fr; gap: 20px; }
  .build-grid { grid-template-columns: 1fr; gap: 12px; }
  .build-card { padding: 22px 18px 20px; }
  .build-header-ctas { flex-direction: column; gap: 10px; }
  .build-header-ctas .aurora-button,
  .build-header-ctas .ghost-button { width: 100%; justify-content: center; }

  .judging-top-bar { grid-template-columns: 1fr; gap: 14px; }
  .judging-row { grid-template-columns: 40px 1fr; gap: 14px; padding: 18px 12px; }
  .judging-row-accent { display: none; }
  .judging-row-title { font-size: 1.1rem; }

  .timeline-container { gap: 40px; }
  .timeline-header-premium h2 { font-size: clamp(2rem, 9vw, 2.8rem); }
  .timeline-subtext-premium { font-size: 15px; }
  .timeline-cards { grid-template-columns: 1fr; gap: 14px; }
  .timeline-card { min-height: 200px; padding: 28px 22px; }
  .timeline-card.is-active { transform: none; }
  .timeline-card.is-active:hover { transform: translateY(-4px); }
  .card-bg-number { font-size: 120px; }
  .card-content { margin-top: 28px; }

  .rewards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .reward-card { padding: 22px 16px 18px; }
  .reward-title { font-size: 1rem; }

  .track-row { grid-template-columns: 42px 1fr; gap: 12px; }
  .track-row > a { display: none; }
  .timeline-track { padding-left: 8px; }

  .final-cta { padding: 72px 0 90px; }
  .final-cta-inner { padding: 24px 18px 28px; }
  .cta-heading { font-size: clamp(2.2rem, 11vw, 3.2rem); }
  .cta-body { font-size: 15px; }
  .cta-actions { flex-direction: column; gap: 10px; }
  .cta-actions .aurora-button,
  .cta-actions .ghost-button { width: 100%; justify-content: center; }

  .luxury-footer { padding: 56px 16px 36px; }
  .footer-inner { width: 100%; }
  .footer-nav { gap: 14px 20px; }
  .footer-nav a { font-size: 13px; }
  .footer-bottom { flex-direction: column; gap: 10px; text-align: center; }
}

@media (max-width: 420px) {
  .site-nav { grid-template-columns: 1fr auto; }
  .site-nav .wordmark { font-size: 20px; }
  .hero-copy h1 { font-size: clamp(2rem, 13vw, 2.6rem); }

  .tracks-section, .schedule-section, .build-inner, .challenge-inner,
  .judging-inner, .prizes-inner, .footer-inner, .final-cta-inner {
    width: calc(100% - 16px);
  }

  .final-cta-inner { padding-left: 14px; padding-right: 14px; }
  .rewards-grid { grid-template-columns: 1fr; }
  .timeline-card { padding: 22px 16px; }
  .card-content { margin-top: 20px; }
}
'@

$newCss = $css.Substring(0, $si) + $newBlock + $css.Substring($endIdx)
[System.IO.File]::WriteAllText($f, $newCss, [System.Text.Encoding]::UTF8)
Write-Host "Done. Replaced media queries from index $si to $endIdx"
