import { route, start } from "./router.js";
import { ensureCanonicalMap } from "./data.js";

import * as home from "./pages/home.js";
import * as pokedex from "./pages/pokedex.js";
import * as pokemonDetail from "./pages/pokemon-detail.js";
import * as moves from "./pages/moves.js";
import * as tms from "./pages/tms.js";
import * as types from "./pages/types.js";
import * as trainers from "./pages/trainers.js";
import * as bosses from "./pages/bosses.js";
import * as encounters from "./pages/encounters.js";
import * as walkthrough from "./pages/walkthrough.js";
import * as items from "./pages/items.js";
import * as credits from "./pages/credits.js";
import * as parties from "./pages/parties.js";
import * as builder from "./pages/builder.js";

route("/", home.render);
route("/pokedex", pokedex.render);
route("/pokemon/:id", pokemonDetail.render);
route("/moves", moves.render);
route("/tms", tms.render);
route("/types", types.render);
route("/trainers", trainers.render);
route("/bosses", bosses.render);
route("/encounters", encounters.render);
route("/walkthrough", walkthrough.render);
route("/items", items.render);
route("/parties", parties.render);
route("/parties/:id", parties.render);
route("/builder", builder.render);
route("/credits", credits.render);

// Mobile menu toggle
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-navtoggle]");
  if (t) {
    const r = document.querySelector(".ribbon");
    if (r) r.classList.toggle("is-open");
  }
});

// Preload the canonical name → PokeAPI id map so all subsequent sprite
// renders can resolve synchronously.
ensureCanonicalMap().finally(start);
