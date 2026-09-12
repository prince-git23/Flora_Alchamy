import api from './apiClient.js';

export async function createCustomRequest(data) {
  const res = await api.post('/custom-requests', data);
  return res.request;
}

export async function getMyCustomRequests() {
  const res = await api.get('/custom-requests/mine');
  return res.requests;
}

export async function getAllCustomRequests(status) {
  const qs = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  const res = await api.get(`/custom-requests${qs}`);
  return res.requests;
}

export async function updateCustomRequestStatus(id, status, adminNotes) {
  const res = await api.patch(`/custom-requests/${id}/status`, { status, adminNotes });
  return res.request;
}
