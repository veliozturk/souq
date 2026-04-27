// Port of src/tokens.js for the web prototype.
// Same hex values; alpha-suffix hex strings (e.g. blue + '18') work as-is in RN.

const blue = '#0F4C81';
const orange = '#F97316';

export const theme = {
  blue,
  orange,
  blueSoft: blue + '18',
  orangeSoft: orange + '2A',
  ink: '#14212E',
  inkDim: '#5B6B7A',
  line: '#E6EAEE',
  bg: '#FAFAF7',
  surface: '#FFFFFF',
  success: '#10B981',
} as const;

export type Theme = typeof theme;

// Font family loaded by expo-font in App.tsx.
// Falls back to system font until loaded.
export const FONT = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;
