import { load } from "../data.js";
import { setTitle, escape, fmt, debounce, empty } from "../ui.js";

export async function render(params, root) {
  setTitle("Battle Items");
  const items = await load("battle_items");

  root.innerHTML = `
    <h1 class="h-title">BATTLE ITEMS</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">${items.length} items</p>

    <div class="toolbar">
      <div class="field">
        <label for="it-search">Search</label>
        <input id="it-search" type="search" placeholder="Item or effect…" autocomplete="off">
      </div>
    </div>

    <div id="it-tbl" class="table-wrap"></div>
  `;

  const search = document.getElementById("it-search");
  const tblEl = document.getElementById("it-tbl");

  function apply() {
    const q = search.value.trim().toLowerCase();
    const result = items.filter((i) => {
      if (!q) return true;
      const blob = `${i.item || ""} ${i.effect || ""} ${i.location || ""}`.toLowerCase();
      return blob.includes(q);
    });
    if (!result.length) { tblEl.innerHTML = empty("No items match."); return; }
    tblEl.innerHTML = `
      <table class="table">
        <thead><tr><th>Item</th><th>Effect</th><th class="num">Value</th><th>First Found</th></tr></thead>
        <tbody>
          ${result.map((i) => `
            <tr>
              <td><strong>${escape(i.item)}</strong></td>
              <td>${escape(i.effect || "")}</td>
              <td class="num">${fmt(i.value)}</td>
              <td>${escape(i.location || "")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
  }
  apply();
  search.addEventListener("input", debounce(apply, 100));
}
