// Team builder — pick up to 6 mons, see offensive/defensive coverage,
// get auto-suggestions for empty slots based on a coverage score.

import { load, normName, pkmnIdFromName } from "../data.js";
import { setTitle, escape, spriteImg, typeChips, typeChip, debounce } from "../ui.js";
import {
  TYPES, buildChart, effectiveness, teamSummary, scoreCandidate,
} from "../typecalc.js";

const STORAGE_TEAM = "platinum-redux-builder-team";
const STORAGE_CHART = "platinum-redux-builder-chart";

function loadTeamPref() {
  try { return JSON.parse(localStorage.getItem(STORAGE_TEAM)) || []; }
  catch { return []; }
}
function saveTeamPref(names) {
  try { localStorage.setItem(STORAGE_TEAM, JSON.stringify(names)); } catch {}
}
function loadChartPref() {
  try {
    const v = localStorage.getItem(STORAGE_CHART);
    return v === "gen6" ? "gen6" : "redux";
  } catch { return "redux"; }
}
function saveChartPref(v) {
  try { localStorage.setItem(STORAGE_CHART, v); } catch {}
}

function multClass(v) {
  if (v === 0) return "mx-0";
  if (v <= 0.25) return "mx-q";
  if (v <= 0.5) return "mx-h";
  if (v >= 4) return "mx-4";
  if (v >= 2) return "mx-2";
  return "mx-1";
}
function multLabel(v) {
  if (v === 0) return "0";
  if (v === 0.25) return "¼";
  if (v === 0.5) return "½";
  if (v === 1) return "1";
  if (v === 2) return "2";
  if (v === 4) return "4";
  return String(v);
}

export async function render(params, root) {
  setTitle("Team Builder");
  const pokemon = await load("pokemon");

  // Filter pool: final-stage evos (evolve === 'n') for suggestions.
  // For the picker, we let users choose any species (some prefer pre-evos for run order).
  const finalStages = pokemon.filter((p) => {
    const e = p.evolve;
    return e === "n" || e === null || e === undefined || (typeof e === "string" && e.toLowerCase() !== "");
  });
  // Helper: find a pokemon entry by name (case-insensitive, normalized).
  function findMon(name) {
    if (!name) return null;
    const n = normName(name);
    return pokemon.find((p) => normName(p.name) === n) || null;
  }

  // State
  let team = loadTeamPref()
    .map(findMon)
    .filter(Boolean);
  if (team.length > 6) team = team.slice(0, 6);
  let chartMode = loadChartPref();
  let pickerOpenSlot = null;
  let pickerQuery = "";
  let pickerTypes = new Set(); // selected type filters (lowercase)

  function persist() { saveTeamPref(team.map((m) => m.name)); }

  function setMonAt(slot, mon) {
    if (mon == null) {
      team.splice(slot, 1);
    } else if (slot >= team.length) {
      team.push(mon);
    } else {
      team[slot] = mon;
    }
    if (team.length > 6) team = team.slice(0, 6);
    persist();
    paint();
  }

  function setChart(mode) {
    if (mode === chartMode) return;
    chartMode = mode;
    saveChartPref(mode);
    paint();
  }

  function clearTeam() {
    team = [];
    persist();
    paint();
  }

  function openPicker(slot) {
    pickerOpenSlot = slot;
    pickerQuery = "";
    pickerTypes = new Set();
    paint();
  }
  function closePicker() {
    pickerOpenSlot = null;
    paint();
  }
  function togglePickerType(t) {
    const k = (t || "").toLowerCase();
    if (pickerTypes.has(k)) pickerTypes.delete(k);
    else pickerTypes.add(k);
    paint();
  }

  function paint() {
    const chart = buildChart(chartMode);
    const summary = teamSummary(team, chart);

    // Slot grid
    const slots = [];
    for (let i = 0; i < 6; i++) {
      const m = team[i];
      if (m) {
        slots.push(`
          <div class="bld-slot bld-slot--filled">
            <div class="bld-slot__sprite">${spriteImg(m.name, m.name)}</div>
            <div class="bld-slot__name">${escape(m.name)}</div>
            <div class="bld-slot__types">${typeChips(m.type1, m.type2)}</div>
            <button class="bld-slot__remove" data-action="remove" data-slot="${i}" aria-label="Remove">×</button>
          </div>`);
      } else {
        slots.push(`
          <button class="bld-slot bld-slot--empty" data-action="open-picker" data-slot="${i}">
            <div class="bld-slot__plus">+</div>
            <div class="bld-slot__hint">Add mon</div>
          </button>`);
      }
    }

    // Defensive grid: per attacking type, count of weak/resist members
    const defCells = TYPES.map((atk) => {
      const mults = summary.def[atk] || [];
      const weakCount = mults.filter((m) => m > 1).length;
      const resistCount = mults.filter((m) => m > 0 && m < 1).length;
      const immuneCount = mults.filter((m) => m === 0).length;
      const totalResist = resistCount + immuneCount;
      let cls = "bld-cell";
      if (mults.length) {
        if (weakCount > totalResist) cls += " bld-cell--weak";
        else if (totalResist > weakCount) cls += " bld-cell--resist";
        else if (weakCount > 0) cls += " bld-cell--mixed";
      }
      const isHardWeak = summary.hardWeak.includes(atk);
      if (isHardWeak) cls += " bld-cell--hard";
      const counts = mults.length
        ? `${weakCount}W ${totalResist}R`
        : "—";
      return `
        <div class="${cls}" title="${escape(atk)} attacks · ${weakCount} weak · ${totalResist} resist/immune">
          ${typeChip(atk)}
          <div class="bld-cell__num">${counts}</div>
        </div>`;
    }).join("");

    // Offensive grid: best STAB multiplier per defending type
    const offCells = TYPES.map((def) => {
      const v = summary.off[def] || 0;
      let cls = "bld-cell";
      if (team.length) {
        if (v >= 2) cls += " bld-cell--great";
        else if (v === 0) cls += " bld-cell--null";
        else if (v < 1) cls += " bld-cell--meh";
      }
      return `
        <div class="${cls}" title="${escape(def)} defenders take ${multLabel(v)}× from team's best STAB">
          ${typeChip(def)}
          <div class="bld-cell__num">${team.length ? multLabel(v) + "×" : "—"}</div>
        </div>`;
    }).join("");

    // Picker dialog (renders inline below slots when open)
    let pickerHtml = "";
    if (pickerOpenSlot !== null) {
      const q = pickerQuery.trim().toLowerCase();
      const taken = new Set(team
        .map((t, i) => (i !== pickerOpenSlot && t) ? normName(t.name) : null)
        .filter(Boolean));
      const list = pokemon.filter((p) => {
        if (!p.name) return false;
        if (taken.has(normName(p.name))) return false;
        if (q && !p.name.toLowerCase().includes(q)) return false;
        if (pickerTypes.size) {
          const t1 = (p.type1 || "").toLowerCase();
          const t2 = (p.type2 || "").toLowerCase();
          for (const t of pickerTypes) {
            if (t !== t1 && t !== t2) return false;
          }
        }
        return true;
      });
      const items = list.map((p) => `
        <button class="bld-pick-item" data-action="pick" data-name="${escape(p.name)}">
          <div class="bld-pick-item__sprite">${spriteImg(p.name, p.name)}</div>
          <div class="bld-pick-item__body">
            <div class="bld-pick-item__name">${escape(p.name)}</div>
            <div class="bld-pick-item__types">${typeChips(p.type1, p.type2)}</div>
          </div>
        </button>`).join("");
      const typeFilters = TYPES.map((t) => {
        const k = t.toLowerCase();
        const active = pickerTypes.has(k);
        return `<button class="bld-tfilter ${active ? "is-active" : ""} t-${k}" data-action="toggle-type" data-type="${k}">${escape(t)}</button>`;
      }).join("");
      pickerHtml = `
        <div class="bld-picker">
          <div class="bld-picker__head">
            <strong>Slot ${pickerOpenSlot + 1}</strong>
            <input type="search" id="bld-pick-q" placeholder="Search Pokémon…" value="${escape(pickerQuery)}" autocomplete="off" autofocus>
            <button class="bld-picker__close" data-action="close-picker">close</button>
          </div>
          <div class="bld-picker__filters">
            <span class="bld-picker__filterLabel">Filter by type${pickerTypes.size > 1 ? " (must match all)" : ""}:</span>
            ${typeFilters}
          </div>
          <div class="bld-picker__count">${list.length} ${list.length === 1 ? "result" : "results"}</div>
          <div class="bld-picker__list">
            ${items.length ? items : `<div class="empty">— No matches —</div>`}
          </div>
        </div>`;
    }

    // Suggestions: only if team has 1+ members and < 6 slots filled
    let suggestionsHtml = "";
    if (team.length > 0 && team.length < 6) {
      const teamNames = new Set(team.map((m) => normName(m.name)));
      const candidates = finalStages
        .filter((p) => p.type1 && !teamNames.has(normName(p.name)))
        .map((p) => ({ mon: p, score: scoreCandidate(team, p, chart) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      const cards = candidates.map(({ mon, score }) => `
        <button class="bld-sug" data-action="add-suggestion" data-name="${escape(mon.name)}" title="Score: ${score.toFixed(1)}">
          <div class="bld-sug__sprite">${spriteImg(mon.name, mon.name)}</div>
          <div class="bld-sug__body">
            <div class="bld-sug__name">${escape(mon.name)}</div>
            <div class="bld-sug__types">${typeChips(mon.type1, mon.type2)}</div>
            <div class="bld-sug__score">+${score.toFixed(1)} fit</div>
          </div>
        </button>`).join("");
      suggestionsHtml = `
        <h2 class="h-section">Suggested Fillers</h2>
        <p style="font-size:1rem;color:var(--ink-mute);margin:.3rem 0 .6rem;">
          Top final-stage picks ranked by how well they cover this team's <strong>weaknesses</strong> + <strong>offensive gaps</strong>. Click to add to next empty slot.
        </p>
        <div class="bld-sug-grid">${cards}</div>`;
    } else if (team.length === 6) {
      suggestionsHtml = `<div class="empty" style="margin-top:1rem;">— Team full —</div>`;
    }

    // Hard weakness summary
    let hardWeakSummary = "";
    if (team.length > 0 && summary.hardWeak.length) {
      hardWeakSummary = `
        <div class="bld-warn">
          <strong>⚠ Uncovered weaknesses:</strong>
          ${summary.hardWeak.map((t) => typeChip(t)).join(" ")}
          <span style="color:var(--ink-mute);font-size:.95rem;">— at least one team member is weak to these and nobody resists them.</span>
        </div>`;
    }

    root.innerHTML = `
      <div class="bld-root">
        <h1 class="h-title">TEAM BUILDER</h1>
        <div class="bld-disclaimer">
          ⚠ <strong>Demo / reference only.</strong> Coverage analysis uses STAB types only (no coverage moves like Earthquake on a non-Ground mon). Treat scores as a starting point, not gospel.
        </div>

        <div class="bld-toolbar">
          <div class="chart-toggle" role="tablist" aria-label="Type chart">
            <button class="chart-toggle__btn ${chartMode === "redux" ? "is-active" : ""}" data-action="chart" data-chart="redux">Redux Chart</button>
            <button class="chart-toggle__btn ${chartMode === "gen6" ? "is-active" : ""}" data-action="chart" data-chart="gen6">Gen 6 Chart</button>
          </div>
          <button class="bld-clear" data-action="clear" ${team.length ? "" : "disabled"}>Clear team</button>
        </div>

        <div class="bld-slots">${slots.join("")}</div>
        ${pickerHtml}
        ${hardWeakSummary}

        <h2 class="h-section">Defensive Coverage</h2>
        <p style="font-size:1rem;color:var(--ink-mute);margin:.3rem 0 .6rem;">
          For each attacking type → how many team members are <strong>W</strong>eak / <strong>R</strong>esist (or immune).
          Red border = uncovered weakness.
        </p>
        <div class="bld-grid">${defCells}</div>

        <h2 class="h-section">Offensive Coverage (STAB only)</h2>
        <p style="font-size:1rem;color:var(--ink-mute);margin:.3rem 0 .6rem;">
          For each defending type → team's best STAB multiplier. Yellow = 2×+, dim = can't hit super-effectively.
        </p>
        <div class="bld-grid">${offCells}</div>

        ${suggestionsHtml}
      </div>
    `;

    // Wire interactions on the bld-root wrapper. The wrapper is re-created on
    // every paint() and is wiped on route change (router replaces root.innerHTML),
    // so the listener is naturally GC'd — no leak across pages.
    const bldRoot = root.querySelector(".bld-root");
    if (bldRoot) bldRoot.addEventListener("click", onClick);
    const pq = document.getElementById("bld-pick-q");
    if (pq) {
      pq.addEventListener("input", debounce((e) => {
        pickerQuery = e.target.value;
        paint();
      }, 60));
      // Keep focus + caret position
      requestAnimationFrame(() => {
        pq.focus();
        const pos = pq.value.length;
        pq.setSelectionRange(pos, pos);
      });
    }
  }

  function onClick(e) {
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const action = t.dataset.action;
    if (action === "open-picker") {
      openPicker(parseInt(t.dataset.slot, 10));
    } else if (action === "close-picker") {
      closePicker();
    } else if (action === "toggle-type") {
      togglePickerType(t.dataset.type);
    } else if (action === "remove") {
      setMonAt(parseInt(t.dataset.slot, 10), null);
    } else if (action === "pick") {
      const mon = findMon(t.dataset.name);
      if (mon && pickerOpenSlot !== null) {
        const slot = pickerOpenSlot;
        pickerOpenSlot = null;
        setMonAt(slot, mon);
      }
    } else if (action === "add-suggestion") {
      const mon = findMon(t.dataset.name);
      if (!mon) return;
      const idx = team.findIndex((x) => !x);
      if (team.length < 6) setMonAt(team.length, mon);
      else if (idx >= 0) setMonAt(idx, mon);
    } else if (action === "chart") {
      setChart(t.dataset.chart);
    } else if (action === "clear") {
      clearTeam();
    }
  }

  paint();
}
