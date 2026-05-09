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

// Build a name -> ROMHACK LOCAL id map from pokemon list, with normalization for typos.
let _localMap = null;
export async function getLocalIdMap() {
  if (_localMap) return _localMap;
  const list = await load("pokemon");
  const map = new Map();
  for (const p of list) {
    if (!p.name) continue;
    map.set(normName(p.name), p.id);
  }
  _localMap = map;
  return map;
}

// Build name -> CANONICAL (national-dex / PokeAPI) id map.
// Loaded from data/canonical_ids.json which is generated at build time.
let _canonMap = null;
async function getCanonicalMap() {
  if (_canonMap) return _canonMap;
  try {
    const data = await load("canonical_ids");
    _canonMap = new Map(Object.entries(data));
  } catch {
    _canonMap = new Map();
  }
  return _canonMap;
}

// Synchronous accessor for after preload.
export function getCanonicalMapSync() {
  return _canonMap;
}

export function normName(s) {
  if (!s) return "";
  return String(s)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normForCanon(s) {
  if (!s) return "";
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Get the romhack's local dex ID from a Pokemon name (used for navigation links).
export async function pkmnIdFromName(name) {
  if (!name) return null;
  const m = await getLocalIdMap();
  const id = m.get(normName(name));
  return typeof id === "number" ? id : null;
}

// Get the canonical national-dex / PokeAPI ID from a name. This is what we
// use for sprite URLs and evolution-chain lookups, since the romhack has
// reshuffled some local dex slots (e.g. local #172 = Larvesta, but PokeAPI
// #172 = Pichu).
export async function canonicalIdFromName(name) {
  if (!name) return null;
  const m = await getCanonicalMap();
  // Try exact normalized name first
  const id = m.get(normForCanon(name));
  if (typeof id === "number") return id;
  // Common typo aliases (handled here too in case canonical_ids.json missed them)
  const aliases = {
    nidoranf: 29, nidoranm: 32, honchcrow: 430, sandlash: 28,
    girationa: 487, slowping: 79, hooh: 250,
  };
  const k = normForCanon(name);
  return aliases[k] ?? null;
}

// Synchronous canonical-id lookup using a pre-resolved map. Pages that already
// have access to the map can use this for inline rendering.
export function canonicalIdSync(name, canonMap) {
  if (!name || !canonMap) return null;
  const k = normForCanon(name);
  if (canonMap.has(k)) return canonMap.get(k);
  const aliases = {
    nidoranf: 29, nidoranm: 32, honchcrow: 430, sandlash: 28,
    girationa: 487, slowping: 79, hooh: 250,
  };
  return aliases[k] ?? null;
}

export async function ensureCanonicalMap() {
  return getCanonicalMap();
}

// Sprite URL — Platinum (Gen IV) sprite from PokeAPI for retro feel.
// Falls back to default sprite if Platinum sprite missing.
// `id` here MUST be a canonical PokeAPI id, not the romhack's local id.
export function spriteUrl(id) {
  if (!id) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/${id}.png`;
}
export function spriteUrlFallback(id) {
  if (!id) return null;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
