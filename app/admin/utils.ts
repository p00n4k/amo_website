// utils.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost/brand_api";

// Generic fetch wrapper
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    let detail: any = undefined;
    try {
      detail = await res.json();
    } catch (_) {}
    throw new Error(detail?.error || detail?.message || res.statusText);
  }
  return (await res.json()) as T;
}

// Upload image helper
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  try {
    const r = await fetch(`${API_BASE}/upload`, { method: "POST", body: form });
    if (r.ok) {
      const j = await r.json();
      if (j?.url) return j.url as string;
    }
  } catch (_) {}

  // fallback
  const r2 = await fetch(`${API_BASE}/upload.php`, {
    method: "POST",
    body: form,
  });
  if (!r2.ok) throw new Error("Upload failed");
  const j2 = await r2.json();
  if (!j2?.url) throw new Error("Upload failed: no url returned");
  return j2.url as string;
}
