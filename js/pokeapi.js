// Thin PokeAPI client for evolution chains.
// Cached in memory + sessionStorage so repeated navigation is instant.

const MEM = new Map();

function ssGet(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function ssSet(key, val) {
  try { sessionStorage.setItem(key, val); } catch {}
}

async function fetchJson(url) {
  if (MEM.has(url)) return MEM.get(url);
  const cached = ssGet(url);
  if (cached) {
    try {
      const j = JSON.parse(cached);
      MEM.set(url, j);
      return j;
    } catch {}
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI ${url} -> ${res.status}`);
  const j = await res.json();
  MEM.set(url, j);
  ssSet(url, JSON.stringify(j));
  return j;
}

function idFromUrl(url) {
  if (!url) return null;
  const m = String(url).match(/\/(\d+)\/?$/);
  return m ? parseInt(m[1], 10) : null;
}

// Returns an array of stages, where each stage is an array of {id, name, conditions}.
// E.g. [[{id:1,name:'bulbasaur'}], [{id:2,name:'ivysaur'}], [{id:3,name:'venusaur'}]]
// Accepts either a species name (preferred) or a canonical species id.
export async function evolutionChain(nameOrId) {
  if (!nameOrId) return [];
  const slug = typeof nameOrId === "string"
    ? nameOrId.toLowerCase().replace(/[^a-z0-9-]/g, "")
    : String(nameOrId);
  try {
    const species = await fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${slug}/`);
    const chainUrl = species?.evolution_chain?.url;
    if (!chainUrl) return [];
    const chain = await fetchJson(chainUrl);
    return flattenChain(chain.chain);
  } catch (e) {
    console.warn("evolutionChain failed for", nameOrId, e);
    return [];
  }
}

function flattenChain(node, stages = [], depth = 0, parent = null) {
  if (!node) return stages;
  const id = idFromUrl(node.species?.url);
  const name = node.species?.name;
  const apiCond = describeEvolution(node.evolution_details);
  stages[depth] = stages[depth] || [];
  stages[depth].push({ id, name, apiCond, parentId: parent?.id, parentName: parent?.name });
  for (const next of node.evolves_to || []) {
    flattenChain(next, stages, depth + 1, { id, name });
  }
  return stages;
}

function describeEvolution(details) {
  if (!details || !details.length) return "";
  const d = details[0];
  const parts = [];
  if (d.min_level) parts.push(`Lv ${d.min_level}`);
  if (d.item?.name) parts.push(item(d.item.name));
  if (d.held_item?.name) parts.push(`hold ${item(d.held_item.name)}`);
  if (d.trigger?.name === "trade") parts.push("trade");
  if (d.known_move?.name) parts.push(`know ${item(d.known_move.name)}`);
  if (d.known_move_type?.name) parts.push(`${item(d.known_move_type.name)} move`);
  if (d.min_happiness) parts.push("happy");
  if (d.min_affection) parts.push("affection");
  if (d.time_of_day) parts.push(`(${d.time_of_day})`);
  if (d.location?.name) parts.push(`@ ${item(d.location.name)}`);
  if (d.gender === 1) parts.push("♀");
  if (d.gender === 2) parts.push("♂");
  if (d.needs_overworld_rain) parts.push("rain");
  return parts.join(" · ");
}

function item(slug) {
  return String(slug).replace(/-/g, " ");
}
