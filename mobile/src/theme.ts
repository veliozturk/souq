// Two palettes. The active one is selected at boot:
// `index.ts` calls `loadThemePreference()` then `applyPalette()` BEFORE
// importing `App`, so by the time screens evaluate their `StyleSheet.create`
// blocks they read the right values from the mutable `theme` container.
//
// In-session switching is not supported: ~49 callers consume `theme.X` inside
// module-top-level `StyleSheet.create({...})`, which freezes the value at
// module load. The Appearance screen saves the choice and shows a
// "Applied on next app open" hint.
import AsyncStorage from '@react-native-async-storage/async-storage';

const blueTheme = {
  blue:       '#0F4C81',
  orange:     '#F97316',
  blueSoft:   '#0F4C81' + '18',
  orangeSoft: '#F97316' + '2A',
  ink:        '#14212E',
  inkDim:     '#5B6B7A',
  line:       '#E6EAEE',
  bg:         '#FAFAF7',
  surface:    '#FFFFFF',
  success:    '#10B981',
  buttonShadow: '#F97316'
} as const;

const sandTheme = {
  blue:       '#7C2D2D',
  orange:     '#C9A86A',
  blueSoft:   '#7C2D2D' + '18',
  orangeSoft: '#C9A86A' + '2A',
  ink:        '#3A2E1F',
  inkDim:     '#8A7862',
  line:       '#DFD4BD',
  bg:         '#F5EFE4',
  surface:    '#FBF7EE',
  success:    '#10B981',
  buttonShadow: '#c9a86a'
} as const;

const warmAmberTheme = {
  blue:       '#F08A1C',          // primary = warm amber (the "hero" colour)
  orange:     '#B8521A',          // accent = deeper clay
  blueSoft:   '#F08A1C' + '18',   // ~9% amber tint for soft fills
  orangeSoft: '#B8521A' + '2A',   // ~16% clay tint
  ink:        '#1A2740',          // dark navy text
  inkDim:     '#5A6477',          // muted navy for secondary text
  line:       '#EADFCF',          // warm hairline / divider
  bg:         '#FBF5EA',          // warm cream canvas
  surface:    '#FFFFFF',          // card / sheet surface
  success:    '#10B981',          // unchanged — semantic green
  buttonShadow: '#F08A1C',        // amber glow under primary CTAs
} as const;


export const palettes = { blue: blueTheme, sand: sandTheme, amber: warmAmberTheme } as const;
export type ThemeName = keyof typeof palettes;

export const theme: Theme = { ...sandTheme };

export type Theme = typeof sandTheme;

export function applyPalette(name: ThemeName): void {
  Object.assign(theme, palettes[name]);
}

const STORAGE_KEY = '@souq/theme';

export async function loadThemePreference(): Promise<ThemeName | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw && raw in palettes ? (raw as ThemeName) : null;
  } catch {
    return null;
  }
}

export async function saveThemePreference(name: ThemeName): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, name);
  } catch {
    // best-effort
  }
}

// Font family loaded by expo-font in App.tsx.
// Falls back to system font until loaded.
export const FONT = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;
