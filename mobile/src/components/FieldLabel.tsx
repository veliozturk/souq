import { ReactNode } from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme, FONT } from '../theme';

export function FieldLabel({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{typeof children === 'string' ? children.toUpperCase() : children}</Text>;
}

const s = StyleSheet.create({
  label: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
});
