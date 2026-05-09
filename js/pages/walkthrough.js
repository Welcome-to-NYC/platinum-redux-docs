import { load } from "../data.js";
import { setTitle, escape, debounce, empty } from "../ui.js";

export async function render(params, root) {
  setTitle("Walkthrough");
  const wt = await load("walkthrough");

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
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${groups.length} areas · sequential progression</p>

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
        <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.3rem;font-size:1.05rem;">
          ${g.items.map((it) => `
            <li style="background:var(--bg-2);border:2px solid var(--line);padding:.4rem .55rem;">
              <span>${escape(it.item || "")}</span>
              ${it.restriction ? `<div style="font-size:.95rem;color:var(--ink-mute);margin-top:2px;">⚠ ${escape(it.restriction)}</div>` : ""}
            </li>
          `).join("")}
        </ul>
      </section>
    `).join("");
  }

  apply();
  search.addEventListener("input", debounce(apply, 100));
}
