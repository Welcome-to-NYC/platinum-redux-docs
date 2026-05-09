import { load, pkmnIdFromName } from "../data.js";
import { setTitle, escape, debounce, spriteImg, typeChips, empty, fmt } from "../ui.js";

export async function render(params, root) {
  setTitle("Bosses");
  const bosses = await load("bosses");

  root.innerHTML = `
    <h1 class="h-title">BOSSES</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${bosses.length} boss fights · IV / Nature / Speed shown for both Normal and Hard mode (HC)</p>

    <div class="toolbar">
      <div class="field">
        <label for="bs-search">Search</label>
        <input id="bs-search" type="search" placeholder="Boss name or Pokémon…" autocomplete="off">
      </div>
    </div>

    <div id="bs-list"></div>
  `;

  const search = document.getElementById("bs-search");
  const listEl = document.getElementById("bs-list");

  async function apply() {
    const q = search.value.trim().toLowerCase();
    let result = bosses.filter((b) => {
      if (!q) return true;
      const blob = `${b.name || ""} ${b.team.map((m) => m.pokemon).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
    if (!result.length) { listEl.innerHTML = empty("No bosses match."); return; }
    const cap = 80;
    const shown = result.slice(0, cap);
    listEl.innerHTML = (await Promise.all(shown.map((b) => bossCard(b)))).join("")
      + (result.length > cap ? `<p style="color:var(--ink-mute);font-size:1rem;text-align:center;margin:1rem 0;">Showing first ${cap} of ${result.length}.</p>` : "");
  }

  apply();
  search.addEventListener("input", debounce(apply, 100));
}

async function bossCard(b) {
  const monsHtml = (await Promise.all(b.team.map(async (m) => {
    const id = await pkmnIdFromName(m.pokemon);
    return `
      <div class="team__mon">
        <div class="sprite-mini">${spriteImg(m.pokemon)}</div>
        <div class="team__info">
          <div class="team__name">${escape(m.pokemon)} <span class="team__lvl">Lv ${fmt(m.level)}</span></div>
          <div>${typeChips(m.type1, m.type2)}</div>
          <div style="font-size:.95rem;color:var(--ink-mute);margin-top:.25rem;line-height:1.4;">
            ${m.ability ? escape(m.ability) : ""}${m.item && m.item !== "-" ? ` · @ ${escape(m.item)}` : ""}<br>
            ${m.nature ? `<strong>${escape(m.nature)}</strong> · IV ${escape(fmt(m.ivs))} · Spd ${fmt(m.speed)}` : ""}
            ${m.nature_hc ? ` <span style="color:var(--accent);">| HC: ${escape(m.nature_hc)} · IV ${escape(fmt(m.ivs_hc))} · Spd ${fmt(m.speed_hc)}</span>` : ""}
          </div>
          ${m.moves?.length ? `<div class="team__moves">${m.moves.map((mv) => `<span>${escape(mv)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
  }))).join("");

  return `
    <section class="trainer-card">
      <div class="trainer-card__head">
        <h3 class="trainer-card__name">${escape(b.name || "Boss")}</h3>
        ${b.id != null ? `<span class="trainer-card__area">#${escape(fmt(b.id))}</span>` : ""}
      </div>
      <div class="team">${monsHtml}</div>
    </section>`;
}
