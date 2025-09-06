const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}) };
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw data;
  return data;
}
export { api };
