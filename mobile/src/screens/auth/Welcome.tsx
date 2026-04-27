import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { CompassIllo } from '../../components/CompassIllo';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function Welcome({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.root, { paddingTop: insets.top + 12 }]}>
      <View style={s.center}>
        <CompassIllo size={240} />
        <Text style={s.eyebrow}>DUBAI · الإمارات</Text>
        <Text style={s.title}>Your neighbours{'\n'}have good stuff.</Text>
        <Text style={s.subtitle}>Buy, sell and swap with people nearby — from Marina to Mirdif.</Text>
      </View>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        <PrimaryBtn variant="orange" onPress={() => navigation.navigate('Phone')}>
          Get started
        </PrimaryBtn>
        <View style={s.loginRow}>
          <Text style={s.loginText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Phone')}>
            <Text style={s.loginLink}>Log in</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  eyebrow: {
    marginTop: 40,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.orange,
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 12,
    fontFamily: FONT.bold,
    fontSize: 34,
    color: theme.ink,
    letterSpacing: -0.8,
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 14,
    fontFamily: FONT.regular,
    fontSize: 16,
    color: theme.inkDim,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 280,
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  loginLink: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.blue,
  },
});
