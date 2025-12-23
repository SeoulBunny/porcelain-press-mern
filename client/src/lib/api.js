const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

function getToken() {
  try { return localStorage.getItem("pp_token"); } catch { return null; }
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", "Bearer " + token);

  const res = await fetch(API_BASE + path, { ...options, headers });

  // Handle non-JSON responses
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiForm(path, formData, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", "Bearer " + token);

  const res = await fetch(API_BASE + path, {
    method: "POST",
    ...options,
    headers,
    body: formData
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export function uploadsUrl(path) {
  const base = (import.meta.env.VITE_SERVER_BASE || "http://localhost:5000");
  return base.replace(/\/$/, "") + path;
}
