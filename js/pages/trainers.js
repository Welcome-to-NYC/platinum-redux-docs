import { load, pkmnIdFromName } from "../data.js";
import { setTitle, escape, debounce, spriteImg, typeChips, empty, fmt } from "../ui.js";

export async function render(params, root) {
  setTitle("Trainers");
  const trainers = await load("trainers");

  // Group by area, but allow flat search
  const areas = [...new Set(trainers.map((t) => t.area).filter(Boolean))];

  root.innerHTML = `
    <h1 class="h-title">TRAINERS</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${trainers.length} trainers · search by name, area, or Pokémon</p>

    <div class="toolbar">
      <div class="field">
        <label for="tr-search">Search</label>
        <input id="tr-search" type="search" placeholder="Trainer, area, or Pokémon…" autocomplete="off">
      </div>
      <div class="field" style="flex:0 0 240px;">
        <label for="tr-area">Area</label>
        <select id="tr-area">
          <option value="">All areas (${areas.length})</option>
          ${areas.map((a) => `<option value="${escape(a)}">${escape(a)}</option>`).join("")}
        </select>
      </div>
    </div>

    <div id="tr-list"></div>
  `;

  const search = document.getElementById("tr-search");
  const areaSel = document.getElementById("tr-area");
  const listEl = document.getElementById("tr-list");

  async function apply() {
    const q = search.value.trim().toLowerCase();
    const area = areaSel.value;
    let result = trainers.filter((t) => {
      if (area && t.area !== area) return false;
      if (q) {
        const blob = `${t.area || ""} ${t.name || ""} ${t.team.map((m) => m.pokemon).join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    if (!result.length) { listEl.innerHTML = empty("No trainers match."); return; }

    // Render in batches if huge
    const cap = 200;
    const shown = result.slice(0, cap);
    listEl.innerHTML = (await Promise.all(shown.map((t) => trainerCard(t)))).join("")
      + (result.length > cap ? `<p style="color:var(--ink-mute);font-size:1rem;text-align:center;margin:1rem 0;">Showing first ${cap} of ${result.length}. Refine search to see more.</p>` : "");
  }

  apply();
  search.addEventListener("input", debounce(apply, 100));
  areaSel.addEventListener("change", apply);
}

async function trainerCard(t) {
  const monsHtml = (await Promise.all(t.team.map(async (m) => {
    const id = await pkmnIdFromName(m.pokemon);
    return `
      <div class="team__mon">
        <div class="sprite-mini">${id ? spriteImg(id, m.pokemon) : ""}</div>
        <div class="team__info">
          <div class="team__name">${escape(m.pokemon)} <span class="team__lvl">Lv ${fmt(m.level)}</span></div>
          <div>${typeChips(m.type1, m.type2)}</div>
          <div style="font-size:.95rem;color:var(--ink-mute);margin-top:.25rem;">
            ${m.ability ? escape(m.ability) : ""}${m.item && m.item !== "-" ? ` · @ ${escape(m.item)}` : ""}
          </div>
          ${m.moves?.length ? `<div class="team__moves">${m.moves.map((mv) => `<span>${escape(mv)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
  }))).join("");

  return `
    <section class="trainer-card">
      <div class="trainer-card__head">
        <h3 class="trainer-card__name">${escape(t.name || "Trainer")}</h3>
        <span class="trainer-card__area">${escape(t.area || "")}</span>
      </div>
      <div class="team">${monsHtml}</div>
    </section>`;
}
