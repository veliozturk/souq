let currentSessionId: string | null = null;

export function getSessionId(): string | null {
  return currentSessionId;
}

export function setSessionId(id: string | null): void {
  currentSessionId = id;
}
