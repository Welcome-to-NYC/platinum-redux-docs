import { load } from "../data.js";
import { setTitle, spriteImg } from "../ui.js";

export async function render(params, root) {
  setTitle("");
  const [pokemon, trainers, bosses, moves, tms] = await Promise.all([
    load("pokemon"),
    load("trainers"),
    load("bosses"),
    load("moves"),
    load("tm_data"),
  ]);

  // Pick 8 starter-ish iconic ids for hero gallery
  const heroIds = [1, 4, 7, 25, 133, 152, 252, 387];
  const heroSprites = heroIds
    .map((id) => `<div class="card__sprite">${spriteImg(id)}</div>`)
    .join("");

  root.innerHTML = `
    <section class="hero">
      <div>
        <h1 class="hero__title">PLATINUM<br>REDUX</h1>
        <p class="hero__sub">v3.3 docs · unofficial fan site</p>
        <p class="hero__lead">A browseable companion to the Platinum Redux romhack — every Pokémon's stats &amp; learnsets, every trainer team, every wild encounter, and every type-chart tweak.</p>
        <p class="hero__notice">⚠ <strong>Not affiliated with the Platinum Redux team.</strong> This is an unofficial fan reference that just renders their public v3.3 docs.</p>
        <div class="hero__ctas">
          <a class="hero__cta" href="#/pokedex">Pokédex →</a>
          <a class="hero__cta hero__cta--ghost" href="#/walkthrough">Walkthrough</a>
          <a class="hero__cta hero__cta--ghost" href="#/types">Type Chart</a>
        </div>
      </div>
      <div class="hero__pixels" aria-hidden="true">${heroSprites}</div>
    </section>

    <h2 class="h-section">Browse</h2>
    <div class="home-grid">
      ${tile("Pokédex", pokemon.length, "Stats, abilities, learnsets", "#/pokedex")}
      ${tile("Moves", moves.length, "All moves with type, power, effect", "#/moves")}
      ${tile("TMs", tms.length, "Where to find each TM", "#/tms")}
      ${tile("Type Chart", 18, "Redux balance changes built in", "#/types")}
      ${tile("Trainers", trainers.length, "Every trainer team in the game", "#/trainers")}
      ${tile("Bosses", bosses.length, "Bosses with IVs / nature / HC", "#/bosses")}
      ${tile("Encounters", "—", "Wild Pokémon by area", "#/encounters")}
      ${tile("Walkthrough", "—", "Sequential area + items", "#/walkthrough")}
      ${tile("Items", "—", "Battle items and their effects", "#/items")}
      ${tile("Credits", "—", "Made by these awesome people", "#/credits")}
    </div>
  `;
}

function tile(name, count, desc, href) {
  return `
    <a class="home-tile" href="${href}">
      <div class="home-tile__name">${name}</div>
      <div class="home-tile__count">${count} entries</div>
      <div class="home-tile__desc">${desc}</div>
    </a>`;
}
