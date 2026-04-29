// Two palettes, one active. Flip `theme` below to preview the other.
// All 42 callers consume `theme.X` — field shape is identical between palettes.

const souqTheme = {
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
  buttonShadow: '#F97316'
} as const;

export const theme = sandTheme;

export type Theme = typeof theme;

// Font family loaded by expo-font in App.tsx.
// Falls back to system font until loaded.
export const FONT = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;
