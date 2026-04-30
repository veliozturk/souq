import { getSessionId } from '../auth/sessionRef';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5127';

export class ApiError extends Error {
  constructor(public status: number, public body: string, message: string) {
    super(message);
  }
}

function authHeaders(): Record<string, string> {
  const sid = getSessionId();
  return sid ? { Authorization: `Session ${sid}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, body, `GET ${path} → ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new ApiError(res.status, text, `POST ${path} → ${res.status}`);
  }
  return (text ? JSON.parse(text) : null) as T;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new ApiError(res.status, body, `DELETE ${path} → ${res.status}`);
  }
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = authHeaders();
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new ApiError(res.status, text, `PATCH ${path} → ${res.status}`);
  }
  return (text ? JSON.parse(text) : null) as T;
}

export type MultipartFile = {
  uri: string;
  name: string;
  type: string;
};

export async function apiMultipartPost<T>(
  path: string,
  files: MultipartFile[],
  fieldName = 'files',
  signal?: AbortSignal,
): Promise<T> {
  const form = new FormData();
  for (const f of files) {
    form.append(fieldName, { uri: f.uri, name: f.name, type: f.type } as unknown as Blob);
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
    signal,
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new ApiError(res.status, text, `POST ${path} → ${res.status}`);
  }
  return (text ? JSON.parse(text) : null) as T;
}
