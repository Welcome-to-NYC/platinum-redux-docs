import { load, pkmnIdFromName, normName } from "../data.js";
import {
  setTitle, spriteImg, typeChips, escape, statBar, bstBar, fmt,
} from "../ui.js";

export async function render(params, root) {
  const pid = parseInt(params.id, 10);
  if (!pid) {
    root.innerHTML = `<a class="back-link" href="#/pokedex">← Pokédex</a><div class="empty">Bad Pokémon ID.</div>`;
    return;
  }

  const [pokemon, levelup, tmLearn, trainers, bosses, encounters, moves, forms] = await Promise.all([
    load("pokemon"), load("levelup"), load("tm_learn"), load("trainers"),
    load("bosses"), load("encounters"), load("moves"), load("forms"),
  ]);

  const p = pokemon.find((x) => x.id === pid);
  if (!p) {
    root.innerHTML = `<a class="back-link" href="#/pokedex">← Pokédex</a><div class="empty">Pokémon #${pid} not found.</div>`;
    return;
  }
  setTitle(p.name);

  const moveByName = new Map();
  for (const m of moves) {
    if (m && m.name) moveByName.set(normName(m.name), m);
  }
  const movePill = (name) => {
    if (!name) return "";
    const m = moveByName.get(normName(name));
    if (!m) return `<span>${escape(name)}</span>`;
    return `<span title="${escape(m.type || "")} · ${escape(m.category || "")}${m.power ? ` · Pow ${m.power}` : ""}${m.accuracy ? ` · Acc ${m.accuracy}` : ""}">${escape(name)}</span>`;
  };

  const lu = levelup[String(pid)] || levelup[pid] || [];
  const tms = (tmLearn.learnsets && (tmLearn.learnsets[String(pid)] || tmLearn.learnsets[pid])) || [];

  // Trainers using this pokemon
  const usedByTrainers = [];
  for (const t of trainers) {
    for (const m of t.team) {
      if (m.pokemon && normName(m.pokemon) === normName(p.name)) {
        usedByTrainers.push({ trainer: t, mon: m });
      }
    }
  }
  // Bosses using this pokemon
  const usedByBosses = [];
  for (const b of bosses) {
    for (const m of b.team) {
      if (m.pokemon && normName(m.pokemon) === normName(p.name)) {
        usedByBosses.push({ boss: b, mon: m });
      }
    }
  }
  // Wild encounter areas
  const wildAreas = [];
  for (const area of encounters) {
    for (const e of area.encounters) {
      if (e.pokemon && normName(e.pokemon) === normName(p.name)) {
        wildAreas.push({ area: area.area, pct: e.pct });
        break;
      }
    }
  }

  // Forms with same name (alternate forms)
  const altForms = forms.filter((f) => f.name && normName(f.name) === normName(p.name));

  const stats = p.stats || {};
  const id3 = String(pid).padStart(3, "0");

  root.innerHTML = `
    <a class="back-link" href="#/pokedex">← Back to Pokédex</a>

    <div class="detail-grid">
      <aside class="detail-side">
        <div class="detail-hero">
          <div class="detail-hero__sprite">${spriteImg(pid, p.name)}</div>
          <div class="detail-hero__id">No.${id3}</div>
          <div class="detail-hero__name">${escape(p.name)}</div>
          <div class="detail-hero__types">${typeChips(p.type1, p.type2)}</div>
        </div>

        <div class="frame" style="padding:0.85rem">
          <div class="corners"></div>
          <h3 class="h-eyebrow">Base Stats</h3>
          <div class="stats">
            ${statBar("HP", stats.hp)}
            ${statBar("Atk", stats.atk)}
            ${statBar("Def", stats.def)}
            ${statBar("Sp.A", stats.spa)}
            ${statBar("Sp.D", stats.spd)}
            ${statBar("Spe", stats.spe)}
            ${bstBar(stats.bst)}
          </div>
        </div>

        <div class="frame" style="padding:0.85rem">
          <div class="corners"></div>
          <h3 class="h-eyebrow">Profile</h3>
          <dl class="dl">
            <dt>Ability 1</dt><dd>${escape(p.ability1) || "—"}</dd>
            <dt>Ability 2</dt><dd>${escape(p.ability2) || "—"}</dd>
            <dt>Evolves</dt><dd>${fmt(p.evolve)}</dd>
            <dt>Wild</dt><dd>${escape(fmt(p.wild))}</dd>
            <dt>Special</dt><dd>${escape(fmt(p.special))}</dd>
          </dl>
        </div>
      </aside>

      <div class="detail-main">
        ${altForms.length ? `
        <h3 class="h-section">Alt Forms</h3>
        <div class="cards" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));">
          ${altForms.map((f) => `
            <div class="card" style="cursor:default">
              <div class="card__id">FORM</div>
              <div class="card__name">${escape(f.name)}</div>
              <div class="card__types">${typeChips(f.type1, f.type2)}</div>
              <p style="font-size:.95rem;margin:.4rem 0 0;color:var(--ink-soft);text-align:left;">
                BST ${f.stats?.bst ?? "—"} · ${f.stats?.hp}/${f.stats?.atk}/${f.stats?.def}/${f.stats?.spa}/${f.stats?.spd}/${f.stats?.spe}
              </p>
              ${f.flavor ? `<p style="font-size:.9rem;margin:.4rem 0 0;color:var(--ink-mute);text-align:left;font-style:italic;">"${escape(f.flavor)}"</p>` : ""}
            </div>
          `).join("")}
        </div>
        ` : ""}

        <h3 class="h-section">Level-Up Moves</h3>
        ${lu.length ? `
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Lv</th><th>Move</th><th>Type</th><th>Cat.</th><th class="num">Pow</th><th class="num">Acc</th><th>PP</th></tr></thead>
            <tbody>
              ${lu.map((m) => moveRow(m.move, m.level, moveByName)).join("")}
            </tbody>
          </table>
        </div>
        ` : `<p style="color:var(--ink-mute);font-size:1rem;">No level-up data.</p>`}

        <h3 class="h-section">TM / Move Tutor</h3>
        ${tms.length ? `
        <div class="team__moves" style="font-size:1.05rem">
          ${tms.map((m) => movePill(m)).join("")}
        </div>
        ` : `<p style="color:var(--ink-mute);font-size:1rem;">No TM learnset data.</p>`}

        ${wildAreas.length ? `
        <h3 class="h-section">Found In The Wild</h3>
        <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.4rem;font-size:1.05rem;">
          ${wildAreas.map((a) => `<li class="frame--soft" style="padding:.5rem .7rem;border:2px solid var(--line);">${escape(a.area)} <span style="color:var(--ink-mute);">${a.pct ? `(${a.pct}%)` : ""}</span></li>`).join("")}
        </ul>
        ` : ""}

        ${usedByTrainers.length ? `
        <h3 class="h-section">Used by Trainers (${usedByTrainers.length})</h3>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Area</th><th>Trainer</th><th class="num">Lv</th><th>Item</th><th>Moves</th></tr></thead>
            <tbody>
              ${usedByTrainers.slice(0, 200).map((u) => `
                <tr>
                  <td>${escape(u.trainer.area || "")}</td>
                  <td>${escape(u.trainer.name || "")}</td>
                  <td class="num">${fmt(u.mon.level)}</td>
                  <td>${escape(u.mon.item || "")}</td>
                  <td style="font-size:.95rem;">${(u.mon.moves || []).map((m) => `<span style="margin-right:6px;">${escape(m)}</span>`).join("")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ${usedByTrainers.length > 200 ? `<p style="color:var(--ink-mute);font-size:.95rem;">Showing first 200.</p>` : ""}
        ` : ""}

        ${usedByBosses.length ? `
        <h3 class="h-section">Used by Bosses (${usedByBosses.length})</h3>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Boss</th><th class="num">Lv</th><th>Nature</th><th>Item</th><th>Moves</th></tr></thead>
            <tbody>
              ${usedByBosses.map((u) => `
                <tr>
                  <td>${escape(u.boss.name || "")}</td>
                  <td class="num">${fmt(u.mon.level)}</td>
                  <td>${escape(u.mon.nature || "")}</td>
                  <td>${escape(u.mon.item || "")}</td>
                  <td style="font-size:.95rem;">${(u.mon.moves || []).map((m) => `<span style="margin-right:6px;">${escape(m)}</span>`).join("")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ` : ""}
      </div>
    </div>
  `;
}

function moveRow(name, level, byName) {
  const m = byName.get(normName(name));
  return `
    <tr>
      <td><strong>${level ?? "—"}</strong></td>
      <td>${escape(name)}</td>
      <td>${m && m.type ? `<span class="t-chip ${m.type ? `t-${m.type.toLowerCase()}` : ""}">${escape(m.type)}</span>` : "—"}</td>
      <td>${m && m.category ? `<span class="t-chip ${m.category ? `t-${m.category.toLowerCase()}` : ""}">${escape(m.category)}</span>` : "—"}</td>
      <td class="num">${fmt(m?.power)}</td>
      <td class="num">${fmt(m?.accuracy)}</td>
      <td class="num">${fmt(m?.pp)}</td>
    </tr>`;
}
