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
      <div class="field" style="flex:0 0 240px;">
        <label for="pdx-sort">Sort by</label>
        <select id="pdx-sort">
          <optgroup label="Default">
            <option value="id:asc">National Dex # (low → high)</option>
            <option value="id:desc">National Dex # (high → low)</option>
            <option value="name:asc">Name (A → Z)</option>
            <option value="name:desc">Name (Z → A)</option>
          </optgroup>
          <optgroup label="Total Stats">
            <option value="bst:desc">Highest BST</option>
            <option value="bst:asc">Lowest BST</option>
          </optgroup>
          <optgroup label="HP">
            <option value="hp:desc">Highest HP</option>
            <option value="hp:asc">Lowest HP</option>
          </optgroup>
          <optgroup label="Attack">
            <option value="atk:desc">Highest Attack</option>
            <option value="atk:asc">Lowest Attack</option>
          </optgroup>
          <optgroup label="Defense">
            <option value="def:desc">Highest Defense</option>
            <option value="def:asc">Lowest Defense</option>
          </optgroup>
          <optgroup label="Sp. Atk">
            <option value="spa:desc">Highest Sp. Atk</option>
            <option value="spa:asc">Lowest Sp. Atk</option>
          </optgroup>
          <optgroup label="Sp. Def">
            <option value="spd:desc">Highest Sp. Def</option>
            <option value="spd:asc">Lowest Sp. Def</option>
          </optgroup>
          <optgroup label="Speed">
            <option value="spe:desc">Highest Speed</option>
            <option value="spe:asc">Lowest Speed</option>
          </optgroup>
        </select>
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
  const resetBtn = document.getElementById("pdx-reset");
  const grid = document.getElementById("pdx-grid");
  const emptyEl = document.getElementById("pdx-empty");
  const countEl = document.getElementById("pdx-count");

  const STAT_KEYS = new Set(["hp", "atk", "def", "spa", "spd", "spe", "bst"]);

  function apply() {
    const q = search.value.trim().toLowerCase();
    const t = typeSel.value;
    const ab = abilitySel.value;
    const mvQuery = moveInp.value.trim();
    const mvNorm = normMove(mvQuery);
    const [sortBy, dir] = (sortSel.value || "id:asc").split(":");

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
    } else if (STAT_KEYS.has(sortBy)) {
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

    const showStat = STAT_KEYS.has(sortBy) ? sortBy : null;
    grid.innerHTML = result.map((p) => card(p, showStat)).join("");
  }

  apply();

  search.addEventListener("input", debounce(apply, 90));
  typeSel.addEventListener("change", apply);
  abilitySel.addEventListener("change", apply);
  moveInp.addEventListener("input", debounce(apply, 90));
  sortSel.addEventListener("change", apply);
  resetBtn.addEventListener("click", () => {
    search.value = "";
    typeSel.value = "";
    abilitySel.value = "";
    moveInp.value = "";
    sortSel.value = "id:asc";
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
