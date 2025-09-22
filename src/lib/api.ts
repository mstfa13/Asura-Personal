export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function getApiBase() {
  // Prefer explicit env override when not using Vercel dev
  const env = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
  if (env) return env.replace(/\/$/, '');
  // Vercel serverless functions served from /api
  return '/api';
}

export async function api<T = any>(path: string, method: HttpMethod = 'GET', body?: any, token?: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return (await res.json()) as T;
  return (undefined as unknown) as T;
}
