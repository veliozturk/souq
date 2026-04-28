const PHOTO_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5127';

const ABSOLUTE_URI = /^[a-z][a-z0-9+.-]*:/i;

export function photoUri(url: string): string {
  return ABSOLUTE_URI.test(url) ? url : `${PHOTO_BASE}${url}`;
}
