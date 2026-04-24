/**
 * ============================================================
 * SEO METADATA — paste into your HTML <head> on deployment
 * ============================================================
 * Title:       Calorie Deficit Calculator – TDEE, Deficit & Macro Planner
 * Description: Calculate your daily calorie deficit for weight loss. Get your
 *              TDEE, ideal calorie target, timeline to goal weight, and macro
 *              breakdown. Free, instant, science-based.
 * Keywords:    calorie deficit calculator, TDEE calculator, how many calories
 *              to lose weight, macro calculator, weight loss calculator,
 *              daily calorie intake calculator, calorie deficit for beginners
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

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
    --bg:         #0a0a0f;
    --deep:       #0e0e14;
    --surface:    rgba(255,255,255,0.03);
    --surface2:   rgba(255,255,255,0.05);
    --border:     rgba(255,255,255,0.07);
    --border2:    rgba(255,255,255,0.12);
    --text:       #f0e8d8;
    --text-mid:   #7a7068;
    --text-dim:   #3a3530;
    --gold:       #c9a84c;
    --gold-lt:    #e8c96a;
    --gold-dim:   rgba(201,168,76,0.12);
    --gold-bdr:   rgba(201,168,76,0.25);
    --gold-glow:  rgba(201,168,76,0.07);
    --green:      #5aaa78;
    --green-dim:  rgba(90,170,120,0.1);
    --green-bdr:  rgba(90,170,120,0.25);
    --red:        #e06060;
    --red-dim:    rgba(220,96,96,0.1);
    --blue:       #7b9cff;
    --blue-dim:   rgba(123,156,255,0.1);
    --orange:     #d4855a;
  }

  body { background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    overflow-x: hidden;
    position: relative;
  }

  /* Ambient */
  .amb {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
  }
  .amb::before {
    content: '';
    position: absolute; top: -15%; right: -5%; width: 50%; height: 55%;
    background: radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 65%);
  }
  .amb::after {
    content: '';
    position: absolute; bottom: -15%; left: -10%; width: 55%; height: 50%;
    background: radial-gradient(ellipse, rgba(90,120,60,0.04) 0%, transparent 65%);
  }

  /* ── HEADER ── */
  .header {
    position: relative; z-index: 1;
    text-align: center; padding: 56px 24px 32px;
  }

  .eyebrow {
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 14px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  .eyebrow-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold);
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  .site-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 300; color: var(--text);
    letter-spacing: -0.02em; line-height: 1.05;
  }
  .site-title em { color: var(--gold); font-style: italic; }

  .site-sub {
    font-size: 14px; color: var(--text-mid);
    margin-top: 12px; font-weight: 300; line-height: 1.7;
    max-width: 420px; margin-inline: auto;
  }

  .gold-line {
    width: 40px; height: 1px; margin: 20px auto 0;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  /* ── NAV ── */
  .nav {
    position: relative; z-index: 1;
    display: flex; justify-content: center;
    gap: 8px; padding: 0 24px 44px; flex-wrap: wrap;
  }

  .nav-btn {
    padding: 11px 22px; border-radius: 100px; min-height: 44px;
    border: 1px solid var(--gold-bdr);
    background: transparent; color: var(--text-mid);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.25s; letter-spacing: 0.03em;
    display: flex; align-items: center; gap: 7px;
  }
  .nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
  .nav-btn.active {
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    border-color: transparent; color: #0a0a0f; font-weight: 600;
    box-shadow: 0 4px 24px rgba(201,168,76,0.3);
  }

  /* ── LAYOUT ── */
  .main {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto; padding: 0 20px 100px;
  }

  /* ── CARD ── */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 34px; backdrop-filter: blur(20px);
    position: relative; overflow: hidden;
    animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-bdr), transparent);
  }

  .card-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 8px; display: block;
  }
  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 400; color: var(--text); margin-bottom: 4px;
  }
  .card-desc { font-size: 13px; color: var(--text-mid); margin-bottom: 28px; font-weight: 300; }

  /* ── FORM ── */
  .field { margin-bottom: 18px; }
  .label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--text-mid); margin-bottom: 8px;
  }
  .input {
    width: 100%; background: rgba(255,255,255,0.04);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 13px 16px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 400;
    outline: none; transition: all 0.2s;
  }
  .input:focus {
    border-color: var(--gold-bdr); background: var(--gold-dim);
    box-shadow: 0 0 0 3px var(--gold-glow);
  }
  .input::placeholder { color: var(--text-dim); }
  select.input {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23c9a84c' d='M5 7L0 2h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px;
  }
  select.input option { background: #14141a; color: var(--text); }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* toggles */
  .toggle-group { display: flex; gap: 6px; }
  .toggle-btn {
    flex: 1; padding: 12px; border-radius: 10px; border: 1px solid var(--border);
    background: transparent; color: var(--text-mid); font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;
    min-height: 46px; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .toggle-btn.active { border-color: var(--gold-bdr); background: var(--gold-dim); color: var(--gold); }

  /* goal grid */
  .goal-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  .goal-btn {
    padding: 14px 6px; border-radius: 10px; text-align: center;
    border: 1px solid var(--border); background: transparent; color: var(--text-mid);
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; min-height: 68px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  }
  .goal-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: var(--text); display: block;
  }
  .goal-tag { font-size: 9px; color: var(--text-dim); }
  .goal-btn.active { border-color: var(--gold-bdr); background: var(--gold-dim); color: var(--gold); }
  .goal-btn.active .goal-val { color: var(--gold); }

  /* ── BUTTON ── */
  .btn {
    width: 100%; padding: 15px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    color: #0a0a0f; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
    cursor: pointer; transition: all 0.25s; margin-top: 4px; min-height: 50px;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.35); }
  .btn:active { transform: translateY(0); }

  /* ── RESULTS ── */
  .results { margin-top: 28px; animation: fadeUp 0.35s ease; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-hero {
    padding: 28px; border-radius: 16px; text-align: center; margin-bottom: 14px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr);
  }
  .rh-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
    text-transform: uppercase; color: #8a7040; margin-bottom: 8px;
  }
  .rh-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 60px; font-weight: 300; color: var(--gold-lt); line-height: 1;
  }
  .rh-unit { font-size: 22px; opacity: 0.6; margin-left: 4px; }
  .rh-sub { font-size: 13px; color: var(--text-mid); margin-top: 8px; font-weight: 300; }

  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .stat-box {
    padding: 20px; border-radius: 12px; text-align: center;
    background: var(--surface); border: 1px solid var(--border);
  }
  .stat-icon { font-size: 20px; margin-bottom: 6px; display: block; }
  .stat-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-mid); margin-bottom: 6px;
  }
  .stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 400; color: var(--text); line-height: 1;
  }
  .stat-unit { font-size: 13px; color: var(--text-mid); }

  /* macros */
  .macro-wrap {
    padding: 22px; border-radius: 12px; margin-bottom: 14px;
    background: var(--surface); border: 1px solid var(--border);
  }
  .macro-header {
    font-size: 10px; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--text-mid); margin-bottom: 18px;
  }
  .macro-row { margin-bottom: 16px; }
  .macro-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
  .macro-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .macro-g {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400;
  }
  .bar-bg { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.05); overflow: hidden; }
  .bar { height: 100%; border-radius: 3px; transition: width 0.7s cubic-bezier(0.16,1,0.3,1); }
  .bar-p { background: linear-gradient(90deg, var(--gold), var(--gold-lt)); }
  .bar-c { background: linear-gradient(90deg, var(--blue), #a0b8ff); }
  .bar-f { background: linear-gradient(90deg, var(--green), #7acc8a); }

  /* timeline */
  .timeline {
    padding: 20px 22px; border-radius: 12px; margin-bottom: 14px;
    background: var(--green-dim); border: 1px solid var(--green-bdr);
    display: flex; align-items: center; gap: 16px;
  }
  .tl-icon { font-size: 28px; flex-shrink: 0; }
  .tl-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: #3a7050; margin-bottom: 4px;
  }
  .tl-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: var(--green);
  }
  .tl-sub { font-size: 12px; color: var(--text-mid); margin-top: 2px; }

  .warn {
    padding: 14px 18px; border-radius: 10px; margin-bottom: 14px;
    background: var(--red-dim); border: 1px solid rgba(220,96,96,0.25);
    font-size: 13px; color: var(--red); line-height: 1.6;
  }

  /* ── FOOD TABLE ── */
  .search-wrap { position: relative; margin-bottom: 20px; }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-mid); }
  .search-wrap .input { padding-left: 40px; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { border-bottom: 1px solid var(--gold-bdr); }
  thead th {
    padding: 8px 10px; text-align: left;
    font-size: 10px; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--gold);
  }
  thead th:not(:first-child) { text-align: right; }
  tbody tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
  tbody tr:hover { background: var(--gold-dim); }
  tbody td { padding: 11px 10px; color: var(--text); font-weight: 400; }
  tbody td:not(:first-child) { text-align: right; color: var(--text-mid); }
  .cal-val { color: var(--gold-lt) !important; font-weight: 500 !important;
    font-family: 'Cormorant Garamond', serif !important; font-size: 16px !important; }
  .food-name { font-weight: 500; }
  .food-per { font-size: 11px; color: var(--text-dim); }

  /* ── EMAIL CAPTURE ── */
  .ec {
    margin-top: 36px; padding: 30px 28px; border-radius: 20px;
    background: var(--surface); border: 1px solid var(--gold-bdr);
    position: relative; overflow: hidden;
  }
  .ec::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .ec-glow {
    position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px;
    background: radial-gradient(circle, var(--gold-glow), transparent 70%);
    pointer-events: none;
  }
  .ec-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }
  .ec-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: var(--text); margin-bottom: 8px; line-height: 1.2;
  }
  .ec-title em { color: var(--gold); font-style: italic; }
  .ec-sub { font-size: 13px; color: var(--text-mid); line-height: 1.7; margin-bottom: 18px; font-weight: 300; }
  .ec-bullets { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .ec-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--text-mid); }
  .ec-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); margin-top: 6px; flex-shrink: 0; }
  .ec-form { display: flex; gap: 8px; margin-bottom: 10px; }
  .ec-input {
    flex: 1; background: rgba(255,255,255,0.04); border: 1px solid var(--border);
    border-radius: 10px; padding: 13px 16px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: all 0.2s; min-height: 48px;
  }
  .ec-input:focus { border-color: var(--gold-bdr); background: var(--gold-dim); }
  .ec-input::placeholder { color: var(--text-dim); }
  .ec-btn {
    padding: 13px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    color: #0a0a0f; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; min-height: 48px; white-space: nowrap;
  }
  .ec-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.3); }
  .ec-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ec-lead { font-size: 11px; color: var(--gold); font-weight: 500; margin-bottom: 8px; }
  .ec-privacy { font-size: 11px; color: var(--text-dim); margin-top: 6px; }
  .ec-success {
    padding: 24px; border-radius: 14px; text-align: center;
    background: var(--green-dim); border: 1px solid var(--green-bdr);
    animation: fadeUp 0.3s ease;
  }
  .ec-success-icon { font-size: 36px; margin-bottom: 8px; display: block; }
  .ec-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: var(--green);
  }
  .ec-success-sub { font-size: 13px; color: var(--text-mid); margin-top: 4px; }
  .ec-err { font-size: 12px; color: var(--red); margin-top: 6px; }

  /* ── CTA ── */
  .cta {
    margin-top: 24px; padding: 30px 28px; border-radius: 20px;
    background: rgba(10,10,15,0.95); border: 1px solid var(--gold-bdr);
    position: relative; overflow: hidden;
  }
  .cta::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-bdr), transparent);
  }
  .cta-glow {
    position: absolute; top: -40px; right: -40px; width: 160px; height: 160px;
    background: radial-gradient(circle, var(--gold-glow), transparent 70%);
    pointer-events: none;
  }
  .cta-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 10px;
  }
  .cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: var(--text); line-height: 1.2; margin-bottom: 10px;
  }
  .cta-title em { color: var(--gold-lt); font-style: italic; }
  .cta-desc { font-size: 13px; color: var(--text-mid); line-height: 1.7; margin-bottom: 20px; font-weight: 300; }
  .cta-bullets { display: flex; flex-direction: column; gap: 7px; margin-bottom: 22px; }
  .cta-bullet { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--text-mid); }
  .cta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gold); margin-top: 7px; flex-shrink: 0; }
  .cta-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 15px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--gold), var(--gold-lt));
    color: #0a0a0f; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.25s;
    text-decoration: none; min-height: 50px; letter-spacing: 0.04em;
  }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.35); }
  .cta-price { text-align: center; margin-top: 10px; font-size: 12px; color: var(--text-mid); }

  /* ── FAQ ── */
  .faq-wrap { margin-top: 44px; padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.05); }
  .faq-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .faq-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 400; color: var(--text);
  }
  .seo-pill {
    font-size: 9px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 4px;
    background: var(--gold-dim); border: 1px solid var(--gold-bdr); color: var(--gold);
  }
  .faq-item { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 8px; }
  .faq-item.open { border-color: var(--gold-bdr); }
  .faq-q {
    width: 100%; padding: 15px 18px; min-height: 52px; background: transparent;
    border: none; cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--text);
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    transition: background 0.15s;
  }
  .faq-q:hover { background: rgba(255,255,255,0.02); }
  .faq-item.open .faq-q { color: var(--gold); }
  .faq-chevron { font-size: 11px; color: var(--text-mid); transition: transform 0.25s; flex-shrink: 0; }
  .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--gold); }
  .faq-a {
    padding: 0 18px; max-height: 0; overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    font-size: 13px; color: var(--text-mid); font-weight: 300; line-height: 1.8;
  }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 18px 16px; }

  /* ── FOOTER ── */
  .footer {
    position: relative; z-index: 1; text-align: center;
    padding: 28px 20px 40px; font-size: 11px; color: #2a2520;
    letter-spacing: 0.1em; text-transform: uppercase;
  }

  /* ── MOBILE ── */
  @media (max-width: 480px) {
    .header { padding: 36px 18px 22px; }
    .nav { gap: 6px; padding: 0 14px 28px; }
    .nav-btn { flex: 1; justify-content: center; padding: 11px 8px; font-size: 12px; }
    .main { padding: 0 14px 80px; }
    .card { padding: 22px 18px; border-radius: 16px; }
    .row2 { grid-template-columns: 1fr; gap: 0; }
    .goal-grid { grid-template-columns: repeat(2,1fr); }
    .stat-grid { grid-template-columns: 1fr; }
    .rh-value { font-size: 48px; }
    .timeline { flex-direction: column; text-align: center; }
    .ec { padding: 24px 18px; }
    .ec-form { flex-direction: column; }
    .ec-btn { width: 100%; }
    .cta { padding: 24px 18px; }
    .input { font-size: 16px; }
  }
  @media (min-width: 481px) and (max-width: 768px) {
    .input { font-size: 16px; }
  }
`;

/* ── DATA ── */
const ACTIVITY = [
  { val:1.2,   label:"Sedentary",    desc:"little or no exercise" },
  { val:1.375, label:"Light",        desc:"1–3 days per week" },
  { val:1.55,  label:"Moderate",     desc:"3–5 days per week" },
  { val:1.725, label:"Very Active",  desc:"6–7 days per week" },
  { val:1.9,   label:"Athlete",      desc:"twice daily training" },
];

const GOALS = [
  { kg:0.25, label:"Gentle",     cal:275,  tag:"slow & steady" },
  { kg:0.5,  label:"Steady",     cal:550,  tag:"recommended" },
  { kg:0.75, label:"Active",     cal:825,  tag:"ambitious" },
  { kg:1.0,  label:"Aggressive", cal:1100, tag:"hard mode" },
];

const FOODS = [
  { name:"Chicken Breast",  per:"100g",       cal:165, p:31,  c:0,   f:3.6 },
  { name:"Eggs",            per:"1 large",     cal:72,  p:6,   c:0.4, f:5 },
  { name:"Salmon",          per:"100g",        cal:208, p:20,  c:0,   f:13 },
  { name:"Brown Rice",      per:"100g cooked", cal:111, p:2.6, c:23,  f:0.9 },
  { name:"Sweet Potato",    per:"100g",        cal:86,  p:1.6, c:20,  f:0.1 },
  { name:"Oats",            per:"100g dry",    cal:389, p:17,  c:66,  f:7 },
  { name:"Greek Yogurt",    per:"100g",        cal:59,  p:10,  c:3.6, f:0.4 },
  { name:"Avocado",         per:"half",        cal:120, p:1.5, c:6,   f:11 },
  { name:"Banana",          per:"medium",      cal:89,  p:1.1, c:23,  f:0.3 },
  { name:"Almonds",         per:"28g",         cal:164, p:6,   c:6,   f:14 },
  { name:"Tuna in water",   per:"100g",        cal:109, p:24,  c:0,   f:1 },
  { name:"Peanut Butter",   per:"2 tbsp",      cal:188, p:8,   c:6,   f:16 },
  { name:"Tofu",            per:"100g",        cal:76,  p:8,   c:1.9, f:4.8 },
  { name:"Broccoli",        per:"100g",        cal:34,  p:2.8, c:7,   f:0.4 },
  { name:"Beef (lean)",     per:"100g",        cal:250, p:26,  c:0,   f:15 },
  { name:"White Rice",      per:"100g cooked", cal:130, p:2.7, c:28,  f:0.3 },
  { name:"Whole Milk",      per:"240ml",       cal:149, p:8,   c:12,  f:8 },
  { name:"Olive Oil",       per:"1 tbsp",      cal:119, p:0,   c:0,   f:14 },
  { name:"Apple",           per:"medium",      cal:95,  p:0.5, c:25,  f:0.3 },
  { name:"Bread, white",    per:"1 slice",     cal:79,  p:3,   c:15,  f:1 },
];

const FAQ_ITEMS = [
  { q:"What is a calorie deficit?", a:"A calorie deficit means consuming fewer calories than your body burns each day. Your body then uses stored fat for energy — resulting in weight loss. A deficit of 7,700 calories equates to approximately 1 kg of fat lost. A sustainable daily deficit of 300–600 calories is recommended for most people." },
  { q:"How do I calculate my calorie deficit?", a:"Start by calculating your TDEE — Total Daily Energy Expenditure, which is the number of calories you burn daily including activity. Then subtract your target deficit. For example, if your TDEE is 2,200 and you want to lose 0.5 kg per week, subtract 550 calories, giving a daily target of 1,650. This calculator automates the entire process." },
  { q:"What is TDEE and how is it calculated?", a:"TDEE stands for Total Daily Energy Expenditure — every calorie your body burns including at rest, through movement, and digestion. It's calculated by multiplying your Basal Metabolic Rate (BMR) by an activity factor. BMR is estimated using the Mifflin-St Jeor equation, which accounts for age, gender, height, and weight." },
  { q:"How many calories should I eat to lose 1 kg per week?", a:"Losing 1 kg of fat requires a cumulative deficit of approximately 7,700 calories. To achieve this in one week, you need a daily deficit of roughly 1,100 calories — which is aggressive. Most nutrition professionals recommend 0.5 kg per week (550 calorie deficit daily) for sustainable fat loss that preserves muscle." },
  { q:"Will eating too few calories slow my metabolism?", a:"Yes. Eating far below your TDEE triggers metabolic adaptation — your body reduces energy expenditure to compensate. This is why very low calorie diets plateau quickly. Keep your deficit at a maximum of 500–700 calories below your TDEE, and ensure a minimum intake of 1,200 cal/day (women) or 1,500 cal/day (men)." },
  { q:"What are macros and how should I split them?", a:"Macros are your three macronutrients: protein, carbohydrates, and fat. For fat loss, a split of 35% protein / 35% carbs / 30% fat is a solid starting point. Higher protein intake (30–40% of total calories) is particularly valuable during a deficit to preserve lean muscle mass while losing fat." },
  { q:"Does sleep affect weight loss?", a:"Significantly. Poor sleep elevates ghrelin (the hunger hormone) and suppresses leptin (the fullness hormone), which can add 300–500 extra calories to your daily intake. It also impairs insulin sensitivity and fat metabolism. Prioritising 7–9 hours of quality sleep is one of the most underrated fat loss strategies." },
  { q:"How accurate is this calorie calculator?", a:"This calculator uses the Mifflin-St Jeor equation, widely considered the most accurate formula for estimating BMR — typically within 10% for most people. Use the results as a starting point, track your actual weight over 2–3 weeks, and adjust by 100–150 calories based on real-world results." },
];

const FORM_ACTION = "https://formspree.io/f/mykllzge";

/* ── HELPERS ── */
function calcBMR(w, h, age, gender) {
  const base = 10*w + 6.25*h - 5*age;
  return gender === "male" ? base + 5 : base - 161;
}
function fmtN(n) { return Math.round(n).toLocaleString(); }
function weeksTo(deficit, kg) {
  if (!deficit || !kg) return null;
  const w = (kg * 7700) / (deficit * 7);
  if (w > 156) return "52+ weeks";
  if (w < 1)   return "< 1 week";
  const wk = Math.round(w);
  const mo = Math.floor(wk / 4.33);
  return mo >= 2 ? `~${mo} months` : `~${wk} week${wk!==1?"s":""}`;
}

/* ── EMAIL CAPTURE ── */
function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch(FORM_ACTION, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ email, source:"calorie-calculator" }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  }

  return (
    <div className="ec">
      <div className="ec-glow" />
      {status === "success" ? (
        <div className="ec-success">
          <span className="ec-success-icon">✦</span>
          <div className="ec-success-title">You're in.</div>
          <div className="ec-success-sub">Check your inbox for the 7-Day Calorie Reset Checklist.</div>
        </div>
      ) : (
        <>
          <div className="ec-eyebrow">Free Weekly Newsletter</div>
          <div className="ec-title">Practical fat loss, <em>weekly.</em></div>
          <div className="ec-sub">Science-backed nutrition tips, calorie strategies, and habit guides — delivered free, every week.</div>
          <div className="ec-bullets">
            {["Weekly meal ideas under your calorie target","The metabolism myths holding you back","Exclusive reader discounts on health guides"].map((b,i)=>(
              <div className="ec-bullet" key={i}><span className="ec-dot"/><span>{b}</span></div>
            ))}
          </div>
          <form className="ec-form" onSubmit={handleSubmit}>
            <input className="ec-input" type="email" placeholder="Your email address"
              value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="ec-btn" type="submit" disabled={status==="loading"}>
              {status==="loading"?"…":"Join →"}
            </button>
          </form>
          <div className="ec-lead">+ Free 7-Day Calorie Reset Checklist included</div>
          {status==="error" && <div className="ec-err">Something went wrong. Please try again.</div>}
          <div className="ec-privacy">No spam, ever. Unsubscribe anytime.</div>
        </>
      )}
    </div>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <div className="cta">
      <div className="cta-glow" />
      <div className="cta-label">The missing piece</div>
      <div className="cta-title">Your diet is only <em>half the equation.</em></div>
      <div className="cta-desc">Poor sleep raises hunger hormones by up to 24% — silently sabotaging your deficit before breakfast. The Better Sleep Guide is a 14-night reset built for people who are already doing the work but still not seeing results.</div>
      <div className="cta-bullets">
        {["How poor sleep directly undermines your calorie deficit","14-night circadian reset protocol, step by step","Evening routines that protect fat loss overnight","Why you may not be losing weight despite eating right"].map((b,i)=>(
          <div className="cta-bullet" key={i}><span className="cta-dot"/><span>{b}</span></div>
        ))}
      </div>
      <a className="cta-btn" href="https://mark203j.gumroad.com/l/vratf" target="_blank" rel="noopener noreferrer">
        🌙 Get the Better Sleep Guide — $19
      </a>
      <div className="cta-price">One-time purchase · Instant download · No subscription</div>
    </div>
  );
}

/* ── FAQ ── */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-wrap">
      <div className="faq-head">
        <div className="faq-title">Common Questions</div>
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

/* ══════════════════
   DEFICIT CALC
   ══════════════════ */
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
    let h = isImp ? ((parseFloat(hFt||0)*12)+parseFloat(hIn||0))*2.54 : parseFloat(height);
    if (isImp) w = w * 0.453592;
    if ([a,w,h].some(v=>isNaN(v)||v<=0)) return;

    const bmr   = calcBMR(w, h, a, gender);
    const tdee  = bmr * activity;
    const goal  = GOALS[goalIdx];
    const target = Math.round(tdee - goal.cal);
    const protein = Math.round((target*0.35)/4);
    const carbs   = Math.round((target*0.35)/4);
    const fat     = Math.round((target*0.30)/9);
    const gw  = parseFloat(goalWt);
    const gwKg = isImp ? gw*0.453592 : gw;
    const diff = !isNaN(gwKg)&&gwKg>0 ? Math.abs(w-gwKg) : null;
    const tl = weeksTo(goal.cal, diff);

    setResult({ bmr:Math.round(bmr), tdee:Math.round(tdee), target, deficit:goal.cal, protein, carbs, fat, tl, diff, goal, tooLow:target<1200 });
    setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"}),100);
  }

  return (
    <>
      <div className="card">
        <span className="card-label">Calorie Calculator</span>
        <div className="card-title">Your Daily Target</div>
        <div className="card-desc">Enter your details to receive your personalised calorie target, macros, and weight loss timeline.</div>

        <div className="field">
          <label className="label">Units</label>
          <div className="toggle-group">
            {["metric","imperial"].map(u=>(
              <button key={u} className={`toggle-btn${unit===u?" active":""}`}
                onClick={()=>{setUnit(u);setResult(null);}}>
                {u==="metric"?"Metric — kg / cm":"Imperial — lbs / ft"}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">Biological Sex</label>
          <div className="toggle-group">
            <button className={`toggle-btn${gender==="female"?" active":""}`} onClick={()=>setGender("female")}>Female</button>
            <button className={`toggle-btn${gender==="male"?" active":""}`} onClick={()=>setGender("male")}>Male</button>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label className="label">Age</label>
            <input className="input" type="number" placeholder="e.g. 32" value={age}
              onChange={e=>setAge(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          </div>
          <div className="field">
            <label className="label">Weight ({isImp?"lbs":"kg"})</label>
            <input className="input" type="number" placeholder={isImp?"154":"70"} value={weight}
              onChange={e=>setWeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          </div>
        </div>

        <div className="field">
          <label className="label">Height</label>
          {isImp ? (
            <div className="row2">
              <input className="input" type="number" placeholder="Feet" value={hFt} onChange={e=>setHFt(e.target.value)} />
              <input className="input" type="number" placeholder="Inches" value={hIn} onChange={e=>setHIn(e.target.value)} />
            </div>
          ) : (
            <input className="input" type="number" placeholder="e.g. 165 cm" value={height}
              onChange={e=>setHeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calculate()} />
          )}
        </div>

        <div className="field">
          <label className="label">Activity Level</label>
          <select className="input" value={activity} onChange={e=>setActivity(parseFloat(e.target.value))}>
            {ACTIVITY.map(a=><option key={a.val} value={a.val}>{a.label} — {a.desc}</option>)}
          </select>
        </div>

        <div className="field">
          <label className="label">Weekly Loss Goal</label>
          <div className="goal-grid">
            {GOALS.map((g,i)=>(
              <button key={i} className={`goal-btn${goalIdx===i?" active":""}`} onClick={()=>setGoalIdx(i)}>
                <span className="goal-val">{g.kg}<span style={{fontSize:13}}>kg</span></span>
                {g.label}
                <span className="goal-tag">{g.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">Goal Weight ({isImp?"lbs":"kg"}) — optional</label>
          <input className="input" type="number" placeholder="For timeline estimate" value={goalWt}
            onChange={e=>setGoalWt(e.target.value)} />
        </div>

        <button className="btn" onClick={calculate}>Calculate →</button>

        {result && (
          <div className="results" ref={resultRef}>
            <div className="result-hero">
              <div className="rh-label">Daily Calorie Target</div>
              <div className="rh-value">{fmtN(result.target)}<span className="rh-unit">cal</span></div>
              <div className="rh-sub">Deficit of {fmtN(result.deficit)} cal/day · ~{result.goal.kg}kg loss per week</div>
            </div>

            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-icon">🔥</span>
                <div className="stat-label">Your TDEE</div>
                <div className="stat-val">{fmtN(result.tdee)}<span className="stat-unit"> cal</span></div>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🛌</span>
                <div className="stat-label">Your BMR</div>
                <div className="stat-val">{fmtN(result.bmr)}<span className="stat-unit"> cal</span></div>
              </div>
            </div>

            <div className="macro-wrap">
              <div className="macro-header">Daily Macro Targets — {fmtN(result.target)} calories</div>
              {[
                { name:"Protein", pct:35, g:result.protein, bar:"bar-p", col:"var(--gold-lt)" },
                { name:"Carbohydrates", pct:35, g:result.carbs, bar:"bar-c", col:"var(--blue)" },
                { name:"Fat", pct:30, g:result.fat, bar:"bar-f", col:"var(--green)" },
              ].map(m=>(
                <div className="macro-row" key={m.name}>
                  <div className="macro-head">
                    <span className="macro-name">{m.name} <span style={{color:"var(--text-mid)",fontWeight:300,fontSize:12}}>({m.pct}%)</span></span>
                    <span className="macro-g" style={{color:m.col}}>{m.g}g</span>
                  </div>
                  <div className="bar-bg">
                    <div className={`bar ${m.bar}`} style={{width:`${m.pct/0.4}%`}} />
                  </div>
                </div>
              ))}
            </div>

            {result.tl && (
              <div className="timeline">
                <span className="tl-icon">📅</span>
                <div>
                  <div className="tl-label">Estimated Timeline</div>
                  <div className="tl-val">{result.tl}</div>
                  <div className="tl-sub">to lose ~{result.diff?.toFixed(1)}kg at {result.goal.kg}kg per week</div>
                </div>
              </div>
            )}

            {result.tooLow && (
              <div className="warn">
                ⚠ Your target of {fmtN(result.target)} calories is below the recommended minimum. Consider a slower weekly goal to protect your metabolism and muscle mass.
              </div>
            )}
          </div>
        )}
      </div>
      <EmailCapture />
      <CTA />
      <FAQ />
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
      <span className="card-label">Reference</span>
      <div className="card-title">Common Food Calories</div>
      <div className="card-desc">Quick reference for tracking your daily intake. Search to filter.</div>
      <div className="search-wrap field">
        <span className="search-icon">🔍</span>
        <input className="input" type="text" placeholder="Search foods…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div style={{overflowX:"auto"}}>
        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th style={{textAlign:"right"}}>Calories</th>
              <th style={{textAlign:"right"}}>Protein</th>
              <th style={{textAlign:"right"}}>Carbs</th>
              <th style={{textAlign:"right"}}>Fat</th>
            </tr>
          </thead>
          <tbody>
            {list.map((f,i)=>(
              <tr key={i}>
                <td>
                  <div className="food-name">{f.name}</div>
                  <div className="food-per">{f.per}</div>
                </td>
                <td className="cal-val">{f.cal}</td>
                <td>{f.p}g</td>
                <td>{f.c}g</td>
                <td>{f.f}g</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={5} style={{textAlign:"center",padding:"28px",color:"var(--text-mid)"}}>No results</td></tr>}
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
    let hM  = isImp ? ((parseFloat(hFt||0)*12)+parseFloat(hIn||0))*0.0254 : parseFloat(h)/100;
    if([wKg,hM].some(v=>isNaN(v)||v<=0)) return;
    const bmi = wKg/(hM*hM);
    const cat = bmi<18.5?"Underweight":bmi<25?"Normal Weight":bmi<30?"Overweight":"Obese";
    const col = bmi<18.5?"var(--blue)":bmi<25?"var(--green)":bmi<30?"var(--orange)":"var(--red)";
    const lo  = isImp ? (18.5*hM*hM*2.20462).toFixed(1) : (18.5*hM*hM).toFixed(1);
    const hi  = isImp ? (24.9*hM*hM*2.20462).toFixed(1) : (24.9*hM*hM).toFixed(1);
    setRes({ bmi:bmi.toFixed(1), cat, col, lo, hi });
  }

  return (
    <div className="card">
      <span className="card-label">Quick Check</span>
      <div className="card-title">BMI Calculator</div>
      <div className="card-desc">Body Mass Index — a quick indicator of healthy weight range for your height.</div>

      <div className="field">
        <label className="label">Units</label>
        <div className="toggle-group">
          {["metric","imperial"].map(u=>(
            <button key={u} className={`toggle-btn${unit===u?" active":""}`}
              onClick={()=>{setUnit(u);setRes(null);}}>
              {u==="metric"?"Metric — kg / cm":"Imperial — lbs / ft"}
            </button>
          ))}
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label className="label">Weight ({isImp?"lbs":"kg"})</label>
          <input className="input" type="number" placeholder={isImp?"154":"70"} value={w}
            onChange={e=>setW(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calc()} />
        </div>
        <div className="field">
          <label className="label">Height</label>
          {isImp ? (
            <div className="row2">
              <input className="input" type="number" placeholder="ft" value={hFt} onChange={e=>setHFt(e.target.value)} />
              <input className="input" type="number" placeholder="in" value={hIn} onChange={e=>setHIn(e.target.value)} />
            </div>
          ) : (
            <input className="input" type="number" placeholder="e.g. 165 cm" value={h}
              onChange={e=>setH(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calc()} />
          )}
        </div>
      </div>

      <button className="btn" onClick={calc}>Calculate BMI →</button>

      {res && (
        <div className="results">
          <div className="result-hero" style={{background:`${res.col}14`,border:`1px solid ${res.col}33`}}>
            <div className="rh-label" style={{color:res.col}}>Your BMI</div>
            <div className="rh-value" style={{color:res.col,fontSize:64}}>{res.bmi}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:res.col,marginTop:4}}>{res.cat}</div>
            <div className="rh-sub">Healthy range for your height: {res.lo}–{res.hi} {isImp?"lbs":"kg"}</div>
          </div>
          <div style={{padding:"16px 18px",borderRadius:10,background:"var(--surface)",border:"1px solid var(--border)",fontSize:13,color:"var(--text-mid)",lineHeight:1.7,fontWeight:300}}>
            BMI is a useful screening tool but does not account for muscle mass or body composition. Athletes may show a high BMI despite low body fat. Use it as a starting reference, not a definitive measure.
          </div>
        </div>
      )}
    </div>
  );
}

/* ── APP ── */
const TABS = [
  { id:"deficit", icon:"✦", label:"Deficit" },
  { id:"food",    icon:"◈", label:"Food Cals" },
  { id:"bmi",     icon:"◎", label:"BMI" },
];

export default function App() {
  const [tab, setTab] = useState("deficit");

  useEffect(()=>{
    const metas = [
      { name:"viewport",                         content:"width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" },
      { name:"apple-mobile-web-app-capable",     content:"yes" },
      { name:"apple-mobile-web-app-status-bar-style", content:"black-translucent" },
      { name:"apple-mobile-web-app-title",       content:"Calorie Calculator" },
      { name:"theme-color",                      content:"#0a0a0f" },
      { name:"description",                      content:"Free calorie deficit calculator: TDEE, daily calorie target, macros, and weight loss timeline. Science-based, instant, no sign-up." },
    ];
    metas.forEach(({name,content})=>{
      if(!document.querySelector(`meta[name="${name}"]`)){
        const el=document.createElement("meta"); el.name=name; el.content=content;
        document.head.appendChild(el);
      }
    });
    document.title="Calorie Deficit Calculator – TDEE, Macros & Weight Loss Timeline";
  },[]);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="amb" />
        <header className="header">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Free Tool · Science-Based
          </div>
          <h1 className="site-title">
            Calorie <em>Deficit</em><br />Calculator
          </h1>
          <p className="site-sub">
            Find your daily calorie target, macros, and how long it takes to reach your goal weight — instantly.
          </p>
          <div className="gold-line" />
        </header>

        <nav className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>

        <main className="main">
          {tab==="deficit" && <DeficitCalc />}
          {tab==="food"    && <FoodTable />}
          {tab==="bmi"     && <BMICalc />}
        </main>

        <footer className="footer">
          Calorie Deficit Calculator · Free Forever · No Sign-up Required
        </footer>
      </div>
    </>
  );
}
