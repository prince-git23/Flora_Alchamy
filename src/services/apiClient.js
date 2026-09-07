/**
 * Single API client for the Flora Alchemy backend.
 *
 * All HTTP goes through here — no scattered fetch calls in pages. Base URL
 * comes from VITE_API_URL (root .env). Responses are normalized to
 * { status, ok, data } and API errors to { status, message, code }.
 *
 * Tokens: customer and admin sessions are separate (keys below). Pass the
 * correct token when calling protected endpoints.
 */

export const CUSTOMER_TOKEN_KEY = 'flora_alchemy_customer_token';
export const ADMIN_TOKEN_KEY = 'flora_alchemy_admin_token';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

export function getToken(scope = 'customer') {
  try {
    return localStorage.getItem(scope === 'admin' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token, scope = 'customer') {
  try {
    if (token) localStorage.setItem(scope === 'admin' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY, token);
    else localStorage.removeItem(scope === 'admin' ? ADMIN_TOKEN_KEY : CUSTOMER_TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function clearToken(scope = 'customer') {
  setToken(null, scope);
}

async function request(method, path, { token, body, scope } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const activeToken = token || getToken(scope || 'customer');
  if (activeToken) headers.Authorization = `Bearer ${activeToken}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      message: 'Unable to reach the Flora Alchemy server. Please check your connection and try again.',
      code: 'NETWORK_ERROR',
      raw: err,
    };
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.ok && data && data.success !== false) {
    return { ok: true, status: res.status, data };
  }

  return {
    ok: false,
    status: res.status,
    message: (data && data.message) || `Request failed (${res.status}).`,
    code: (data && data.code) || 'API_ERROR',
    data,
  };
}

export const api = {
  get: (path, opts = {}) => request('GET', path, opts),
  post: (path, body, opts = {}) => request('POST', path, { ...opts, body }),
  patch: (path, body, opts = {}) => request('PATCH', path, { ...opts, body }),
  delete: (path, opts = {}) => request('DELETE', path, opts),
};

export default api;
