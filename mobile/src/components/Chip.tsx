import { ReactNode } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme, FONT } from '../theme';

export function Chip({ children }: { children: ReactNode }) {
  return (
    <View style={s.chip}>
      {typeof children === 'string' ? <Text style={s.text}>{children}</Text> : children}
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.ink,
  },
});
