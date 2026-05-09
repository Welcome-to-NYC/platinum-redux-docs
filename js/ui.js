// Shared UI helpers: type chips, sprite imgs, escape, etc.

import { spriteUrl, spriteUrlFallback, getCanonicalMapSync, canonicalIdSync } from "./data.js";

export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") {
      e.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "dataset") {
      for (const [dk, dv] of Object.entries(v)) e.dataset[dk] = dv;
    } else {
      e.setAttribute(k, v);
    }
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    if (typeof c === "string" || typeof c === "number") {
      e.appendChild(document.createTextNode(String(c)));
    } else {
      e.appendChild(c);
    }
  }
  return e;
}

export function escape(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const TYPE_CLASSES = new Set([
  "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost",
  "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon",
  "dark", "fairy", "physical", "special", "status",
]);

export function typeClass(t) {
  if (!t) return "";
  const k = String(t).toLowerCase().trim();
  return TYPE_CLASSES.has(k) ? `t-${k}` : "";
}

export function typeChip(t) {
  if (!t) return "";
  const cls = typeClass(t);
  return `<span class="t-chip ${cls}">${escape(t)}</span>`;
}

export function typeChips(t1, t2) {
  let html = typeChip(t1);
  if (t2 && t2 !== t1) html += typeChip(t2);
  return html;
}

// Pokemon sprite img with fallback to default sprite if Platinum sprite missing.
// `nameOrCanonicalId` is the species name (preferred) — we'll look up the
// canonical PokeAPI id for sprites. If you already have the canonical id,
// pass a number instead.
export function spriteImg(nameOrCanonicalId, displayName = "") {
  let canonId = null;
  if (typeof nameOrCanonicalId === "number") {
    canonId = nameOrCanonicalId;
  } else if (typeof nameOrCanonicalId === "string") {
    const map = getCanonicalMapSync();
    canonId = canonicalIdSync(nameOrCanonicalId, map);
  }
  if (!canonId) return `<div class="sprite-empty"></div>`;
  const url = spriteUrl(canonId);
  const fallback = spriteUrlFallback(canonId);
  return `<img loading="lazy" decoding="async" src="${url}" alt="${escape(displayName || nameOrCanonicalId || `#${canonId}`)}" onerror="this.onerror=null;this.src='${fallback}';">`;
}

// Title-case a name like "BULBASAUR" -> "Bulbasaur"
export function titleCase(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .replace(/(^|\s|-)([a-z])/g, (m) => m.toUpperCase());
}

export function statColor(value) {
  if (value == null) return "";
  if (value >= 110) return "stat__fill--good";
  if (value >= 80) return "";
  if (value >= 55) return "stat__fill--mid";
  return "stat__fill--low";
}

export function statBar(label, value, max = 200) {
  const v = value || 0;
  const pct = Math.min(100, Math.round((v / max) * 100));
  const cls = statColor(v);
  return `
    <div class="stat">
      <div class="stat__label">${escape(label)}</div>
      <div class="stat__num">${v}</div>
      <div class="stat__bar"><div class="stat__fill ${cls}" style="width:${pct}%"></div></div>
    </div>`;
}

export function bstBar(value) {
  const v = value || 0;
  const pct = Math.min(100, Math.round((v / 720) * 100));
  return `
    <div class="stat stat--bst">
      <div class="stat__label">BST</div>
      <div class="stat__num">${v}</div>
      <div class="stat__bar"><div class="stat__fill" style="width:${pct}%; background: linear-gradient(180deg, rgba(255,255,255,.18) 0 50%, transparent 50%), var(--accent-2);"></div></div>
    </div>`;
}

// Number formatting
export function fmt(n) {
  if (n == null || n === "") return "—";
  if (typeof n === "number") {
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }
  return String(n);
}

// Debounce for search inputs
export function debounce(fn, ms = 120) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// Set page title
export function setTitle(suffix) {
  document.title = suffix ? `${suffix} — Platinum Redux` : "Platinum Redux — v3.3 Docs";
}

// Loading skeleton
export function loadingHtml() {
  return `
    <div class="loading">
      <div class="loading__box">
        <div class="loading__bars"><span></span><span></span><span></span></div>
        <p class="loading__text">Loading…</p>
      </div>
    </div>`;
}

// Empty state
export function empty(text = "Nothing here.") {
  return `<div class="empty">— ${escape(text)} —</div>`;
}

// Render multi-line text safely. Source data may contain literal `\n` (two
// characters) or real newlines — both should become line breaks.
export function multiline(s) {
  if (s == null) return "";
  return escape(String(s).replace(/\\n/g, "\n")).replace(/\n/g, "<br>");
}
