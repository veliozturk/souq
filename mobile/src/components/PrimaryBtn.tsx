import { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { theme, FONT } from '../theme';

type Variant = 'blue' | 'orange';

type Props = {
  children: ReactNode;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
};

export function PrimaryBtn({ children, variant = 'blue', onPress, disabled }: Props) {
  const bg = disabled ? '#C9D1D9' : variant === 'orange' ? theme.orange : theme.blue;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg },
        !disabled && variant === 'blue' && s.shadowBlue,
        !disabled && variant === 'orange' && s.shadowOrange,
        pressed && !disabled && s.pressed,
      ]}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shadowBlue: {
    shadowColor: theme.blue,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  shadowOrange: {
    shadowColor: theme.buttonShadow,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: FONT.semibold,
    fontSize: 17,
    letterSpacing: -0.2,
    color: '#fff',
  },
});
