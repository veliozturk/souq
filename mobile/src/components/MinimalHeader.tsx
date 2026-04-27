import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme, FONT } from '../theme';
import { Progress } from './Progress';

type Props = {
  step: number;
  total?: number;
  showBack?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
};

export function MinimalHeader({ step, total = 6, showBack = true, onBack, onSkip }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.row}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [s.backBtn, pressed && s.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Back">
            <Svg width={10} height={16} viewBox="0 0 10 16" fill="none">
              <Path
                d="M8 2L2 8l6 6"
                stroke={theme.ink}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={s.step}>
          Step {step + 1} of {total}
        </Text>
        <Pressable
          onPress={onSkip}
          style={({ pressed }) => [s.skipBtn, pressed && s.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Skip">
          <Text style={s.skipText}>Skip</Text>
        </Pressable>
      </View>
      <Progress step={step} total={total} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.2,
  },
  skipBtn: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: theme.inkDim,
  },
  pressed: {
    opacity: 0.6,
  },
});
