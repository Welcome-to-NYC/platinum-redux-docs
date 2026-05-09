// Lazy data loader. Each dataset is fetched once and cached.

const cache = new Map();
const inflight = new Map();

const BASE = "data/";

export async function load(name) {
  if (cache.has(name)) return cache.get(name);
  if (inflight.has(name)) return inflight.get(name);
  const p = fetch(`${BASE}${name}.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${name}: ${r.status}`);
      return r.json();
    })
    .then((j) => {
      cache.set(name, j);
      inflight.delete(name);
      return j;
    });
  inflight.set(name, p);
  return p;
}

export async function loadMany(...names) {
  return Promise.all(names.map(load));
}

// Build a name -> id map from pokemon list, with normalization for typos.
let _nameMap = null;
export async function getNameMap() {
  if (_nameMap) return _nameMap;
  const list = await load("pokemon");
  const map = new Map();
  for (const p of list) {
    if (!p.name) continue;
    map.set(normName(p.name), p.id);
  }
  // Manual aliases for known typos in source data
  const aliases = {
    NIDORANF: 29,
    NIDORANM: 32,
    HONCHCROW: 430, // Honchkrow
    SANDLASH: 28,   // Sandslash
    GIRATIONA: 487, // Giratina-O
    SLOWPING: 79,   // Slowpoke
  };
  for (const [k, v] of Object.entries(aliases)) {
    map.set(normName(k), v);
  }
  _nameMap = map;
  return map;
}

export function normName(s) {
  if (!s) return "";
  return String(s)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export async function pkmnIdFromName(name) {
  if (!name) return null;
  const m = await getNameMap();
  const id = m.get(normName(name));
  return typeof id === "number" ? id : null;
}

// Sprite URL — Platinum (Gen IV) sprite from PokeAPI for retro feel.
// Falls back to default sprite if Platinum sprite missing.
export function spriteUrl(id) {
  if (!id) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/${id}.png`;
}
export function spriteUrlFallback(id) {
  if (!id) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
