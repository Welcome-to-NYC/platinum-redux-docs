import { load } from "../data.js";
import { setTitle, spriteImg, typeChips, escape, debounce, empty } from "../ui.js";

const TYPES = [
  "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost",
  "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon",
  "Dark", "Fairy",
];

export async function render(params, root) {
  setTitle("Pokédex");
  const list = await load("pokemon");

  root.innerHTML = `
    <h1 class="h-title">POKéDEX</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:0.4rem 0 0.5rem;">${list.length} Pokémon · click any entry for full details</p>

    <div class="toolbar">
      <div class="field">
        <label for="pdx-search">Search</label>
        <input id="pdx-search" type="search" placeholder="Name or # …" autocomplete="off">
      </div>
      <div class="field" style="flex:0 0 220px;">
        <label for="pdx-type">Type</label>
        <select id="pdx-type">
          <option value="">All types</option>
          ${TYPES.map((t) => `<option value="${t}">${t}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="flex:0 0 200px;">
        <label for="pdx-sort">Sort by</label>
        <select id="pdx-sort">
          <option value="id">National Dex #</option>
          <option value="name">Name (A-Z)</option>
          <option value="bst">BST (high → low)</option>
          <option value="hp">HP</option>
          <option value="atk">Attack</option>
          <option value="def">Defense</option>
          <option value="spa">Sp. Atk</option>
          <option value="spd">Sp. Def</option>
          <option value="spe">Speed</option>
        </select>
      </div>
    </div>

    <div id="pdx-grid" class="cards"></div>
    <div id="pdx-empty" hidden>${empty("No Pokémon match your filters.")}</div>
  `;

  const search = document.getElementById("pdx-search");
  const typeSel = document.getElementById("pdx-type");
  const sortSel = document.getElementById("pdx-sort");
  const grid = document.getElementById("pdx-grid");
  const emptyEl = document.getElementById("pdx-empty");

  function apply() {
    const q = search.value.trim().toLowerCase();
    const t = typeSel.value;
    const sortBy = sortSel.value;
    let result = list.filter((p) => {
      if (q) {
        const blob = `${p.id} ${p.name}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (t && p.type1 !== t && p.type2 !== t) return false;
      return true;
    });
    if (sortBy === "name") {
      result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "bst") {
      result = [...result].sort((a, b) => (b.stats?.bst || 0) - (a.stats?.bst || 0));
    } else if (["hp", "atk", "def", "spa", "spd", "spe"].includes(sortBy)) {
      result = [...result].sort((a, b) => (b.stats?.[sortBy] || 0) - (a.stats?.[sortBy] || 0));
    } else {
      result = [...result].sort((a, b) => a.id - b.id);
    }
    if (!result.length) {
      grid.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    grid.innerHTML = result.map(card).join("");
  }
  apply();

  search.addEventListener("input", debounce(apply, 90));
  typeSel.addEventListener("change", apply);
  sortSel.addEventListener("change", apply);
}

function card(p) {
  const id = String(p.id).padStart(3, "0");
  return `
    <a class="card" href="#/pokemon/${p.id}">
      <div class="card__id">No.${id}</div>
      <div class="card__sprite">${spriteImg(p.id, p.name)}</div>
      <div class="card__name">${escape(p.name)}</div>
      <div class="card__types">${typeChips(p.type1, p.type2)}</div>
    </a>`;
}
