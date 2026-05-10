import { load, loadMany } from "../data.js";
import { setTitle, spriteImg, typeChips, escape, debounce, empty } from "../ui.js";

const TYPES = [
  "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost",
  "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon",
  "Dark", "Fairy",
];

const STAT_LABELS = {
  hp: "HP", atk: "Attack", def: "Defense",
  spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed", bst: "BST",
};

function normMove(s) {
  if (!s) return "";
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function render(params, root) {
  setTitle("Pokédex");
  const [list, levelup, tmData] = await loadMany("pokemon", "levelup", "tm_learn");

  // Collect unique abilities (sorted alphabetically)
  const abilitySet = new Set();
  for (const p of list) {
    if (p.ability1) abilitySet.add(p.ability1);
    if (p.ability2) abilitySet.add(p.ability2);
  }
  const abilities = [...abilitySet].sort((a, b) => a.localeCompare(b));

  // Collect unique moves from level-up + TM, plus build pokemon-id -> set(moves) lookup.
  const moveSet = new Set();
  const learnByPid = new Map(); // local id (string) -> Set<normalized move>
  for (const [pid, lst] of Object.entries(levelup || {})) {
    const set = learnByPid.get(pid) || new Set();
    for (const entry of lst) {
      if (entry?.move) {
        moveSet.add(entry.move);
        set.add(normMove(entry.move));
      }
    }
    learnByPid.set(pid, set);
  }
  const tmLearnsets = (tmData && tmData.learnsets) || {};
  for (const [pid, mvs] of Object.entries(tmLearnsets)) {
    const set = learnByPid.get(pid) || new Set();
    for (const m of mvs) {
      if (m) {
        moveSet.add(m);
        set.add(normMove(m));
      }
    }
    learnByPid.set(pid, set);
  }
  const moves = [...moveSet].sort((a, b) => a.localeCompare(b));

  root.innerHTML = `
    <h1 class="h-title">POKéDEX</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:0.4rem 0 0.5rem;">${list.length} Pokémon · click any entry for full details</p>

    <div class="toolbar">
      <div class="field">
        <label for="pdx-search">Search</label>
        <input id="pdx-search" type="search" placeholder="Name or # …" autocomplete="off">
      </div>
      <div class="field" style="flex:0 0 200px;">
        <label for="pdx-type">Type</label>
        <select id="pdx-type">
          <option value="">All types</option>
          ${TYPES.map((t) => `<option value="${t}">${t}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="flex:0 0 220px;">
        <label for="pdx-ability">Ability</label>
        <select id="pdx-ability">
          <option value="">Any ability</option>
          ${abilities.map((a) => `<option value="${escape(a)}">${escape(a)}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="flex:1 1 240px;">
        <label for="pdx-move">Learns move</label>
        <input id="pdx-move" type="search" placeholder="e.g. Earthquake" autocomplete="off" list="pdx-move-list">
        <datalist id="pdx-move-list">
          ${moves.map((m) => `<option value="${escape(m)}">`).join("")}
        </datalist>
      </div>
      <div class="field" style="flex:0 0 200px;">
        <label for="pdx-sort">Sort by</label>
        <select id="pdx-sort">
          <option value="id">National Dex #</option>
          <option value="name">Name (A-Z)</option>
          <option value="bst">BST</option>
          <option value="hp">HP</option>
          <option value="atk">Attack</option>
          <option value="def">Defense</option>
          <option value="spa">Sp. Atk</option>
          <option value="spd">Sp. Def</option>
          <option value="spe">Speed</option>
        </select>
      </div>
      <div class="field" style="flex:0 0 auto;min-width:0;">
        <label for="pdx-dir">Order</label>
        <button id="pdx-dir" type="button" class="btn pdx-dir" data-dir="desc" title="Toggle high → low / low → high">↓ HIGH</button>
      </div>
      <div class="field" style="flex:0 0 auto;min-width:0;">
        <label>&nbsp;</label>
        <button id="pdx-reset" type="button" class="btn">Reset</button>
      </div>
    </div>

    <p id="pdx-count" style="color:var(--ink-mute);font-size:1rem;margin:.2rem 0 .6rem;"></p>
    <div id="pdx-grid" class="cards"></div>
    <div id="pdx-empty" hidden>${empty("No Pokémon match your filters.")}</div>
  `;

  const search = document.getElementById("pdx-search");
  const typeSel = document.getElementById("pdx-type");
  const abilitySel = document.getElementById("pdx-ability");
  const moveInp = document.getElementById("pdx-move");
  const sortSel = document.getElementById("pdx-sort");
  const dirBtn = document.getElementById("pdx-dir");
  const resetBtn = document.getElementById("pdx-reset");
  const grid = document.getElementById("pdx-grid");
  const emptyEl = document.getElementById("pdx-empty");
  const countEl = document.getElementById("pdx-count");

  function setDirLabel() {
    const dir = dirBtn.dataset.dir;
    const sortBy = sortSel.value;
    if (sortBy === "name") {
      dirBtn.textContent = dir === "asc" ? "↓ A-Z" : "↑ Z-A";
    } else if (sortBy === "id") {
      dirBtn.textContent = dir === "asc" ? "↓ 001+" : "↑ 493-";
    } else {
      dirBtn.textContent = dir === "desc" ? "↓ HIGH" : "↑ LOW";
    }
  }

  function apply() {
    const q = search.value.trim().toLowerCase();
    const t = typeSel.value;
    const ab = abilitySel.value;
    const mvQuery = moveInp.value.trim();
    const mvNorm = normMove(mvQuery);
    const sortBy = sortSel.value;
    const dir = dirBtn.dataset.dir;

    let result = list.filter((p) => {
      if (q) {
        const blob = `${p.id} ${p.name}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (t && p.type1 !== t && p.type2 !== t) return false;
      if (ab && p.ability1 !== ab && p.ability2 !== ab) return false;
      if (mvNorm) {
        const set = learnByPid.get(String(p.id));
        if (!set || !set.has(mvNorm)) return false;
      }
      return true;
    });

    if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      if (dir === "desc") result.reverse();
    } else if (["hp", "atk", "def", "spa", "spd", "spe", "bst"].includes(sortBy)) {
      result.sort((a, b) => {
        const av = a.stats?.[sortBy] || 0;
        const bv = b.stats?.[sortBy] || 0;
        return dir === "asc" ? av - bv : bv - av;
      });
    } else {
      result.sort((a, b) => a.id - b.id);
      if (dir === "desc") result.reverse();
    }

    countEl.textContent = `${result.length} of ${list.length} Pokémon match`;

    if (!result.length) {
      grid.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;

    const showStat = ["hp", "atk", "def", "spa", "spd", "spe", "bst"].includes(sortBy);
    grid.innerHTML = result.map((p) => card(p, showStat ? sortBy : null)).join("");
  }

  setDirLabel();
  apply();

  search.addEventListener("input", debounce(apply, 90));
  typeSel.addEventListener("change", apply);
  abilitySel.addEventListener("change", apply);
  moveInp.addEventListener("input", debounce(apply, 90));
  sortSel.addEventListener("change", () => { setDirLabel(); apply(); });
  dirBtn.addEventListener("click", () => {
    dirBtn.dataset.dir = dirBtn.dataset.dir === "asc" ? "desc" : "asc";
    setDirLabel();
    apply();
  });
  resetBtn.addEventListener("click", () => {
    search.value = "";
    typeSel.value = "";
    abilitySel.value = "";
    moveInp.value = "";
    sortSel.value = "id";
    dirBtn.dataset.dir = "asc";
    setDirLabel();
    apply();
  });
}

function card(p, statKey) {
  const id = String(p.id).padStart(3, "0");
  const statTag = statKey
    ? `<div class="card__stat"><span class="card__stat-label">${escape(STAT_LABELS[statKey] || statKey)}</span><span class="card__stat-num">${p.stats?.[statKey] ?? "—"}</span></div>`
    : "";
  return `
    <a class="card" href="#/pokemon/${p.id}">
      <div class="card__id">No.${id}</div>
      <div class="card__sprite">${spriteImg(p.name)}</div>
      <div class="card__name">${escape(p.name)}</div>
      <div class="card__types">${typeChips(p.type1, p.type2)}</div>
      ${statTag}
    </a>`;
}
