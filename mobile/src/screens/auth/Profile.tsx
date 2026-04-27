import { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { FieldLabel } from '../../components/FieldLabel';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { CameraIcon, CheckCircleIcon } from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { signupName, setSignupName } = useAuthStub();
  const [handle, setHandle] = useState('aisha.m');
  const insets = useSafeAreaInsets();
  const initial = signupName.trim().charAt(0).toUpperCase() || 'A';
  const canContinue = signupName.trim().length > 0 && handle.trim().length > 0;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader step={2} onBack={() => navigation.goBack()} onSkip={() => navigation.navigate('Location')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Say hello,{'\n'}set a name.</Text>
          <Text style={s.subtitle}>This is how other people will see you.</Text>

          <View style={s.avatarRow}>
            <View style={s.avatarWrap}>
              <LinearGradient
                colors={[theme.blueSoft, theme.orangeSoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.avatar}>
                <Text style={s.avatarText}>{initial}</Text>
              </LinearGradient>
              <Pressable style={s.cameraBtn}>
                <CameraIcon size={16} color="#fff" />
              </Pressable>
            </View>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Full name</FieldLabel>
            <View style={s.inputFocused}>
              <TextInput
                value={signupName}
                onChangeText={setSignupName}
                selectionColor={theme.orange}
                style={s.inputText}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={s.fieldWrap2}>
            <FieldLabel>Username</FieldLabel>
            <View style={s.inputBordered}>
              <Text style={s.atPrefix}>@</Text>
              <TextInput
                value={handle}
                onChangeText={(v) => setHandle(v.replace(/\s/g, '').toLowerCase())}
                selectionColor={theme.orange}
                style={[s.inputText, { marginLeft: 2, flex: 1 }]}
                autoCapitalize="none"
              />
              <CheckCircleIcon size={18} color={theme.success} />
            </View>
            <Text style={s.available}>Available</Text>
          </View>
        </ScrollView>

        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
          <PrimaryBtn onPress={() => navigation.navigate('Location')} disabled={!canContinue}>
            Continue
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
  avatarRow: {
    marginTop: 28,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 108,
    height: 108,
    position: 'relative',
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONT.bold,
    fontSize: 40,
    color: theme.blue,
    letterSpacing: -1,
  },
  cameraBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.orange,
    borderWidth: 3,
    borderColor: theme.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldWrap: {
    marginTop: 32,
  },
  fieldWrap2: {
    marginTop: 18,
  },
  inputFocused: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  inputBordered: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  atPrefix: {
    fontFamily: FONT.regular,
    fontSize: 17,
    color: theme.inkDim,
  },
  inputText: {
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.ink,
    padding: 0,
  },
  available: {
    marginTop: 8,
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.success,
  },
  actions: {
    paddingHorizontal: 24,
  },
});
