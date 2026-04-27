import { findMock } from './mocks';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5127';

type MockMode = 'off' | 'fallback' | 'only';
const MOCK_MODE: MockMode = (process.env.EXPO_PUBLIC_USE_MOCKS as MockMode) ?? 'fallback';

export function isDemoMode(): boolean {
  return MOCK_MODE !== 'off';
}

export class ApiError extends Error {
  constructor(public status: number, public body: string, message: string) {
    super(message);
  }
}

export class MockMissError extends Error {
  constructor(path: string) {
    super(`No mock fixture for ${path}`);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  if (MOCK_MODE === 'only') return resolveMock<T>(path);

  try {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new ApiError(res.status, body, `GET ${path} → ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (MOCK_MODE === 'fallback') return resolveMock<T>(path);
    throw err;
  }
}

function resolveMock<T>(path: string): T {
  const result = findMock(path);
  if (result === undefined) throw new MockMissError(path);
  return result as T;
}
