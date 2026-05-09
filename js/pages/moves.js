import { load } from "../data.js";
import { setTitle, escape, debounce, typeChip, fmt, empty } from "../ui.js";

const TYPES = [
  "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost",
  "Steel", "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon",
  "Dark", "Fairy",
];
const CATS = ["Physical", "Special", "Status"];

export async function render(params, root) {
  setTitle("Moves");
  const moves = await load("moves");

  root.innerHTML = `
    <h1 class="h-title">MOVES</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${moves.length} moves · sortable · click headers</p>

    <div class="toolbar">
      <div class="field">
        <label for="mv-search">Search</label>
        <input id="mv-search" type="search" placeholder="Move name or effect…" autocomplete="off">
      </div>
      <div class="field" style="flex:0 0 200px;">
        <label for="mv-type">Type</label>
        <select id="mv-type">
          <option value="">All types</option>
          ${TYPES.map((t) => `<option value="${t}">${t}</option>`).join("")}
        </select>
      </div>
      <div class="field" style="flex:0 0 200px;">
        <label for="mv-cat">Category</label>
        <select id="mv-cat">
          <option value="">All</option>
          ${CATS.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
      </div>
    </div>

    <div id="mv-tbl" class="table-wrap"></div>
  `;

  const search = document.getElementById("mv-search");
  const typeSel = document.getElementById("mv-type");
  const catSel = document.getElementById("mv-cat");
  const tbl = document.getElementById("mv-tbl");

  let sortKey = "name";
  let sortDir = 1;

  function apply() {
    const q = search.value.trim().toLowerCase();
    const t = typeSel.value;
    const c = catSel.value;
    let result = moves.filter((m) => {
      if (!m.name) return false;
      if (q) {
        const blob = `${m.name} ${m.effect || ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (t && m.type !== t) return false;
      if (c && m.category !== c) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });

    if (!result.length) { tbl.innerHTML = empty("No moves match."); return; }

    tbl.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            ${th("Name", "name")}
            ${th("Type", "type")}
            ${th("Cat.", "category")}
            ${th("Pow", "power", "num")}
            ${th("Acc", "accuracy", "num")}
            ${th("PP", "pp", "num")}
            ${th("Pri", "priority", "num")}
            <th>Effect</th>
          </tr>
        </thead>
        <tbody>
          ${result.map((m) => `
            <tr>
              <td><strong>${escape(m.name)}</strong></td>
              <td>${m.type ? typeChip(m.type) : "—"}</td>
              <td>${m.category ? typeChip(m.category) : "—"}</td>
              <td class="num">${fmt(m.power)}</td>
              <td class="num">${fmt(m.accuracy)}</td>
              <td class="num">${fmt(m.pp)}</td>
              <td class="num">${fmt(m.priority)}</td>
              <td style="font-size:1rem;">${escape(m.effect || "")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;

    tbl.querySelectorAll("th[data-sort]").forEach((el) => {
      el.addEventListener("click", () => {
        const k = el.dataset.sort;
        if (sortKey === k) sortDir *= -1;
        else { sortKey = k; sortDir = 1; }
        apply();
      });
    });
  }

  function th(label, key, cls = "") {
    const arrow = sortKey === key ? (sortDir > 0 ? " ▲" : " ▼") : "";
    return `<th data-sort="${key}" class="${cls}" style="cursor:pointer;">${label}${arrow}</th>`;
  }

  apply();
  search.addEventListener("input", debounce(apply, 90));
  typeSel.addEventListener("change", apply);
  catSel.addEventListener("change", apply);
}
