import { load } from "../data.js";
import { setTitle, escape } from "../ui.js";

export async function render(params, root) {
  setTitle("Credits");
  const lines = await load("credits");
  root.innerHTML = `
    <h1 class="h-title">CREDITS</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">From the Platinum Redux v3.3 docs · the team behind the romhack</p>
    <div class="frame" style="padding:1rem;line-height:1.6;font-size:1.1rem;">
      <div class="corners"></div>
      ${lines.map((l) => `<p style="margin:.25rem 0;">${escape(l)}</p>`).join("")}
    </div>
    <h3 class="h-section">This Site</h3>
    <p style="font-size:1.05rem;color:var(--ink-soft);">Static documentation site · sprites by <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noopener">PokeAPI</a> · source: <a href="https://github.com/Welcome-to-NYC/platinum-redux-docs" target="_blank" rel="noopener">Welcome-to-NYC/platinum-redux-docs</a>.</p>
  `;
}
