// Type-effectiveness calculations for the team builder.
// Supports both vanilla Gen 6 chart and the romhack's Redux modified chart.

export const TYPES = [
  "Normal","Fighting","Flying","Poison","Ground","Rock","Bug","Ghost","Steel",
  "Fire","Water","Grass","Electric","Psychic","Ice","Dragon","Dark","Fairy",
];

// Vanilla Gen 6 type chart — only non-1× entries listed (sparse).
const GEN6_RAW = {
  Normal:   {Rock:0.5, Ghost:0, Steel:0.5},
  Fighting: {Normal:2, Flying:0.5, Poison:0.5, Rock:2, Bug:0.5, Ghost:0, Steel:2, Psychic:0.5, Ice:2, Dark:2, Fairy:0.5},
  Flying:   {Fighting:2, Rock:0.5, Bug:2, Steel:0.5, Grass:2, Electric:0.5},
  Poison:   {Poison:0.5, Ground:0.5, Rock:0.5, Ghost:0.5, Steel:0, Grass:2, Fairy:2},
  Ground:   {Flying:0, Poison:2, Rock:2, Bug:0.5, Steel:2, Fire:2, Grass:0.5, Electric:2},
  Rock:     {Fighting:0.5, Ground:0.5, Steel:0.5, Fire:2, Bug:2, Flying:2, Ice:2},
  Bug:      {Fighting:0.5, Flying:0.5, Poison:0.5, Ghost:0.5, Steel:0.5, Fire:0.5, Grass:2, Psychic:2, Dark:2, Fairy:0.5},
  Ghost:    {Normal:0, Ghost:2, Psychic:2, Dark:0.5},
  Steel:    {Rock:2, Steel:0.5, Fire:0.5, Water:0.5, Electric:0.5, Ice:2, Fairy:2},
  Fire:     {Rock:0.5, Bug:2, Steel:2, Fire:0.5, Water:0.5, Grass:2, Ice:2, Dragon:0.5},
  Water:    {Ground:2, Rock:2, Fire:2, Water:0.5, Grass:0.5, Dragon:0.5},
  Grass:    {Flying:0.5, Poison:0.5, Ground:2, Rock:2, Bug:0.5, Steel:0.5, Fire:0.5, Water:2, Grass:0.5, Dragon:0.5},
  Electric: {Flying:2, Ground:0, Water:2, Grass:0.5, Electric:0.5, Dragon:0.5},
  Psychic:  {Fighting:2, Poison:2, Steel:0.5, Psychic:0.5, Dark:0},
  Ice:      {Flying:2, Ground:2, Steel:0.5, Fire:0.5, Water:0.5, Grass:2, Ice:0.5, Dragon:2},
  Dragon:   {Steel:0.5, Dragon:2, Fairy:0},
  Dark:     {Fighting:0.5, Ghost:2, Psychic:2, Dark:0.5, Fairy:0.5},
  Fairy:    {Fighting:2, Poison:0.5, Steel:0.5, Fire:0.5, Dragon:2, Dark:2},
};

// Redux modifications relative to Gen 6 — applied on top to derive the Redux chart.
// Source: data/type_changes.json (entries where the modifier actually differs from vanilla).
const REDUX_DELTAS = [
  ["Psychic","Steel",1],   ["Grass","Steel",1],   ["Bug","Ghost",1],
  ["Dragon","Ice",0.5],    ["Dragon","Normal",2], ["Poison","Dragon",2],
  ["Normal","Dark",2],     ["Dark","Normal",0.5],
  ["Ghost","Ghost",1],     ["Ghost","Fighting",2],
  ["Psychic","Ghost",2],
  ["Flying","Grass",1],    ["Ground","Rock",1],
];

let _cache = {};
export function buildChart(mode = "redux") {
  if (_cache[mode]) return _cache[mode];
  const chart = {};
  for (const atk of TYPES) {
    chart[atk] = {};
    for (const def of TYPES) {
      const v = GEN6_RAW[atk] && GEN6_RAW[atk][def];
      chart[atk][def] = v == null ? 1 : v;
    }
  }
  if (mode === "redux") {
    for (const [a, d, v] of REDUX_DELTAS) chart[a][d] = v;
  }
  _cache[mode] = chart;
  return chart;
}

// Normalize a type string from data (e.g. "GRASS" or "Grass" or "fire") to canonical case.
function normType(t) {
  if (!t) return null;
  const s = String(t).trim();
  if (!s || s === "-" || s.toLowerCase() === "none") return null;
  const lower = s.toLowerCase();
  for (const T of TYPES) {
    if (T.toLowerCase() === lower) return T;
  }
  return null;
}

export function effectiveness(atkType, defT1, defT2, chart) {
  const a = normType(atkType);
  const t1 = normType(defT1);
  const t2 = normType(defT2);
  if (!a || !t1) return 1;
  const m1 = chart[a]?.[t1] ?? 1;
  const m2 = t2 ? (chart[a]?.[t2] ?? 1) : 1;
  return m1 * m2;
}

// For one mon: 18 multipliers (how it takes incoming attacks).
export function defenseProfile(t1, t2, chart) {
  const out = {};
  for (const atk of TYPES) out[atk] = effectiveness(atk, t1, t2, chart);
  return out;
}

// For one mon: 18 multipliers (best STAB hit per defending type — no item moves, just STAB).
export function offenseProfile(t1, t2, chart) {
  const out = {};
  const types = [normType(t1), normType(t2)].filter(Boolean);
  for (const def of TYPES) {
    let best = 1;
    if (types.length === 0) { out[def] = 1; continue; }
    best = 0;
    for (const t of types) {
      const m = chart[t]?.[def] ?? 1;
      if (m > best) best = m;
    }
    out[def] = best;
  }
  return out;
}

// For a team: per attacking type, return the array of multipliers (one per mon).
export function teamDefense(team, chart) {
  const out = {};
  for (const atk of TYPES) {
    out[atk] = team.map((m) => effectiveness(atk, m.type1, m.type2, chart));
  }
  return out;
}

// For a team: per defending type, return the team's best STAB multiplier.
export function teamOffense(team, chart) {
  const out = {};
  for (const def of TYPES) {
    let best = 0;
    for (const m of team) {
      const o = offenseProfile(m.type1, m.type2, chart);
      if (o[def] > best) best = o[def];
    }
    out[def] = best;
  }
  return out;
}

// Summary: which attack types is the team unprepared for?
export function teamSummary(team, chart) {
  const def = teamDefense(team, chart);
  const off = teamOffense(team, chart);
  const hardWeak = []; // type team is weak to AND has no resist
  const softWeak = []; // type team is weak to but has at least one resist
  const offGaps = [];  // type the team can't hit 2x
  for (const atk of TYPES) {
    const mults = def[atk];
    const hasResist = mults.some((m) => m < 1);
    const hasWeak = mults.some((m) => m > 1);
    if (hasWeak && !hasResist) hardWeak.push(atk);
    else if (hasWeak) softWeak.push(atk);
  }
  for (const d of TYPES) {
    if (off[d] < 2) offGaps.push(d);
  }
  return { def, off, hardWeak, softWeak, offGaps };
}

// Score how much a candidate mon would improve the current team.
export function scoreCandidate(team, candidate, chart) {
  if (!candidate || !candidate.type1) return 0;
  const summary = teamSummary(team, chart);
  let s = 0;

  // Defense: cover hard-weak types
  for (const atk of summary.hardWeak) {
    const m = effectiveness(atk, candidate.type1, candidate.type2, chart);
    if (m === 0) s += 7;
    else if (m < 1) s += 5;
    else if (m > 1) s -= 1; // adding another weakness to a hardweak type is bad
  }
  // Smaller bonus for soft-weak types (candidate also resists)
  for (const atk of summary.softWeak) {
    const m = effectiveness(atk, candidate.type1, candidate.type2, chart);
    if (m === 0) s += 2;
    else if (m < 1) s += 1;
  }

  // Offense: hit gaps 2x
  for (const def of summary.offGaps) {
    const o = offenseProfile(candidate.type1, candidate.type2, chart);
    if (o[def] >= 2) s += 3;
  }

  // Redundancy penalty: same dual typing
  for (const m of team) {
    if (m.type1 === candidate.type1 && m.type2 === candidate.type2) s -= 6;
    else if (m.type1 === candidate.type1) s -= 1;
  }

  // BST tiebreaker (small)
  const bst = (candidate.stats && candidate.stats.bst) || 0;
  s += bst / 1000;

  return s;
}
