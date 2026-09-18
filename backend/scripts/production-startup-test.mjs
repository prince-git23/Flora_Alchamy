/**
 * Phase 12 — production startup validation.
 *
 * Boots the backend with NODE_ENV=production and a valid config,
 * then verifies: startup, health, readiness, and graceful shutdown.
 *
 * Run: cd backend && node scripts/production-startup-test.mjs
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function check(name, cond, detail = '') {
  if (cond) { passed++; console.log(`  ✔ ${name}`); }
  else { failed++; console.log(`  ✘ ${name} ${detail}`); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function bootServer({ port, env = {} }) {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: BACKEND_DIR,
    env: {
      ...process.env,
      PORT: String(port),
      SEED_ON_START: 'false',
      ...env,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (d) => { output += d; });
  child.stderr.on('data', (d) => { output += d; });

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}: ${output.slice(0, 200)}`);
    }
    try {
      const r = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(2000) });
      if (r.ok) return { child, base, output };
    } catch {}
    await sleep(500);
  }
  child.kill('SIGKILL');
  throw new Error('Server did not start within 30s');
}

function killServer(child) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null) return resolve();
    child.on('exit', () => resolve());
    child.kill('SIGTERM');
    setTimeout(resolve, 5000);
  });
}

// ── Tests ─────────────────────────────────────────────────────────────
console.log('\n▶ Production Startup Test');

const port = 4300;

try {
  const { child, base, output } = await bootServer({
    port,
    env: {
      NODE_ENV: 'production',
      JWT_SECRET: 'production-startup-test-secret',
      CORS_ORIGIN: 'https://floraalchemy.com',
    },
  });

  try {
    // Health
    const health = await fetch(`${base}/api/health`);
    const healthJson = await health.json();
    check('production health → 200', health.status === 200);
    check('production health has service', healthJson.service === 'flora-alchemy-api');

    // Readiness
    const ready = await fetch(`${base}/api/readiness`);
    const readyJson = await ready.json();
    check('production readiness → 200', ready.status === 200);
    check('production readiness is ready', readyJson.status === 'ready');

    // Products (public)
    const products = await fetch(`${base}/api/products`);
    check('products accessible in production', products.status === 200);

    // Settings (public)
    const settings = await fetch(`${base}/api/settings`);
    check('settings accessible in production', settings.status === 200);

    // Config validation logged
    check('production config validated', output.includes('listening on'));

    // Graceful shutdown
    const exitPromise = new Promise((resolve) => {
      child.on('exit', (code) => resolve(code));
    });
    child.kill('SIGTERM');
    const exitCode = await Promise.race([exitPromise, sleep(8000).then(() => -1)]);
    const isWin = process.platform === 'win32';
    check('SIGTERM shuts down', isWin ? (exitCode === null || exitCode === 0) : exitCode === 0, `exitCode=${exitCode}`);
  } catch (err) {
    check('production test', false, err.message);
    child.kill('SIGKILL');
  }
} catch (err) {
  check('server startup', false, err.message);
}

// ── Summary ───────────────────────────────────────────────────────────
console.log(`\n════════════════════════════════════════`);
console.log(`  Production Startup: ${passed} passed, ${failed} failed`);
console.log(`════════════════════════════════════════\n`);

process.exit(failed > 0 ? 1 : 0);
