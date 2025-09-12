import API from '../axios';

// NOTE: Your API instance likely has baseURL '/api' (since you call API.post('/books',...))

export async function searchPortalLinks(q, facilityName) {
  const res = await API.get('/portal-links/search', { params: { q, facilityName } });
  return res.data;
}
export async function listPortalLinks(facilityName) {
  const res = await API.get('/portal-links', { params: { facilityName } });
  return res.data;
}
export async function createPortalLink(payload) {
  const res = await API.post('/portal-links', payload);
  return res.data;
}
export async function updatePortalLink(id, payload) {
  const res = await API.put(`/portal-links/${id}`, payload);
  return res.data;
}
export async function deletePortalLink(id) {
  const res = await API.delete(`/portal-links/${id}`);
  return res.data;
}
