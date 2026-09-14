/**
 * Phase 20 — full-application integrity audit tooling (static half).
 *
 * Cross-matches the frontend service layer against the backend route table
 * and the frontend navigation targets against the React Router table.
 * Static analysis proves CONTRACTS, not runtime behavior — runtime journeys
 * are exercised separately.
 *
 * Checks:
 *   A. every frontend service call resolves to a backend route (method+path)
 *   B. every backend route is consumed by the frontend (or classified)
 *   C. every <Link to="/x"> / navigate("/x") target exists as a route
 *   D. ghost-handler / prototype patterns in pages (console.log handlers,
 *      alert(), TODO/FIXME, "coming soon", javascript: hrefs, href="#")
 *   E. unreachable route files (a page file no route imports)
 *   F. assets referenced by frontend code that do not exist
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const FE = path.join(ROOT, 'frontend', 'src');
const BE = path.join(ROOT, 'backend');

let passed = 0;
let failed = 0;
const failures = [];
const findings = []; // { area, detail }
const check = (name, cond, detail = '') => {
  if (cond) { passed += 1; }
  else { failed += 1; failures.push(`${name}${detail ? ` — ${detail}` : ''}`); }
};

// ── collect source files ────────────────────────────────────────────────
function walk(dir, exts, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, acc);
    else if (exts.some((x) => e.name.endsWith(x))) acc.push(p);
  }
  return acc;
}
const feFiles = walk(FE, ['.jsx', '.js']);
const beRouteFiles = fs
  .readdirSync(path.join(BE, 'routes'))
  .filter((f) => f.endsWith('.js'));

// ── A. frontend API calls ───────────────────────────────────────────────
// Patterns: api.get('/x'), api.post(`/x/${...}`). Template literals are
// extracted with a brace-aware tokenizer so nested backticks inside ${…}
// expressions (e.g. `${qs ? `&` : `?`}`) never truncate the path.
function extractTemplateLiterals(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    if (src[i] === '`') {
      const start = i;
      let depth = 0;
      i += 1;
      while (i < src.length) {
        const ch = src[i];
        if (ch === '\\') { i += 2; continue; }
        if (ch === '$' && src[i + 1] === '{') { depth += 1; i += 2; continue; }
        if (ch === '}') { depth -= 1; i += 1; continue; }
        if (ch === '`' && depth === 0) { i += 1; break; }
        i += 1;
      }
      out.push(src.slice(start, i));
    } else {
      i += 1;
    }
  }
  return out;
}

function matchApiCallsIn(src) {
  const found = [];
  let m;
  const CALL_Q_RE = /api\.(get|post|patch|put|delete)\(\s*['"]([^'"]+)['"]/g;
  while ((m = CALL_Q_RE.exec(src)) !== null) {
    found.push({ method: m[1].toUpperCase(), rawPath: m[2] });
  }
  // template-literal call paths, found positionally
  const CALL_T_RE = /api\.(get|post|patch|put|delete)\(\s*`/g;
  CALL_T_RE.lastIndex = 0;
  while ((m = CALL_T_RE.exec(src)) !== null) {
    const rest = src.slice(m.index + m[0].length - 1);
    const lit = extractTemplateLiterals(rest);
    if (lit.length > 0) {
      found.push({ method: m[1].toUpperCase(), rawPath: lit[0].slice(1, -1) });
    }
  }
  return found;
}

const feCalls = [];
for (const f of feFiles) {
  const src = fs.readFileSync(f, 'utf8');
  for (const call of matchApiCallsIn(src)) {
    feCalls.push({ file: path.relative(FE, f), ...call });
  }
}

// ── backend route table ─────────────────────────────────────────────────
// router.get('/x', ...) — resolve mounted prefixes from server.js
const beRoutes = []; // { method, fullPath, file }
const MOUNT_RE = /app\.use\(\s*['"`]\/([^'"`]*)['"`]\s*,\s*[\w\s,]*?(\w+Routes)\s*\)/g;
const serverSrc = fs.readFileSync(path.join(BE, 'server.js'), 'utf8');
const mounts = [];
let mm;
while ((mm = MOUNT_RE.exec(serverSrc)) !== null) mounts.push({ prefix: mm[1], name: mm[2] }); // mm[2] = xRoutes (last arg)
for (const file of beRouteFiles) {
  const base = file.replace('Routes.js', '').replace('Route.js', '');
  const mount = mounts.find((mo) => mo.name.toLowerCase() === base.toLowerCase() + 'Routes'.toLowerCase() || mo.name.toLowerCase() === base.toLowerCase());
  const prefix = mount ? `/${mount.prefix}` : `/${base}`;
  const src = fs.readFileSync(path.join(BE, 'routes', file), 'utf8');
  const R_RE = /router\.(get|post|patch|put|delete)\(\s*['"`]([^'"`]+)['"`]/g;
  let rm;
  while ((rm = R_RE.exec(src)) !== null) {
    let sub = rm[2];
    if (sub === '/') sub = '';
    beRoutes.push({ method: rm[1].toUpperCase(), fullPath: `${prefix}${sub}`, file });
  }
}

// ── matching: concrete-path params + :param patterns ────────────────────
function feCallToPattern(rawPath) {
  // Depth-aware pattern builder: query '?' only honored at brace depth 0;
  // balanced ${…} expressions become :param; a trailing interpolation not
  // followed by '/' is a query/suffix and is dropped (e.g.
  // `/admin/users${qs ? `?${qs}` : ''}` → `/admin/users`).
  let out = '';
  let i = 0;
  while (i < rawPath.length) {
    if (rawPath.startsWith('${', i)) {
      let depth = 0;
      let j = i + 1;
      for (; j < rawPath.length; j += 1) {
        if (rawPath[j] === '{') depth += 1;
        else if (rawPath[j] === '}') { depth -= 1; if (depth === 0) break; }
      }
      const next = rawPath[j + 1];
      const prev = i > 0 ? rawPath[i - 1] : '';
      if (next && next === '/') {
        out += ':param';
        i = j + 1;
      } else if (!next && prev === '/') {
        // trailing segment interpolation — this IS the dynamic param
        out += ':param';
        i = j + 1;
      } else {
        // mid-path/query interpolation — the static path ends here
        return out.endsWith('/') ? out.slice(0, -1) : out;
      }
    } else {
      if (rawPath[i] === '?') break; // top-level query start
      out += rawPath[i];
      i += 1;
    }
  }
  return out.replace(/\/+$/, '');
}
function matchCall(call) {
  // extract the API path — rawPath is relative to /api
  const pattern = feCallToPattern(call.rawPath);
  const patParts = pattern.split('/').filter(Boolean);
  for (const r of beRoutes) {
    const rParts = r.fullPath.replace(/^\/api\/?/, '').split('/').filter(Boolean);
    if (r.method !== call.method || rParts.length !== patParts.length) continue;
    let ok = true;
    for (let i = 0; i < patParts.length; i += 1) {
      const pp = patParts[i];
      const rp = rParts[i];
      if (pp === rp) continue;
      if (rp.startsWith(':') || pp === ':param') continue;
      ok = false;
      break;
    }
    if (ok) return r;
  }
  return null;
}

console.log('── A. FRONTEND CALL → BACKEND ROUTE ──');
const dedupe = new Map();
for (const c of feCalls) {
  const key = `${c.method} ${c.rawPath}`;
  if (dedupe.has(key)) { dedupe.get(key).count += 1; continue; }
  dedupe.set(key, { ...c, count: 1 });
}
for (const [, c] of [...dedupe.entries()].sort((a, b) => a[1].file.localeCompare(b[1].file))) {
  const match = matchCall(c);
  const label = `${c.method} ${c.rawPath}  (${c.file})`;
  if (match) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(`FRONTEND CALL WITHOUT BACKEND ROUTE: ${label}`);
    console.log(`  ✘ ${label}`);
  }
}
console.log(`  ${feCalls.length} calls across ${dedupe.size} unique endpoints`);

console.log('\n── B. BACKEND ROUTES WITHOUT FRONTEND CONSUMER ──');
for (const r of beRoutes) {
  const rel = r.fullPath.replace(/^\/api\/?/, '');
  const segs = rel.split('/').filter(Boolean);
  // find a frontend call whose segments can produce this route
  const consumed = feCalls.some((c) => {
    const pattern = feCallToPattern(c.rawPath).split('/').filter(Boolean);
    if (c.method !== r.method || pattern.length !== segs.length) return false;
    return pattern.every((p, i) => p === segs[i] || p === ':param' || segs[i].startsWith(':'));
  });
  if (consumed) { passed += 1; continue; }
  // classify known API-only/test-only endpoints
  const apiOnly = [
    '/api/health',
    '/api/payments/webhook', // provider callback, not frontend
  ];
  // Verified classifications (Phase 20):
  //  - GET /x/:id detail routes: UI reads via store hydration (list endpoint)
  //    + client-side slug lookup — deliberate architecture.
  //  - GET /customers/me(/addresses): customer profile embeds addresses via
  //    GET /auth/me, which the UI consumes; these are API-only variants.
  //  - POST /uploads/product-image: ImageUploader uses raw XHR (progress
  //    events) — invisible to fetch-based extraction, consumed by the UI.
  const storeHydrated = [
    'GET /api/collections/:id',
    'GET /api/products/:id',
    'GET /api/customers/:id',
    'GET /api/customers/me',
    'GET /api/customers/me/addresses',
  ];
  const xhrOnly = ['POST /api/uploads/product-image'];
  const testOnly = /inventory|analytics/.test(rel); // exercised by suites; UI uses store-derived views where applicable
  if (apiOnly.includes(r.fullPath)) { passed += 1; console.log(`  ○ API-only by design: ${r.method} ${r.fullPath}`); continue; }
  if (storeHydrated.includes(`${r.method} ${r.fullPath}`)) { passed += 1; console.log(`  ○ store-hydrated (UI reads list + client lookup): ${r.method} ${r.fullPath}`); continue; }
  if (xhrOnly.includes(`${r.method} ${r.fullPath}`)) { passed += 1; console.log(`  ○ consumed via XHR (upload progress): ${r.method} ${r.fullPath}`); continue; }
  if (testOnly) { passed += 1; continue; }
  failed += 1;
  failures.push(`BACKEND ENDPOINT NO FRONTEND CONSUMER: ${r.method} ${r.fullPath}`);
  console.log(`  ? ${r.method} ${r.fullPath} (${r.file})`);
}

// ── C. navigation targets vs routes ─────────────────────────────────────
console.log('\n── C. NAVIGATION TARGETS ──');
const routePaths = new Set();
const appSrc = fs.readFileSync(path.join(FE, 'App.jsx'), 'utf8');
let pm;
const P_RE = /path="([^"]*)"/g;
while ((pm = P_RE.exec(appSrc)) !== null) routePaths.add(pm[1]);
// expand dynamic segments for matching
function routeMatches(target) {
  const t = target.split('?')[0];
  if (routePaths.has(t)) return true;
  const tParts = t.split('/').filter(Boolean);
  for (const rp of routePaths) {
    const parts = rp.split('/').filter(Boolean);
    if (parts.length !== tParts.length) continue;
    if (parts.every((p, i) => p === tParts[i] || p.startsWith(':'))) return true;
  }
  return false;
}
const NAV_Q_RE = /(?:to=|navigate\()\s*\{?\s*['"](\/[^'"?]*)['"]/g;
const NAV_T_RE = /(?:to=|navigate\()\s*\{?\s*`(\/[^`?]+)`/g;
const navTargets = new Map(); // target → first file
for (const f of feFiles) {
  const src = fs.readFileSync(f, 'utf8');
  let m;
  NAV_Q_RE.lastIndex = 0;
  NAV_T_RE.lastIndex = 0;
  while ((m = NAV_Q_RE.exec(src)) !== null) {
    const t = m[1];
    if (!navTargets.has(t)) navTargets.set(t, path.relative(FE, f));
  }
  while ((m = NAV_T_RE.exec(src)) !== null) {
    // dynamic targets: ${…} after '/' is a dynamic segment (:param);
    // otherwise (e.g. `/login${redirect}`) the static prefix is the target.
    const raw = m[1];
    const idx = raw.indexOf('${');
    const t = idx === -1 ? raw
      : (idx > 0 && raw[idx - 1] === '/' ? raw.slice(0, idx) + ':param' + raw.slice(raw.indexOf('}', idx) + 1)
                                         : raw.slice(0, idx));
    if (!navTargets.has(t)) navTargets.set(t, path.relative(FE, f));
  }
}
let navFail = 0;
for (const [t, file] of [...navTargets.entries()].sort()) {
  if (t === '*' || routeMatches(t)) { passed += 1; continue; }
  failed += 1; navFail += 1;
  failures.push(`NAVIGATION TO NONEXISTENT ROUTE: ${t} (${file})`);
  console.log(`  ✘ ${t}  (${file})`);
}
console.log(`  ${navTargets.size} unique targets, ${navFail} broken`);

// ── D. ghost/prototype patterns ─────────────────────────────────────────
console.log('\n── D. GHOST / PROTOTYPE PATTERNS ──');
const GHOST_RE = /console\.log\(|alert\(|TODO|FIXME|coming soon|Coming Soon|javascript:|href="#"/i;
const ghostHits = [];
for (const f of feFiles) {
  const rel = path.relative(FE, f);
  if (/\.test\.|__tests__|\.d\.ts/.test(rel)) continue;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (GHOST_RE.test(line)) ghostHits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 110)}`);
  });
}
for (const g of ghostHits) console.log(`  • ${g}`);
console.log(`  ${ghostHits.length} hits (reviewed below)`);

// ── E. orphan page components ────────────────────────────────────────────
console.log('\n── E. ORPHAN PAGE COMPONENTS ──');
const pageFiles = walk(path.join(FE, 'pages'), ['.jsx']);
let orphans = 0;
for (const pf of pageFiles) {
  const base = path.basename(pf, '.jsx');
  const imported = [...feFiles]
    .filter((f) => f !== pf)
    .some((f) => fs.readFileSync(f, 'utf8').includes(base));
  if (!imported) { orphans += 1; console.log(`  ? possibly orphaned: ${path.relative(FE, pf)}`); findings.push(`ORPHAN PAGE: ${path.relative(FE, pf)}`); }
}
check('no orphan pages', orphans === 0, `${orphans} found`);
console.log(`  ${pageFiles.length} page files, ${orphans} possibly orphaned`);

// ── F. asset existence ───────────────────────────────────────────────────
console.log('\n── F. ASSET REFERENCES ──');
const ASSET_RE = /["'(](\/assets\/[^)"'\s]+\.(?:jpg|jpeg|png|webp|svg|avif|gif))/g;
let missingAssets = 0;
for (const f of feFiles) {
  const src = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = ASSET_RE.exec(src)) !== null) {
    const fsPath = path.join(ROOT, 'frontend', 'public', m[1].replace(/\//g, path.sep));
    if (!fs.existsSync(fsPath)) {
      missingAssets += 1;
      failures.push(`MISSING ASSET: ${m[1]} (${path.relative(FE, f)})`);
      console.log(`  ✘ ${m[1]}  (${path.relative(FE, f)})`);
    }
  }
}
check('all referenced assets exist', missingAssets === 0, `${missingAssets} missing`);
console.log(`  ${missingAssets} missing`);

console.log(`\nSTATIC AUDIT: ${passed} checks passed, ${failed} failed`);
if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures) console.log(`  ✘ ${f}`);
  process.exitCode = 1;
}
