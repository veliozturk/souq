import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { useAuthStub } from '../../auth/AuthStub';
import { verifyOtp } from '../../api/auth';
import { ApiError } from '../../api/client';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

export default function OTP({ navigation, route }: Props) {
  const phone = route.params?.phone ?? '+971 50 123 4567';
  const { signIn } = useAuthStub();
  const [code, setCode] = useState<string[]>(['4', '7', '2', '1', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(24);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);
  const insets = useSafeAreaInsets();

  const onVerify = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { user, sessionId } = await verifyOtp(phone, code.join(''));
      signIn(user, sessionId);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setError('Phone not registered');
      } else {
        setError(e instanceof Error ? e.message : 'Network error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((sec) => sec - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const complete = code.every((d) => d !== '');
  const activeIdx = code.findIndex((d) => d === '');

  const setDigitAt = (i: number, v: string) => {
    const cleaned = v.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[i] = cleaned;
    setCode(next);
    if (cleaned && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyPress = (i: number, key: string) => {
    if (key === 'Backspace' && code[i] === '' && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader step={1} onBack={() => navigation.goBack()} onSkip={() => navigation.navigate('Profile')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Enter the code{'\n'}we sent you.</Text>
          <Text style={s.subtitle}>
            Sent to <Text style={s.subtitleStrong}>{phone}</Text> ·{' '}
            <Text style={s.subtitleLink} onPress={() => navigation.goBack()}>
              Change
            </Text>
          </Text>

          <View style={s.codeRow}>
            {code.map((d, i) => {
              const active = i === (activeIdx === -1 ? code.length - 1 : activeIdx);
              return (
                <Pressable
                  key={i}
                  onPress={() => inputs.current[i]?.focus()}
                  style={[s.cell, active && s.cellActive]}>
                  <TextInput
                    ref={(r) => {
                      inputs.current[i] = r;
                    }}
                    value={d}
                    onChangeText={(v) => setDigitAt(i, v)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectionColor={theme.orange}
                    style={s.cellInput}
                    textContentType="oneTimeCode"
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={s.timerRow}>
            {secondsLeft > 0 ? (
              <Text style={s.timerText}>
                Resend code in{' '}
                <Text style={s.timerStrong}>0:{String(secondsLeft).padStart(2, '0')}</Text>
              </Text>
            ) : (
              <Pressable onPress={() => setSecondsLeft(24)}>
                <Text style={s.resendLink}>Resend code</Text>
              </Pressable>
            )}
          </View>

          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
          <PrimaryBtn onPress={onVerify} disabled={!complete || submitting}>
            {submitting ? 'Verifying…' : 'Verify'}
          </PrimaryBtn>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  subtitle: {
    marginTop: 10,
    fontFamily: FONT.regular,
    fontSize: 15,
    color: theme.inkDim,
    lineHeight: 22,
  },
  subtitleStrong: {
    color: theme.ink,
    fontFamily: FONT.semibold,
  },
  subtitleLink: {
    color: theme.blue,
    fontFamily: FONT.semibold,
  },
  codeRow: {
    marginTop: 40,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    maxWidth: 52,
    height: 64,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: {
    borderWidth: 2,
    borderColor: theme.blue,
  },
  cellInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: 26,
    color: theme.ink,
    padding: 0,
  },
  timerRow: {
    marginTop: 28,
    alignItems: 'center',
  },
  timerText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  timerStrong: {
    fontFamily: FONT.semibold,
    color: theme.ink,
  },
  resendLink: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.blue,
  },
  errorText: {
    marginTop: 18,
    fontFamily: FONT.medium,
    fontSize: 13,
    color: '#c0392b',
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 24,
  },
});
