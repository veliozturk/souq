import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  step: number;
  total?: number;
};

export function Progress({ step, total = 6 }: Props) {
  return (
    <View style={s.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[s.bar, { backgroundColor: i <= step ? theme.orange : theme.line }]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 3,
  },
});
