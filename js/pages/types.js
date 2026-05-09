import { load } from "../data.js";
import { setTitle, escape, typeChip } from "../ui.js";

export async function render(params, root) {
  setTitle("Type Chart");
  const [chart, changes] = await Promise.all([load("type_chart"), load("type_changes")]);
  const types = chart.types;
  const matrix = chart.chart;

  const cellClass = (v) => {
    if (v === 0) return "x0";
    if (v === 4) return "x4";
    if (v === 2) return "x2";
    if (v === 0.25) return "h4";
    if (v === 0.5) return "h2";
    return "";
  };
  const fmtVal = (v) => {
    if (v === 0) return "0";
    if (v === 0.5) return "½";
    if (v === 0.25) return "¼";
    if (v === 1) return "";
    return String(v);
  };

  root.innerHTML = `
    <h1 class="h-title">TYPE CHART</h1>
    <p style="color:var(--ink-mute);font-size:1rem;margin:.4rem 0 .5rem;">Attacker → Defender · Redux modifications applied</p>

    <div class="tc-wrap">
      <table class="tc">
        <thead>
          <tr>
            <th class="tc-row">ATK \\ DEF</th>
            ${types.map((t) => `<th title="${escape(t)}">${escape(t.slice(0, 3))}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${types.map((atk) => {
            const row = matrix[atk] || matrix[atk.toLowerCase()] || matrix[atk.toUpperCase()];
            return `
              <tr>
                <th class="tc-row">${escape(atk)}</th>
                ${types.map((def) => {
                  const v = (row && (row[def] ?? row[def.toLowerCase()] ?? row[def.toUpperCase()])) ?? 1;
                  return `<td class="${cellClass(v)}" title="${escape(atk)} → ${escape(def)}: ×${v}">${fmtVal(v)}</td>`;
                }).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>

    <p style="font-size:1rem;color:var(--ink-mute);margin:.6rem 0;">Legend: <span style="background:rgba(127,223,114,.4);padding:0 6px;color:var(--good);">×2 ×4</span> super effective · <span style="background:rgba(255,91,136,.32);padding:0 6px;color:var(--bad);">½ ¼</span> not very effective · <span style="background:rgba(0,0,0,.5);padding:0 6px;color:var(--ink-mute);">0</span> immune</p>

    <h3 class="h-section">Redux Type Chart Changes</h3>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Atk</th><th>Def</th><th class="num">×</th><th>Why</th></tr></thead>
        <tbody>
          ${changes.map((c) => `
            <tr>
              <td>${typeChip(c.attacking)}</td>
              <td>${typeChip(c.defending)}</td>
              <td class="num"><strong>×${c.modifier}</strong></td>
              <td style="font-size:1rem;">${escape(c.explanation || "")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
