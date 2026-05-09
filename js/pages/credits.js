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
    <h3 class="h-section">About This Site</h3>
    <div class="frame--soft" style="padding:.9rem;border:2px solid var(--accent);background:rgba(255,91,61,.08);">
      <p style="font-size:1.05rem;line-height:1.6;margin:0 0 .5rem;color:var(--ink);">
        <strong style="color:var(--accent-2);">This is an unofficial fan-made reference site.</strong>
        It is <strong>not</strong> made by, endorsed by, or affiliated with the Platinum Redux team or any of the contributors listed above.
      </p>
      <p style="font-size:1rem;line-height:1.6;margin:0;color:var(--ink-soft);">
        All romhack design, balance, sprites, flavor text, and game data is the work of the Redux team. This site simply renders their published v3.3 docs (originally an Excel + Word file) in a more browseable form. If anything looks wrong, the <strong>docs</strong> are the source of truth — please report site bugs to this site's <a href="https://github.com/Welcome-to-NYC/platinum-redux-docs/issues" target="_blank" rel="noopener">GitHub issues</a>, not to the Redux team.
      </p>
    </div>
    <p style="font-size:1.05rem;color:var(--ink-soft);margin-top:1rem;">Sprites by <a href="https://github.com/PokeAPI/sprites" target="_blank" rel="noopener">PokeAPI</a> · evolution-chain shape via <a href="https://pokeapi.co" target="_blank" rel="noopener">pokeapi.co</a> · source: <a href="https://github.com/Welcome-to-NYC/platinum-redux-docs" target="_blank" rel="noopener">Welcome-to-NYC/platinum-redux-docs</a>.</p>
    <p style="font-size:.95rem;color:var(--ink-mute);margin-top:.5rem;">Pokémon, Pokémon character names, and related properties are trademarks of Nintendo / Game Freak / The Pokémon Company.</p>
  `;
}
