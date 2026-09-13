import api from './apiClient.js';

/**
 * adminUserService — backend-backed operator management.
 * Replaces the localStorage-based adminSettings user roster.
 */

export async function getOperators({ role, status, q } = {}) {
  const params = new URLSearchParams();
  if (role && role !== 'ALL') params.set('role', role);
  if (q) params.set('q', q);
  const qs = params.toString();
  const res = await api.get(`/admin/users${qs ? `?${qs}` : ''}`, { scope: 'admin' });
  if (!res.ok) throw new Error(res.message || 'Could not load operators.');
  return res.data.operators || [];
}

export async function createOperator({ name, email, role, password }) {
  const res = await api.post('/admin/users', { name, email, role, password }, { scope: 'admin' });
  if (!res.ok) throw new Error(res.message || 'Could not create operator.');
  return res.data;
}

export async function updateOperatorRole(id, role) {
  const res = await api.patch(`/admin/users/${id}/role`, { role }, { scope: 'admin' });
  if (!res.ok) throw new Error(res.message || 'Could not update role.');
  return res.data;
}

export async function deleteOperator(id) {
  const res = await api.delete(`/admin/users/${id}`, { scope: 'admin' });
  if (!res.ok) throw new Error(res.message || 'Could not delete operator.');
  return res.data;
}
