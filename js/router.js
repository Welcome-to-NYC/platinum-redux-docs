// Tiny hash-based router. Routes -> async render fn(params, root).

const routes = [];

export function route(pattern, render) {
  routes.push({ pattern, render });
}

function match(hash) {
  // Strip leading '#' and '/'
  const path = hash.replace(/^#\/?/, "").replace(/^\/+/, "");
  for (const r of routes) {
    const m = matchPattern(r.pattern, path);
    if (m) return { render: r.render, params: m };
  }
  return null;
}

function matchPattern(pattern, path) {
  const ps = pattern.split("/").filter(Boolean);
  const xs = path.split("/").filter(Boolean);
  if (ps.length !== xs.length) return null;
  const params = {};
  for (let i = 0; i < ps.length; i++) {
    if (ps[i].startsWith(":")) {
      params[ps[i].slice(1)] = decodeURIComponent(xs[i]);
    } else if (ps[i] !== xs[i]) {
      return null;
    }
  }
  return params;
}

let currentToken = 0;
async function go(hash) {
  const root = document.getElementById("main");
  if (!root) return;
  const m = match(hash) || { render: routes.find((r) => r.pattern === "/").render, params: {} };
  // Highlight active nav
  document.querySelectorAll(".ribbon a").forEach((a) => {
    const linkPath = (a.getAttribute("href") || "").replace(/^#\/?/, "").split("/")[0];
    const cur = hash.replace(/^#\/?/, "").split("/")[0];
    a.classList.toggle("is-active", linkPath !== "" && linkPath === cur);
  });

  // Loading flash
  const myToken = ++currentToken;
  const showLoading = setTimeout(() => {
    if (myToken !== currentToken) return;
    root.innerHTML = `
      <div class="loading">
        <div class="loading__box">
          <div class="loading__bars"><span></span><span></span><span></span></div>
          <p class="loading__text">Loading…</p>
        </div>
      </div>`;
  }, 80);

  try {
    await m.render(m.params, root);
  } catch (err) {
    console.error(err);
    root.innerHTML = `
      <div class="frame" style="padding:1rem">
        <h2 class="h-title">Oops</h2>
        <p>Something broke loading this page.</p>
        <pre style="white-space:pre-wrap;color:var(--bad);font-size:.95rem;">${String(err && err.stack || err)}</pre>
      </div>`;
  } finally {
    clearTimeout(showLoading);
    if (myToken === currentToken) {
      // close mobile menu
      const ribbon = document.querySelector(".ribbon");
      if (ribbon) ribbon.classList.remove("is-open");
      // scroll to top on route change
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      root.focus({ preventScroll: true });
    }
  }
}

export function start() {
  window.addEventListener("hashchange", () => go(location.hash));
  go(location.hash || "#/");
}

export function navigate(hash) {
  if (location.hash !== hash) {
    location.hash = hash;
  } else {
    go(hash);
  }
}
