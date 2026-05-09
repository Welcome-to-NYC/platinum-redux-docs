import { load } from "../data.js";
import { setTitle, escape, fmt, debounce, empty, typeChip } from "../ui.js";

export async function render(params, root) {
  setTitle("TMs");
  const [tmLearn, moves] = await Promise.all([load("tm_learn"), load("moves")]);
  const tms = tmLearn.tms || [];

  // Move lookup for power/acc info
  const moveByName = new Map();
  for (const m of moves) if (m && m.name) moveByName.set(m.name.toLowerCase(), m);

  root.innerHTML = `
    <h1 class="h-title">TMs</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${tms.length} TMs · ${tms.length} unique moves available as TMs</p>
    <div class="frame--soft" style="padding:.55rem .75rem;margin:.4rem 0 .8rem;font-size:1rem;color:var(--ink-soft);border:2px solid var(--line);">
      <strong style="color:var(--accent-2);">How to read this:</strong>
      "Found Once" is the area where you can pick up a single copy as you progress
      through the game. "Buy Unlimited" is where the TM becomes available in a shop
      so you can buy as many as you want.
    </div>

    <div class="toolbar">
      <div class="field">
        <label for="tm-search">Search</label>
        <input id="tm-search" type="search" placeholder="TM, move, or location…" autocomplete="off">
      </div>
    </div>

    <div id="tm-tbl" class="table-wrap"></div>
  `;

  const search = document.getElementById("tm-search");
  const tblEl = document.getElementById("tm-tbl");

  function apply() {
    const q = search.value.trim().toLowerCase();
    const result = tms.filter((t) => {
      if (!q) return true;
      const blob = `${t.tm || ""} ${t.move || ""} ${t.type || ""} ${t.location || ""} ${t.infinite || ""}`.toLowerCase();
      return blob.includes(q);
    });
    if (!result.length) { tblEl.innerHTML = empty("No TMs match."); return; }
    tblEl.innerHTML = `
      <table class="table">
        <thead><tr><th>#</th><th>Move</th><th>Type</th><th class="num">Pow</th><th class="num">Acc</th><th>Found Once</th><th>Buy Unlimited</th></tr></thead>
        <tbody>
          ${result.map((t) => {
            const m = t.move ? moveByName.get(t.move.toLowerCase()) : null;
            return `
              <tr>
                <td><strong>${escape(t.tm || "")}</strong></td>
                <td>${escape(t.move || "")}</td>
                <td>${t.type ? typeChip(t.type) : "—"}</td>
                <td class="num">${fmt(m?.power)}</td>
                <td class="num">${fmt(m?.accuracy)}</td>
                <td>${escape(t.location || "")}</td>
                <td style="color:var(--ink-mute);">${escape(t.infinite || "")}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>`;
  }
  apply();
  search.addEventListener("input", debounce(apply, 100));
}
