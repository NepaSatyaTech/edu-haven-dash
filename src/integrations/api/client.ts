const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('auth_token');

export const apiClient = {
  async get(path: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
  },

  async post(path: string, body: unknown, requireAuth = true) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (requireAuth) headers.Authorization = `Bearer ${getToken()}`;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST', headers, body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
  },

  async put(path: string, body: unknown) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
  },

  async delete(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    return res.json();
  },

  async uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
    const data = await res.json();
    const serverBase = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
    return `${serverBase}${data.url}`;
  },
};
