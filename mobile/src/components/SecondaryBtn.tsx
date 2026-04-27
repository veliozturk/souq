import { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme, FONT } from '../theme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

export function SecondaryBtn({ children, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [s.btn, pressed && !disabled && s.pressed, disabled && s.disabled]}>
      <View style={s.row}>
        {typeof children === 'string' ? <Text style={s.label}>{children}</Text> : children}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.line,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: 17,
    letterSpacing: -0.2,
    color: theme.ink,
  },
});
