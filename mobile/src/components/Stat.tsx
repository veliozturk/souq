import { View, Text, StyleSheet } from 'react-native';
import { theme, FONT } from '../theme';

export function Stat({ k, v }: { k: string; v: string }) {
  return (
    <View style={s.wrap}>
      <Text style={s.v} numberOfLines={1}>
        {v}
      </Text>
      <Text style={s.k}>{k}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    flex: 1,
  },
  v: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.ink,
  },
  k: {
    fontFamily: FONT.medium,
    fontSize: 10,
    color: theme.inkDim,
    marginTop: 1,
  },
});
