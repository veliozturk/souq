import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Me } from '../api/types';

const KEY = '@souq/session';

type Stored = { user: Me; sessionId: string };

export async function loadSession(): Promise<Stored | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : null;
  } catch {
    return null;
  }
}

export async function saveSession(stored: Stored): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // best-effort
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // best-effort
  }
}
