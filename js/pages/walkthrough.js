import { load, pkmnIdFromName } from "../data.js";
import { setTitle, escape, debounce, empty, spriteImg } from "../ui.js";

// Normalize an area name for fuzzy matching.
// Walkthrough side uses "201/Verity Lakefront" or "219.0" or "Twinleaf Town".
// Encounter side uses "Route 201 (Tall grass)", "Route 201 / Verity Lakefront (Tall grass)", "Twinleaf Town (Tall grass)".
function normArea(s) {
  if (s == null) return "";
  return String(s)
    .toLowerCase()
    .replace(/\.0+$/, "")              // "219.0" → "219"
    .replace(/\(.*?\)/g, "")           // strip "(Tall grass)" etc
    .replace(/^route\s+/i, "")         // strip leading "Route "
    .replace(/[\s\-_/´`'"’´]+/g, "")   // collapse whitespace + slashes
    .replace(/[^a-z0-9]/g, "");
}

// Token set for partial overlap (e.g. walkthrough "201/Verity Lakefront" tokens
// {201, verity, lakefront} vs encounter "Route 201 / Verity Lakefront (Tall grass)" tokens
// {201, verity, lakefront}).
function tokens(s) {
  if (s == null) return new Set();
  return new Set(
    String(s)
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/^route\s+/i, "")
      .replace(/\.0+\b/g, "")
      .split(/[\s\-_/´`'"’´]+/)
      .filter((t) => t && t.length > 1 && t !== "route" && t !== "the")
  );
}

function matchEncounters(walkArea, encounters) {
  if (!walkArea) return [];
  const wantNorm = normArea(walkArea);
  const wantToks = tokens(walkArea);
  const scored = [];
  for (const a of encounters) {
    const aNorm = normArea(a.area);
    const aToks = tokens(a.area);
    let score = 0;
    if (wantNorm && aNorm && (wantNorm === aNorm || aNorm.startsWith(wantNorm) || wantNorm.startsWith(aNorm))) {
      score += 10;
    }
    let overlap = 0;
    for (const t of wantToks) if (aToks.has(t)) overlap++;
    if (wantToks.size && overlap >= Math.min(2, wantToks.size)) score += overlap * 2;
    else if (overlap >= 1 && wantToks.size === 1) score += 3;
    if (score > 0) scored.push({ area: a, score });
  }
  scored.sort((x, y) => y.score - x.score);
  return scored.map((s) => s.area);
}

export async function render(params, root) {
  setTitle("Walkthrough");
  const [wt, encounters] = await Promise.all([load("walkthrough"), load("encounters")]);

  // Group by area in order
  const groups = [];
  let last = null;
  for (const row of wt) {
    if (!last || last.area !== row.area) {
      last = { area: row.area, items: [] };
      groups.push(last);
    }
    last.items.push({ item: row.item, restriction: row.restriction });
  }

  root.innerHTML = `
    <h1 class="h-title">WALKTHROUGH</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${groups.length} areas · click any <strong style="color:var(--accent-2);">Wild encounter</strong> to see what's there</p>

    <div class="toolbar">
      <div class="field">
        <label for="wt-search">Search</label>
        <input id="wt-search" type="search" placeholder="Area or item…" autocomplete="off">
      </div>
    </div>

    <div id="wt-list"></div>
  `;

  const search = document.getElementById("wt-search");
  const listEl = document.getElementById("wt-list");

  function isWildItem(item) {
    if (!item) return false;
    return /wild\s*encounter/i.test(String(item));
  }

  function itemHtml(it, areaName, idx) {
    const wild = isWildItem(it.item);
    const cls = wild ? "wt-item wt-item--wild" : "wt-item";
    const attrs = wild
      ? `data-wild="1" data-area="${escape(areaName)}" data-idx="${idx}" tabindex="0" role="button"`
      : "";
    return `
      <li class="${cls}" ${attrs}>
        <div class="wt-item__row">
          <span>${escape(it.item || "")}${wild ? ' <span class="wt-item__chev">▾</span>' : ""}</span>
        </div>
        ${it.restriction ? `<div style="font-size:.95rem;color:var(--ink-mute);margin-top:2px;">⚠ ${escape(it.restriction)}</div>` : ""}
        ${wild ? `<div class="wt-item__expand" hidden></div>` : ""}
      </li>`;
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const result = groups.filter((g) => {
      if (!q) return true;
      const blob = `${g.area || ""} ${g.items.map((i) => `${i.item || ""} ${i.restriction || ""}`).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
    if (!result.length) { listEl.innerHTML = empty("Nothing matches."); return; }
    listEl.innerHTML = result.map((g) => `
      <section class="trainer-card">
        <div class="trainer-card__head">
          <h3 class="trainer-card__name">${escape(g.area || "Area")}</h3>
          <span class="trainer-card__area">${g.items.length} items</span>
        </div>
        <ul class="wt-items">
          ${g.items.map((it, i) => itemHtml(it, g.area || "", i)).join("")}
        </ul>
      </section>
    `).join("");
  }

  // Click handler for wild-encounter expand
  listEl.addEventListener("click", async (e) => {
    const li = e.target.closest('.wt-item--wild');
    if (!li) return;
    const expand = li.querySelector(".wt-item__expand");
    if (!expand) return;
    if (li.classList.toggle("is-open")) {
      expand.hidden = false;
      if (!expand.dataset.loaded) {
        const areaName = li.dataset.area || "";
        const matched = matchEncounters(areaName, encounters);
        expand.innerHTML = await renderMatched(areaName, matched);
        expand.dataset.loaded = "1";
      }
    } else {
      expand.hidden = true;
    }
  });
  // Keyboard accessibility
  listEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const li = e.target.closest('.wt-item--wild');
    if (!li) return;
    e.preventDefault();
    li.click();
  });

  apply();
  search.addEventListener("input", debounce(apply, 100));
}

async function renderMatched(walkAreaName, matchedAreas) {
  if (!matchedAreas.length) {
    return `<div class="wt-no-match">No wild data found for "${escape(walkAreaName)}".</div>`;
  }
  const blocks = await Promise.all(matchedAreas.map(async (a) => {
    const mons = await Promise.all(a.encounters.map(async (e) => {
      const id = await pkmnIdFromName(e.pokemon);
      const link = id ? `#/pokemon/${id}` : null;
      const sprite = id ? spriteImg(id, e.pokemon) : "";
      const inner = `
        <div class="sprite-mini">${sprite}</div>
        <div>
          <div style="font-family:var(--font-pixel);font-size:.5rem;letter-spacing:1px;text-transform:uppercase;color:var(--ink);">${escape(e.pokemon)}</div>
          <div style="font-size:.95rem;color:var(--ink-mute);">${e.pct ? `${e.pct}%` : "—"}</div>
        </div>`;
      return link
        ? `<a href="${link}" class="wt-mon">${inner}</a>`
        : `<div class="wt-mon">${inner}</div>`;
    }));
    return `
      <div class="wt-encblock">
        <div class="wt-encblock__head">${escape(a.area)} <span style="color:var(--ink-mute);font-size:.5rem;">${a.encounters.length}</span></div>
        <div class="wt-encblock__grid">${mons.join("")}</div>
      </div>`;
  }));
  return blocks.join("");
}
