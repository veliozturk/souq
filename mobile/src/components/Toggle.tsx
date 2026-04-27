import { Pressable, View, StyleSheet } from 'react-native';
import { theme } from '../theme';

type Props = {
  on: boolean;
  onChange: (next: boolean) => void;
  colorOn?: string;
};

export function Toggle({ on, onChange, colorOn = theme.blue }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      style={[s.track, { backgroundColor: on ? colorOn : '#C9D1D9' }]}>
      <View style={[s.thumb, { left: on ? 20 : 2 }]} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
