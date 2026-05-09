import { load, pkmnIdFromName } from "../data.js";
import { setTitle, escape, debounce, spriteImg, empty, fmt } from "../ui.js";

export async function render(params, root) {
  setTitle("Wild Encounters");
  const encounters = await load("encounters");

  root.innerHTML = `
    <h1 class="h-title">WILD ENCOUNTERS</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${encounters.length} areas</p>

    <div class="toolbar">
      <div class="field">
        <label for="en-search">Search</label>
        <input id="en-search" type="search" placeholder="Area or Pokémon…" autocomplete="off">
      </div>
    </div>

    <div id="en-list"></div>
  `;

  const search = document.getElementById("en-search");
  const listEl = document.getElementById("en-list");

  async function apply() {
    const q = search.value.trim().toLowerCase();
    const result = encounters.filter((a) => {
      if (!q) return true;
      const blob = `${a.area} ${a.encounters.map((e) => e.pokemon).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
    if (!result.length) { listEl.innerHTML = empty("No encounters match."); return; }
    listEl.innerHTML = (await Promise.all(result.map((a) => areaCard(a, q)))).join("");
  }

  apply();
  search.addEventListener("input", debounce(apply, 100));
}

async function areaCard(area, q) {
  const monsHtml = (await Promise.all(area.encounters.map(async (e) => {
    const id = await pkmnIdFromName(e.pokemon);
    const link = id ? `#/pokemon/${id}` : null;
    const sprite = spriteImg(e.pokemon);
    const inner = `
      <div class="sprite-mini">${sprite}</div>
      <div>
        <div style="font-family:var(--font-pixel);font-size:.55rem;letter-spacing:1px;text-transform:uppercase;color:var(--ink);">${escape(e.pokemon)}</div>
        <div style="font-size:.95rem;color:var(--ink-mute);">${e.pct ? `${e.pct}%` : "—"}</div>
      </div>`;
    return link
      ? `<a href="${link}" style="display:flex;gap:.5rem;align-items:center;background:var(--bg-2);border:2px solid var(--line);padding:.4rem .55rem;color:var(--ink);text-decoration:none;">${inner}</a>`
      : `<div style="display:flex;gap:.5rem;align-items:center;background:var(--bg-2);border:2px solid var(--line);padding:.4rem .55rem;">${inner}</div>`;
  }))).join("");

  return `
    <section class="trainer-card">
      <div class="trainer-card__head">
        <h3 class="trainer-card__name">${escape(area.area || "Area")}</h3>
        <span class="trainer-card__area">${area.encounters.length} entries</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.4rem;">${monsHtml}</div>
    </section>`;
}
