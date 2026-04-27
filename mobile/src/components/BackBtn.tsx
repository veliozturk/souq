import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

type Props = {
  onPress: () => void;
  size?: number;
  arrowSize?: number;
};

export function BackBtn({ onPress, size = 38, arrowSize = 10 }: Props) {
  const h = (arrowSize * 16) / 10;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={({ pressed }) => [
        s.btn,
        { width: size, height: size, borderRadius: size === 38 ? 12 : 11 },
        pressed && s.pressed,
      ]}>
      <Svg width={arrowSize} height={h} viewBox="0 0 10 16" fill="none">
        <Path
          d="M8 2L2 8l6 6"
          stroke={theme.ink}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
