import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { FieldLabel } from '../../components/FieldLabel';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { ChevronDownIcon, LockIcon, UAEFlag } from '../../components/icons';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Phone'>;

export default function Phone({ navigation }: Props) {
  const [digits, setDigits] = useState('50 123 4567');
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader step={0} onBack={() => navigation.goBack()} onSkip={() => navigation.navigate('OTP', { phone: '+971 50 123 4567' })} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={s.title}>What's your{'\n'}mobile number?</Text>
          <Text style={s.subtitle}>We'll send a one-time code to verify your account.</Text>

          <View style={s.fieldWrap}>
            <FieldLabel>Mobile number</FieldLabel>
            <View style={s.row}>
              <View style={s.cc}>
                <UAEFlag width={24} height={16} />
                <Text style={s.ccText}>+971</Text>
                <ChevronDownIcon size={10} color={theme.inkDim} />
              </View>
              <View style={s.input}>
                <TextInput
                  value={digits}
                  onChangeText={setDigits}
                  keyboardType="phone-pad"
                  selectionColor={theme.orange}
                  style={s.inputText}
                />
              </View>
            </View>
            <View style={s.helperRow}>
              <LockIcon size={16} color={theme.blue} />
              <Text style={s.helperText}>
                Your number stays private. Buyers message you through the app.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
          <PrimaryBtn onPress={() => navigation.navigate('OTP', { phone: '+971 ' + digits })}>
            Send code
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
  fieldWrap: {
    marginTop: 34,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  cc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  ccText: {
    fontFamily: FONT.semibold,
    fontSize: 17,
    color: theme.ink,
  },
  input: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  inputText: {
    fontFamily: FONT.medium,
    fontSize: 20,
    color: theme.ink,
    letterSpacing: 0.3,
    padding: 0,
  },
  helperRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  helperText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    lineHeight: 19,
  },
  actions: {
    paddingHorizontal: 24,
  },
});
