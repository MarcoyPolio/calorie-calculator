/**
 * ============================================================
 * SEO METADATA — paste into your HTML <head> on deployment
 * ============================================================
 * Title:       Calorie Deficit Calculator – Find Out Exactly What To Eat
 * Description: Calculate your TDEE, daily calorie target, macros, and
 *              how long to reach your goal weight. Free, instant, no BS.
 * Keywords:    calorie deficit calculator, TDEE calculator, how many calories
 *              to lose weight, calorie calculator for weight loss, macro
 *              calculator, calorie deficit for beginners, weight loss calculator
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
`;

const css = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  input, select, button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  input[type="number"] { -moz-appearance: textfield; }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
  select { -webkit-appearance: none; }

  :root {
    --black:    #0d0d0d;
    --dark:     #111111;
    --card:     #161616;
    --card2:    #1a1a1a;
    --border:   rgba(255,255,255,0.07);
    --lime:     #c9ff47;
    --lime-dim: rgba(201,255,71,0.1);
    --lime-bdr: rgba(201,255,71,0.25);
    --lime-glow:rgba(201,255,71,0.08);
    --text:     #f5f5f5;
    --mid:      #666;
    --dim:      #333;
    --green:    #4ade80;
    --red:      #f87171;
    --blue:     #60a5fa;
    --orange:   #fb923c;
  }

  body { background: var(--black); }

  .app {
    min-height: 100vh;
    background: var(--black);
    font-family: 'Space Grotesk', sans-serif;
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* ── GRID BG ── */
  .app::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(201,255,71,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,255,71,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
  }

  /* Glow blob */
  .glow-blob {
    position: fixed; top: -200px; right: -200px;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,255,71,0.06) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  /* ── HEADER ── */
  .header {
    position: relative; z-index: 1;
    padding: 48px 20px 32px;
    text-align: center;
  }

  .header-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px;
    background: var(--lime-dim); border: 1px solid var(--lime-bdr);
    font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--lime); margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--lime);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.7); }
  }

  .site-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(42px, 10vw, 96px);
    font-weight: 800; line-height: 0.9;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  .site-title .lime { color: var(--lime); }

  .site-sub {
    font-size: 15px; color: var(--mid);
    margin-top: 14px; font-weight: 400; line-height: 1.6;
    max-width: 440px; margin-inline: auto;
  }

  .site-sub strong { color: var(--text); font-weight: 600; }

  /* ── NAV ── */
  .nav {
    position: relative; z-index: 1;
    display: flex; justify-content: center;
    gap: 6px; padding: 0 20px 40px; flex-wrap: wrap;
  }

  .nav-btn {
    padding: 10px 20px; border-radius: 6px; min-height: 44px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--mid);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    letter-spacing: 0.04em; text-transform: uppercase;
    display: flex; align-items: center; gap: 7px;
  }

  .nav-btn:hover { border-color: var(--lime-bdr); color: var(--lime); }

  .nav-btn.active {
    background: var(--lime); border-color: var(--lime);
    color: var(--black); font-weight: 700;
    box-shadow: 0 0 24px rgba(201,255,71,0.25);
  }

  /* ── LAYOUT ── */
  .main {
    position: relative; z-index: 1;
    max-width: 700px; margin: 0 auto;
    padding: 0 20px 100px;
  }

  /* ── CARD ── */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 32px;
    position: relative; overflow: hidden;
    animation: cardIn 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--lime), transparent);
  }

  .card-tag {
    display: inline-block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--lime); margin-bottom: 8px;
  }

  .card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 36px; font-weight: 800;
    text-transform: uppercase; letter-spacing: -0.01em;
    color: var(--text); margin-bottom: 4px; line-height: 1;
  }

  .card-desc {
    font-size: 13px; color: var(--mid);
    margin-bottom: 28px; line-height: 1.6;
  }

  /* ── FORM ── */
  .field { margin-bottom: 16px; }

  .label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--mid); margin-bottom: 8px;
  }

  .input {
    width: 100%;
    background: var(--card2);
    border: 1px solid var(--border);
    border-radius: 8px; padding: 14px 16px;
    color: var(--text);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px; font-weight: 500;
    outline: none; transition: all 0.2s;
  }

  .input:focus {
    border-color: var(--lime-bdr);
    background: var(--lime-glow);
    box-shadow: 0 0 0 3px rgba(201,255,71,0.05);
  }

  .input::placeholder { color: var(--dim); }

  select.input {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23c9ff47' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }

  select.input option { background: #1a1a1a; color: var(--text); }

  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── TOGGLE ── */
  .toggle-group { display: flex; gap: 6px; }

  .toggle-btn {
    flex: 1; padding: 13px 10px; border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--card2); color: var(--mid);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; min-height: 48px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }

  .toggle-btn.active {
    border-color: var(--lime-bdr);
    background: var(--lime-dim);
    color: var(--lime);
  }

  /* ── GOAL GRID ── */
  .goal-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }

  .goal-btn {
    padding: 14px 8px; border-radius: 8px; text-align: center;
    border: 1px solid var(--border);
    background: var(--card2); color: var(--mid);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; min-height: 72px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 4px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }

  .goal-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 24px; font-weight: 800;
    color: var(--text); display: block; line-height: 1;
  }

  .goal-tag { font-size: 9px; opacity: 0.5; }

  .goal-btn.active {
    border-color: var(--lime);
    background: var(--lime-dim);
    color: var(--lime);
    box-shadow: 0 0 16px rgba(201,255,71,0.1);
  }

  .goal-btn.active .goal-val { color: var(--lime); }

  /* ── BUTTON ── */
  .btn {
    width: 100%; padding: 16px; border-radius: 8px; border: none;
    background: var(--lime); color: var(--black);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px; font-weight: 800;
    letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s; min-height: 56px;
    margin-top: 8px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(201,255,71,0.3);
    background: #d4ff5a;
  }

  .btn:active { transform: translateY(0); }

  /* ── RESULTS ── */
  .results { margin-top: 28px; animation: cardIn 0.35s ease; }

  .result-hero {
    padding: 32px; border-radius: 12px;
    background: var(--lime);
    text-align: center; margin-bottom: 12px;
    position: relative; overflow: hidden;
  }

  .result-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg, transparent, transparent 10px,
      rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px
    );
  }

  .rh-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(0,0,0,0.5); margin-bottom: 8px;
  }

  .rh-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 80px; font-weight: 800;
    color: var(--black); line-height: 1; letter-spacing: -0.02em;
  }

  .rh-unit {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px; opacity: 0.5; margin-left: 4px;
  }

  .rh-sub { font-size: 13px; color: rgba(0,0,0,0.55); margin-top: 8px; font-weight: 500; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }

  .stat-box {
    padding: 20px; border-radius: 10px;
    background: var(--card); border: 1px solid var(--border);
    text-align: center;
  }

  .stat-icon { font-size: 22px; margin-bottom: 6px; display: block; }
  .stat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--mid); margin-bottom: 6px;
  }
  .stat-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px; font-weight: 800; color: var(--text); line-height: 1;
  }
  .stat-unit { font-size: 13px; color: var(--mid); }

  /* Macro bars */
  .macro-wrap {
    padding: 22px; border-radius: 10px;
    background: var(--card); border: 1px solid var(--border);
    margin-bottom: 12px;
  }

  .macro-wrap-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--mid); margin-bottom: 16px;
  }

  .macro-row { margin-bottom: 14px; }

  .macro-head {
    display: flex; justify-content: space-between;
    align-items: baseline; margin-bottom: 7px;
  }

  .macro-name { font-size: 13px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.05em; }
  .macro-g { font-size: 22px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; }

  .bar-bg { height: 8px; border-radius: 4px; background: var(--card2); overflow: hidden; }
  .bar { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .bar-p { background: var(--lime); }
  .bar-c { background: var(--blue); }
  .bar-f { background: var(--orange); }

  /* Timeline */
  .timeline {
    padding: 20px 24px; border-radius: 10px;
    border: 1px solid var(--lime-bdr);
    background: var(--lime-dim); margin-bottom: 12px;
    display: flex; align-items: center; gap: 16px;
  }

  .tl-icon { font-size: 30px; flex-shrink: 0; }
  .tl-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(201,255,71,0.5); margin-bottom: 4px;
  }
  .tl-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px; font-weight: 800; color: var(--lime);
  }
  .tl-sub { font-size: 12px; color: var(--mid); }

  /* Warning */
  .warn {
    padding: 14px 18px; border-radius: 8px;
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.25);
    font-size: 13px; color: var(--red); line-height: 1.6;
    margin-bottom: 12px;
  }

  /* ── FOOD TABLE ── */
  .food-search { position: relative; margin-bottom: 20px; }
  .search-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); color: var(--mid); font-size: 16px;
  }
  .food-search .input { padding-left: 40px; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { border-bottom: 2px solid var(--lime); }
  thead th {
    padding: 8px 10px; text-align: left;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--lime);
  }
  thead th:not(:first-child) { text-align: right; }
  tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  tbody tr:hover { background: rgba(201,255,71,0.04); }
  tbody td { padding: 11px 10px; color: var(--text); font-weight: 500; }
  tbody td:not(:first-child) { text-align: right; color: var(--mid); }
  .cal-val { color: var(--lime) !important; font-weight: 700 !important; }

  /* ── BMI ── */
  .bmi-scale {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 6px; margin-top: 16px;
  }

  .bmi-box {
    padding: 12px 8px; border-radius: 8px; text-align: center;
    background: var(--card2); border: 1px solid var(--border);
  }

  .bmi-box-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .bmi-box-range { font-size: 11px; color: var(--mid); }
  .bmi-box.active-box { border-width: 2px; }

  /* ── CTA ── */
  .cta {
    margin-top: 36px; padding: 32px 28px; border-radius: 16px;
    background: #111; border: 1px solid var(--lime-bdr);
    position: relative; overflow: hidden;
  }

  .cta::after {
    content: '';
    position: absolute; bottom: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,255,71,0.08), transparent 70%);
    pointer-events: none;
  }

  .cta-tag {
    display: inline-block; padding: 4px 12px; border-radius: 4px;
    background: var(--lime); color: var(--black);
    font-size: 10px; font-weight: 800; letter-spacing: 0.15em;
    text-transform: uppercase; margin-bottom: 14px;
  }

  .cta-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px; font-weight: 800; text-transform: uppercase;
    color: var(--text); line-height: 1.1; margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .cta-title .lime { color: var(--lime); }

  .cta-desc { font-size: 13px; color: var(--mid); line-height: 1.7; margin-bottom: 20px; }

  .cta-bullets { margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; }

  .cta-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #888; }

  .cta-arrow { color: var(--lime); font-weight: 700; flex-shrink: 0; }

  .cta-btn {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%; padding: 16px 20px;
    border-radius: 8px; border: none;
    background: var(--lime); color: var(--black);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.04em;
    cursor: pointer; transition: all 0.2s; text-decoration: none;
    min-height: 56px;
  }

  .cta-btn:hover {
    background: #d4ff5a;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(201,255,71,0.3);
  }

  .cta-price { text-align: center; margin-top: 10px; font-size: 12px; color: var(--mid); }

  /* ── FAQ ── */
  .faq-wrap { margin-top: 44px; padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.05); }

  .faq-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }

  .faq-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px; font-weight: 800;
    text-transform: uppercase; color: var(--text);
  }

  .seo-pill {
    font-size: 9px; font-weight: 800; letter-spacing: 0.2em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 4px;
    background: var(--lime-dim); border: 1px solid var(--lime-bdr); color: var(--lime);
  }

  .faq-item {
    border: 1px solid var(--border); border-radius: 10px;
    overflow: hidden; margin-bottom: 8px; transition: border-color 0.2s;
  }
  .faq-item.open { border-color: var(--lime-bdr); }

  .faq-q {
    width: 100%; padding: 16px 18px; min-height: 54px;
    background: transparent; border: none; cursor: pointer;
    text-align: left; font-family: 'Space Grotesk', sans-serif;
    font-size: 14px; font-weight: 600; color: var(--text);
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    transition: background 0.15s;
  }
  .faq-q:hover { background: rgba(255,255,255,0.02); }
  .faq-item.open .faq-q { color: var(--lime); }

  .faq-chevron { font-size: 11px; color: var(--mid); transition: transform 0.25s; flex-shrink: 0; }
  .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--lime); }

  .faq-a {
    padding: 0 18px; max-height: 0; overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    font-size: 13px; color: var(--mid); line-height: 1.8;
  }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 18px 16px; }

  /* ── EMAIL CAPTURE ── */
  .ec {
    margin-top: 36px; padding: 32px 28px; border-radius: 16px;
    background: #111; border: 1px solid var(--lime-bdr);
    position: relative; overflow: hidden;
  }
  .ec::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--lime), transparent);
  }
  .ec-glow {
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,255,71,0.06), transparent 70%);
    pointer-events: none;
  }
  .ec-tag {
    display: inline-block; padding: 4px 12px; border-radius: 4px;
    background: var(--lime-dim); border: 1px solid var(--lime-bdr);
    font-size: 10px; font-weight: 800; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--lime); margin-bottom: 14px;
  }
  .ec-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 30px; font-weight: 800; text-transform: uppercase;
    color: var(--text); line-height: 1.05; margin-bottom: 8px;
  }
  .ec-title .lime { color: var(--lime); }
  .ec-sub { font-size: 13px; color: var(--mid); line-height: 1.7; margin-bottom: 20px; }
  .ec-bullets { display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; }
  .ec-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #777; }
  .ec-tick {
    width: 18px; height: 18px; border-radius: 3px;
    background: var(--lime-dim); border: 1px solid var(--lime-bdr);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; color: var(--lime);
    flex-shrink: 0; margin-top: 1px;
  }
  .ec-form { display: flex; gap: 8px; margin-bottom: 10px; }
  .ec-input {
    flex: 1; background: var(--card2); border: 1px solid var(--border);
    border-radius: 8px; padding: 14px 16px; color: var(--text);
    font-family: 'Space Grotesk', sans-serif; font-size: 16px;
    outline: none; transition: all 0.2s; min-height: 50px;
  }
  .ec-input:focus { border-color: var(--lime-bdr); background: var(--lime-glow); }
  .ec-input::placeholder { color: var(--dim); }
  .ec-submit {
    padding: 14px 22px; border-radius: 8px; border: none;
    background: var(--lime); color: var(--black);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px; font-weight: 800; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s; min-height: 50px; white-space: nowrap;
  }
  .ec-submit:hover:not(:disabled) { background: #d4ff5a; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,255,71,0.25); }
  .ec-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ec-lead { font-size: 11px; color: var(--lime); font-weight: 600; margin-bottom: 8px; }
  .ec-privacy { font-size: 11px; color: #333; margin-top: 6px; }
  .ec-success {
    padding: 28px; border-radius: 12px; text-align: center;
    background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.25);
    animation: cardIn 0.3s ease;
  }
  .ec-success-icon { font-size: 40px; margin-bottom: 10px; display: block; }
  .ec-success-msg {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 24px; font-weight: 800; text-transform: uppercase; color: var(--green);
  }
  .ec-success-sub { font-size: 13px; color: var(--mid); margin-top: 4px; }
  .ec-err { font-size: 12px; color: var(--red); margin-top: 8px; }
  @media (max-width: 480px) {
    .ec { padding: 24px 18px; }
    .ec-form { flex-direction: column; }
    .ec-submit { width: 100%; }
    .ec-title { font-size: 24px; }
  }

  /* ── FOOTER ── */
  .footer {
    position: relative; z-index: 1; text-align: center;
    padding: 28px 20px 40px;
    font-size: 10px; color: #2a2a2a;
    letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600;
  }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .header { padding: 36px 18px 20px; }
    .site-title { font-size: clamp(38px, 12vw, 60px); }
    .nav { gap: 5px; padding: 0 14px 28px; }
    .nav-btn { flex: 1; justify-content: center; padding: 10px 6px; font-size: 11px; }
    .main { padding: 0 14px 80px; }
    .card { padding: 22px 18px; border-radius: 12px; }
    .row2 { grid-template-columns: 1fr; gap: 0; }
    .goal-grid { grid-template-columns: repeat(2,1fr); }
    .stats-grid { grid-template-columns: 1fr; }
    .rh-value { font-size: 60px; }
    .cta { padding: 24px 18px; }
    .bmi-scale { grid-template-columns: repeat(2,1fr); }
    .timeline { flex-direction: column; text-align: center; }
    .input { font-size: 16px; }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .input { font-size: 16px; }
  }
`;

/* ── DATA ── */
const ACTIVITY = [
  { val: 1.2,   label: "Sedentary",   desc: "desk job, no gym" },
  { val: 1.375, label: "Light",       desc: "1–2x workouts/week" },
  { val: 1.55,  label: "Moderate",   desc: "3–5x workouts/week" },
  { val: 1.725, label: "Very Active", desc: "hard training daily" },
  { val: 1.9,   label: "Athlete",    desc: "2x daily training" },
];

const GOALS = [
  { kg:0.25, label:"Gentle",    cal:275,  tag:"slow & safe" },
  { kg:0.5,  label:"Steady",   cal:550,  tag:"recommended" },
  { kg:0.75, label:"Faster",   cal:825,  tag:"ambitious" },
  { kg:1.0,  label:"Aggressive",cal:1100, tag:"hard mode" },
];

const FAQ_ITEMS = [
  { q:"What is a calorie deficit and how does it work?", a:"A calorie deficit means you eat fewer calories than your body burns each day. Your body then dips into fat stores for energy. 7,700 calories of deficit = roughly 1 kg of fat lost. Simple math, hard execution. A deficit of 300–600 cal/day is the sweet spot for most people." },
  { q:"How do I calculate my calorie deficit?", a:"First find your TDEE — Total Daily Energy Expenditure. That's how many calories you burn in a day including activity. Then subtract your target deficit. If your TDEE is 2,200 and you want to lose 0.5 kg/week, eat 1,650 calories. This calculator does all of that automatically." },
  { q:"What is TDEE?", a:"TDEE = Total Daily Energy Expenditure. It's every calorie your body burns: at rest (BMR), through movement, digestion, and exercise. We calculate it using the Mifflin-St Jeor equation — the most accurate formula for most people." },
  { q:"How many calories to lose 1 kg per week?", a:"1 kg of fat = ~7,700 calories. To lose 1 kg/week you need a daily deficit of ~1,100 calories. That's a lot. Most people do better at 0.5 kg/week (550 cal/day deficit). Losing faster than 1 kg/week usually means muscle loss too — not ideal." },
  { q:"Will eating too little slow my metabolism?", a:"Yes. Drop too low and your body adapts by burning less. This is metabolic adaptation. That's why crash diets stop working. Keep your deficit at max 500–700 cal/day and eat at least 1,200 cal (women) or 1,500 cal (men). Sustainable > dramatic." },
  { q:"What are macros and how do I split them?", a:"Macros = protein, carbs, fat. For fat loss, a 35/35/30 split (protein/carbs/fat) works well for most people. Higher protein (30–40%) is key — it keeps you full and preserves muscle while you're in a deficit. Protein = 4 cal/g. Carbs = 4 cal/g. Fat = 9 cal/g." },
  { q:"Does sleep actually affect weight loss?", a:"More than most people realize. Bad sleep raises ghrelin (hunger hormone) and lowers leptin (fullness hormone) — which can add 300–500 extra calories to your day before you even try. It also impairs fat metabolism. Fixing your sleep might be the most underrated fat loss hack." },
  { q:"How accurate is this calculator?", a:"It's based on the Mifflin-St Jeor equation — accurate within ~10% for most people. Use it as a starting point, track for 2–3 weeks, then adjust. If you're not losing, drop 100–150 cal. If you're losing too fast, add some back. The data will guide you." },
];

const FOODS = [
  { name:"Chicken Breast",   per:"100g", cal:165, p:31,  c:0,   f:3.6 },
  { name:"Eggs",             per:"1 large", cal:72, p:6, c:0.4, f:5 },
  { name:"Salmon",           per:"100g", cal:208, p:20,  c:0,   f:13 },
  { name:"Brown Rice",       per:"100g cooked", cal:111, p:2.6, c:23, f:0.9 },
  { name:"Sweet Potato",     per:"100g", cal:86,  p:1.6, c:20,  f:0.1 },
  { name:"Oats",             per:"100g dry", cal:389, p:17, c:66, f:7 },
  { name:"Greek Yogurt",     per:"100g", cal:59,  p:10,  c:3.6, f:0.4 },
  { name:"Avocado",          per:"half", cal:120, p:1.5, c:6,   f:11 },
  { name:"Banana",           per:"medium", cal:89, p:1.1, c:23, f:0.3 },
  { name:"Almonds",          per:"28g",  cal:164, p:6,   c:6,   f:14 },
  { name:"Tuna in water",    per:"100g", cal:109, p:24,  c:0,   f:1 },
  { name:"Peanut Butter",    per:"2 tbsp", cal:188, p:8, c:6,   f:16 },
  { name:"Tofu",             per:"100g", cal:76,  p:8,   c:1.9, f:4.8 },
  { name:"Broccoli",         per:"100g", cal:34,  p:2.8, c:7,   f:0.4 },
  { name:"Beef (lean)",      per:"100g", cal:250, p:26,  c:0,   f:15 },
  { name:"White Rice",       per:"100g cooked", cal:130, p:2.7, c:28, f:0.3 },
  { name:"Whole Milk",       per:"240ml", cal:149, p:8,  c:12,  f:8 },
  { name:"Olive Oil",        per:"1 tbsp", cal:119, p:0, c:0,   f:14 },
  { name:"Apple",            per:"medium", cal:95, p:0.5, c:25, f:0.3 },
  { name:"Bread (white)",    per:"1 slice", cal:79, p:3, c:15,  f:1 },
];

/* ── HELPERS ── */
function calcBMR(w, h, age, gender) {
  const base = 10*w + 6.25*h - 5*age;
  return gender === "male" ? base + 5 : base - 161;
}
function fmtN(n) { return Math.round(n).toLocaleString(); }
function weeksTo(deficit, kg) {
  if (deficit <= 0 || !kg) return null;
  const w = (kg * 7700) / (deficit * 7);
  if (w > 156) return "52+ weeks";
  if (w < 1)   return "< 1 week";
  const wk = Math.round(w);
  const mo = Math.floor(wk / 4.33);
  return mo >= 2 ? `~${mo} months` : `~${wk} week${wk!==1?"s":""}`;
}

/* ── FAQ ── */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-wrap">
      <div className="faq-head">
        <div className="faq-title">FAQs</div>
        <div className="seo-pill">SEO</div>
      </div>
      {FAQ_ITEMS.map((f,i)=>(
        <div key={i} className={`faq-item${open===i?" open":""}`}>
          <button className="faq-q" onClick={()=>setOpen(open===i?null:i)}>
            <span>{f.q}</span><span className="faq-chevron">▼</span>
          </button>
          <div className="faq-a">{f.a}</div>
        </div>
      ))}
    </div>
  );
}

/* ── EMAIL CAPTURE ── */
const FORM_ACTION = "https://formspree.io/f/mykllzge";

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch(FORM_ACTION, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "calorie-calculator" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  }

  return (
    <div className="ec">
      <div className="ec-glow" />
      {status === "success" ? (
        <div className="ec-success">
          <span className="ec-success-icon">⚡</span>
          <div className="ec-success-msg">You're In!</div>
          <div className="ec-success-sub">Check your inbox for the Free Calorie Reset Checklist.</div>
        </div>
      ) : (
        <>
          <div className="ec-tag">Free Weekly Tips</div>
          <div className="ec-title">
            Level up your<br /><span className="lime">fat loss game.</span>
          </div>
          <div className="ec-sub">
            No fluff. Just practical, science-backed nutrition and calorie advice — straight to your inbox, weekly.
          </div>
          <div className="ec-bullets">
            {[
              "Weekly meal ideas under your calorie target",
              "The metabolism myths killing your progress",
              "Exclusive reader discounts on health guides",
            ].map((b, i) => (
              <div className="ec-bullet" key={i}>
                <span className="ec-tick">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <form className="ec-form" onSubmit={handleSubmit}>
            <input
              className="ec-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="ec-submit" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "…" : "Join →"}
            </button>
          </form>
          <div className="ec-lead">+ Get the Free 7-Day Calorie Reset Checklist</div>
          {status === "error" && <div className="ec-err">Something went wrong. Try again.</div>}
          <div className="ec-privacy">🔒 No spam. Unsubscribe anytime.</div>
        </>
      )}
    </div>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <div className="cta">
      <div className="cta-tag">psst — one more thing</div>
      <div className="cta-title">
        Your diet is only<br/><span className="lime">half the equation.</span>
      </div>
      <div className="cta-desc">
        Trash sleep = +300–500 hidden calories per day from hunger hormones. You can't out-discipline bad sleep. The Better Sleep Guide is a 14-night reset for people who are already doing the work — but still not seeing results.
      </div>
      <div className="cta-bullets">
        {[
          "How sleep kills your deficit before breakfast",
          "14-night step-by-step circadian reset plan",
          "The evening routine that protects fat loss overnight",
          "Why you're not losing weight despite eating right",
        ].map((b,i)=>(
          <div className="cta-bullet" key={i}>
            <span className="cta-arrow">→</span>
            <span>{b}</span>
          </div>
        ))}
      </div>
      <a className="cta-btn" href="https://mark203j.gumroad.com/l/vratf" target="_blank" rel="noopener noreferrer">
        🌙 Get the Better Sleep Guide — $19
      </a>
      <div className="cta-price">One-time. Instant download. No subscription.</div>
    </div>
  );
}

/* ══════════════
   DEFICIT TAB
   ══════════════ */
function DeficitCalc() {
  const [unit, setUnit]     = useState("metric");
  const [gender, setGender] = useState("female");
  const [age, setAge]       = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [hFt, setHFt]       = useState("");
  const [hIn, setHIn]       = useState("");
  const [activity, setActivity] = useState(1.55);
  const [goalIdx, setGoalIdx]   = useState(1);
  const [goalWt, setGoalWt]     = useState("");
  const [result, setResult]     = useState(null);
  const resultRef = useRef(null);

  const isImp = unit === "imperial";

  function calculate() {
    const a = parseFloat(age);
    let w = parseFloat(weight);
    let h = isImp
      ? (parseFloat(hFt||0)*12 + parseFloat(hIn||0)) * 2.54
      : parseFloat(height);
    if (isImp) w = w * 0.453592;

    if ([a,w,h].some(v=>isNaN(v)||v<=0)) return;

    const bmr  = calcBMR(w, h, a, gender);
    const tdee = bmr * activity;
    const goal = GOALS[goalIdx];
    const target = Math.round(tdee - goal.cal);
    const protein = Math.round((target * 0.35) / 4);
    const carbs   = Math.round((target * 0.35) / 4);
    const fat     = Math.round((target * 0.30) / 9);
    const gw  = parseFloat(goalWt);
    const gwKg = isImp ? gw * 0.453592 : gw;
    const diff = !isNaN(gwKg) && gwKg > 0 ? Math.abs(w - gwKg) : null;
    const tl   = weeksTo(goal.cal, diff);

    setResult({ bmr:Math.round(bmr), tdee:Math.round(tdee), target, deficit:goal.cal, protein, carbs, fat, tl, diff, tooLow: target < 1200 });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"nearest" }), 100);
  }

  return (
    <>
      <div className="card">
        <div className="card-tag">Step 1 of 1</div>
        <div className="card-title">Your Numbers</div>
        <div className="card-desc">Fill in your stats. Get your exact calorie target, macros, and timeline.</div>

        {/* Unit */}
        <div className="field">
          <label className="label">Units</label>
          <div className="toggle-group">
            {["metric","imperial"].map(u=>(
              <button key={u} className={`toggle-btn${unit===u?" active":""}`}
                onClick={()=>{setUnit(u);setResult(null);}}>
                {u==="metric"?"🌍 Metric (kg / cm)":"🇺🇸 Imperial (lbs / ft)"}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="field">
          <label className="label">Biological Sex</label>
          <div className="toggle-group">
            <button className={`toggle-btn${gender==="female"?" active":""}`} onClick={()=>setGender("female")}>♀ Female</button>
            <button className={`toggle-btn${gender==="male"?" active":""}`} onClick={()=>setGender("male")}>♂ Male</button>
          </div>
        </div>

        {/* Age + Weight */}
        <div className="row2">
          <div className="field">
            <label className="label">Age</label>
            <input className="input" type="number" placeholder="e.g. 24" value={age} onChange={e=>setAge(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          </div>
          <div className="field">
            <label className="label">Weight ({isImp?"lbs":"kg"})</label>
            <input className="input" type="number" placeholder={isImp?"e.g. 154":"e.g. 70"} value={weight} onChange={e=>setWeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          </div>
        </div>

        {/* Height */}
        <div className="field">
          <label className="label">Height</label>
          {isImp ? (
            <div className="row2">
              <input className="input" type="number" placeholder="Feet" value={hFt} onChange={e=>setHFt(e.target.value)} />
              <input className="input" type="number" placeholder="Inches" value={hIn} onChange={e=>setHIn(e.target.value)} />
            </div>
          ) : (
            <input className="input" type="number" placeholder="cm e.g. 165" value={height} onChange={e=>setHeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          )}
        </div>

        {/* Activity */}
        <div className="field">
          <label className="label">Activity Level</label>
          <select className="input" value={activity} onChange={e=>setActivity(parseFloat(e.target.value))}>
            {ACTIVITY.map(a=>(
              <option key={a.val} value={a.val}>{a.label} — {a.desc}</option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div className="field">
          <label className="label">Weekly Loss Goal</label>
          <div className="goal-grid">
            {GOALS.map((g,i)=>(
              <button key={i} className={`goal-btn${goalIdx===i?" active":""}`} onClick={()=>setGoalIdx(i)}>
                <span className="goal-val">{g.kg}<span style={{fontSize:14}}>kg</span></span>
                {g.label}
                <span className="goal-tag">{g.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal weight */}
        <div className="field">
          <label className="label">Goal Weight ({isImp?"lbs":"kg"}) — optional, for timeline</label>
          <input className="input" type="number" placeholder={`e.g. ${isImp?130:60}`} value={goalWt} onChange={e=>setGoalWt(e.target.value)} />
        </div>

        <button className="btn" onClick={calculate}>Calculate →</button>

        {result && (
          <div className="results" ref={resultRef}>
            {/* Hero */}
            <div className="result-hero">
              <div className="rh-label">Your Daily Calorie Target</div>
              <div className="rh-value">{fmtN(result.target)}<span className="rh-unit">cal</span></div>
              <div className="rh-sub">Deficit of {fmtN(result.deficit)} cal · lose ~{GOALS[goalIdx].kg}kg/week</div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon">🔥</span>
                <div className="stat-label">Your TDEE</div>
                <div className="stat-value">{fmtN(result.tdee)}<span className="stat-unit"> cal</span></div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🛌</span>
                <div className="stat-label">Your BMR</div>
                <div className="stat-value">{fmtN(result.bmr)}<span className="stat-unit"> cal</span></div>
              </div>
            </div>

            {/* Macros */}
            <div className="macro-wrap">
              <div className="macro-wrap-title">Daily Macro Targets at {fmtN(result.target)} cal</div>
              {[
                { name:"Protein", g:result.protein, pct:35, bar:"bar-p", cal:result.protein*4 },
                { name:"Carbs",   g:result.carbs,   pct:35, bar:"bar-c", cal:result.carbs*4 },
                { name:"Fat",     g:result.fat,      pct:30, bar:"bar-f", cal:result.fat*9 },
              ].map(m=>(
                <div className="macro-row" key={m.name}>
                  <div className="macro-head">
                    <span className="macro-name">{m.name} <span style={{color:"var(--mid)",fontWeight:400,fontSize:11}}>({m.pct}%)</span></span>
                    <span className="macro-g" style={{color: m.bar==="bar-p"?"var(--lime)":m.bar==="bar-c"?"var(--blue)":"var(--orange)"}}>{m.g}g</span>
                  </div>
                  <div className="bar-bg">
                    <div className={`bar ${m.bar}`} style={{width:`${m.pct/0.4}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            {result.tl && (
              <div className="timeline">
                <span className="tl-icon">📅</span>
                <div>
                  <div className="tl-label">Estimated Timeline</div>
                  <div className="tl-val">{result.tl}</div>
                  <div className="tl-sub">to lose ~{result.diff?.toFixed(1)}kg at {GOALS[goalIdx].kg}kg/week</div>
                </div>
              </div>
            )}

            {result.tooLow && (
              <div className="warn">
                ⚠️ {fmtN(result.target)} cal/day is below the safe minimum. Pick a slower goal — you'll get there and keep the muscle.
              </div>
            )}
          </div>
        )}
      </div>
      <CTA/>
      <EmailCapture/>
      <FAQ/>
    </>
  );
}

/* ══════════════
   FOOD TABLE
   ══════════════ */
function FoodTable() {
  const [q, setQ] = useState("");
  const list = FOODS.filter(f=>f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="card">
      <div className="card-tag">Reference</div>
      <div className="card-title">Food Calories</div>
      <div className="card-desc">Common foods to help you hit your daily targets. Search below.</div>
      <div className="food-search field">
        <span className="search-icon">🔍</span>
        <input className="input" type="text" placeholder="Search foods…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div style={{overflowX:"auto"}}>
        <table>
          <thead>
            <tr>
              <th>Food</th><th style={{textAlign:"right"}}>Cal</th>
              <th style={{textAlign:"right"}}>Protein</th>
              <th style={{textAlign:"right"}}>Carbs</th>
              <th style={{textAlign:"right"}}>Fat</th>
            </tr>
          </thead>
          <tbody>
            {list.map((f,i)=>(
              <tr key={i}>
                <td>
                  <div style={{fontWeight:600}}>{f.name}</div>
                  <div style={{fontSize:11,color:"var(--mid)"}}>{f.per}</div>
                </td>
                <td className="cal-val">{f.cal}</td>
                <td>{f.p}g</td>
                <td>{f.c}g</td>
                <td>{f.f}g</td>
              </tr>
            ))}
            {list.length===0 && <tr><td colSpan={5} style={{textAlign:"center",padding:"24px",color:"var(--mid)"}}>No results</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════
   BMI TAB
   ══════════════ */
function BMICalc() {
  const [unit, setUnit] = useState("metric");
  const [w, setW]       = useState("");
  const [h, setH]       = useState("");
  const [hFt, setHFt]   = useState("");
  const [hIn, setHIn]   = useState("");
  const [res, setRes]   = useState(null);

  const isImp = unit === "imperial";

  function calc() {
    let wKg = isImp ? parseFloat(w)*0.453592 : parseFloat(w);
    let hM  = isImp
      ? ((parseFloat(hFt||0)*12)+parseFloat(hIn||0))*0.0254
      : parseFloat(h)/100;
    if(isNaN(wKg)||isNaN(hM)||wKg<=0||hM<=0) return;
    const bmi = wKg/(hM*hM);
    const cat = bmi<18.5?"Underweight":bmi<25?"Normal Weight":bmi<30?"Overweight":"Obese";
    const col = bmi<18.5?"var(--blue)":bmi<25?"var(--lime)":bmi<30?"var(--orange)":"var(--red)";
    const lo  = isImp ? (18.5*hM*hM*2.20462).toFixed(1) : (18.5*hM*hM).toFixed(1);
    const hi  = isImp ? (24.9*hM*hM*2.20462).toFixed(1) : (24.9*hM*hM).toFixed(1);
    setRes({ bmi:bmi.toFixed(1), cat, col, lo, hi });
  }

  return (
    <div className="card">
      <div className="card-tag">Quick Check</div>
      <div className="card-title">BMI Calculator</div>
      <div className="card-desc">Body Mass Index — a rough indicator of healthy weight range. Not perfect, but useful.</div>

      <div className="field">
        <label className="label">Units</label>
        <div className="toggle-group">
          {["metric","imperial"].map(u=>(
            <button key={u} className={`toggle-btn${unit===u?" active":""}`}
              onClick={()=>{setUnit(u);setRes(null);}}>
              {u==="metric"?"🌍 Metric":"🇺🇸 Imperial"}
            </button>
          ))}
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label className="label">Weight ({isImp?"lbs":"kg"})</label>
          <input className="input" type="number" placeholder={isImp?"154":"70"} value={w} onChange={e=>setW(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calc()} />
        </div>
        <div className="field">
          <label className="label">Height</label>
          {isImp ? (
            <div className="row2">
              <input className="input" type="number" placeholder="ft" value={hFt} onChange={e=>setHFt(e.target.value)} />
              <input className="input" type="number" placeholder="in" value={hIn} onChange={e=>setHIn(e.target.value)} />
            </div>
          ) : (
            <input className="input" type="number" placeholder="cm" value={h} onChange={e=>setH(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calc()} />
          )}
        </div>
      </div>

      <button className="btn" onClick={calc}>Calculate BMI →</button>

      {res && (
        <div className="results">
          <div className="result-hero" style={{background:"var(--card2)", border:`2px solid ${res.col}`}}>
            <div className="rh-label">Your BMI</div>
            <div className="rh-value" style={{color:res.col}}>{res.bmi}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:res.col,textTransform:"uppercase",marginTop:4}}>{res.cat}</div>
            <div className="rh-sub">Healthy weight for your height: {res.lo}–{res.hi} {isImp?"lbs":"kg"}</div>
          </div>

          <div className="bmi-scale">
            {[
              {label:"Underweight",range:"<18.5",  col:"var(--blue)"},
              {label:"Normal",      range:"18.5–24.9",col:"var(--lime)"},
              {label:"Overweight",  range:"25–29.9",col:"var(--orange)"},
              {label:"Obese",       range:"≥30",    col:"var(--red)"},
            ].map(c=>(
              <div key={c.label} className={`bmi-box${res.cat.includes(c.label.split(" ")[0])?" active-box":""}`}
                style={res.cat.includes(c.label.split(" ")[0])?{borderColor:c.col,background:`${c.col}14`}:{}}>
                <div className="bmi-box-label" style={{color:c.col}}>{c.label}</div>
                <div className="bmi-box-range">{c.range}</div>
              </div>
            ))}
          </div>

          <div className="warn" style={{background:"rgba(255,255,255,0.03)",borderColor:"rgba(255,255,255,0.08)",color:"var(--mid)",marginTop:12}}>
            BMI is a screening tool, not a diagnosis. Athletes often show "overweight" BMI despite low body fat. Use it alongside other metrics.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── APP ── */
const TABS = [
  { id:"deficit", icon:"🔥", label:"Deficit" },
  { id:"food",    icon:"🥗", label:"Food Cals" },
  { id:"bmi",     icon:"📏", label:"BMI" },
];

export default function App() {
  const [tab, setTab] = useState("deficit");

  useEffect(()=>{
    const metas = [
      { name:"viewport",                         content:"width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" },
      { name:"apple-mobile-web-app-capable",     content:"yes" },
      { name:"apple-mobile-web-app-status-bar-style", content:"black-translucent" },
      { name:"apple-mobile-web-app-title",       content:"Calorie Calculator" },
      { name:"theme-color",                      content:"#0d0d0d" },
      { name:"description",                      content:"Calculate your calorie deficit, TDEE, macros, and weight loss timeline. Free, instant, no sign-up." },
    ];
    metas.forEach(({name,content})=>{
      if(!document.querySelector(`meta[name="${name}"]`)){
        const el=document.createElement("meta");
        el.name=name; el.content=content;
        document.head.appendChild(el);
      }
    });
    document.title="Calorie Deficit Calculator – Find Out Exactly What To Eat";
  },[]);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="glow-blob"/>

        <header className="header">
          <div className="header-badge">
            <span className="badge-dot"/>
            Free Tool · No Sign-up
          </div>
          <h1 className="site-title">
            CALORIE<br/><span className="lime">DEFICIT</span>
          </h1>
          <p className="site-sub">
            Find out <strong>exactly</strong> how much to eat. No guessing. No starving. Just your numbers.
          </p>
        </header>

        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id}
              className={`nav-btn${tab===t.id?" active":""}`}
              onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <main className="main">
          {tab==="deficit" && <DeficitCalc/>}
          {tab==="food"    && <FoodTable/>}
          {tab==="bmi"     && <BMICalc/>}
        </main>

        <footer className="footer">
          Calorie Deficit Calculator · Free Forever · No Sign-up
        </footer>
      </div>
    </>
  );
}
