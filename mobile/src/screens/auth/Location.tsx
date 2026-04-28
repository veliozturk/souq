import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { CrosshairIcon, MapPinIcon, CheckIcon } from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import { useNeighborhoods } from '../../api/queries';
import { register } from '../../api/auth';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Location'>;

export default function LocationScreen({ navigation }: Props) {
  const { signupDraft, setSignupDraft, setPendingUser } = useAuthStub();
  const { data: neighborhoods = [] } = useNeighborhoods();
  const insets = useSafeAreaInsets();
  const signupLocation = signupDraft.neighborhoodName;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onContinue = async () => {
    if (submitting) return;
    const { phone, firstName, lastName, handle, neighborhoodId } = signupDraft;
    if (!phone || !firstName || !lastName || !handle || !neighborhoodId) {
      setError('Missing fields — please go back and complete the form.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await register({ phone, firstName, lastName, handle, neighborhoodId });
      setPendingUser(result.user);
      navigation.navigate('Success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader step={3} onBack={() => navigation.goBack()} onSkip={() => navigation.navigate('Success')} />
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Where are{'\n'}you based?</Text>
        <Text style={s.subtitle}>We'll show you items and buyers close by.</Text>

        <View style={s.useLocBtn}>
          <CrosshairIcon size={20} color={theme.blue} />
          <Text style={s.useLocText}>Use my current location</Text>
        </View>

        <Text style={s.section}>POPULAR IN DUBAI</Text>

        <View style={s.list}>
          {neighborhoods.map((h) => {
            const name = h.name.en;
            const selected = signupLocation === name;
            return (
              <Pressable
                key={h.id}
                onPress={() => setSignupDraft({ neighborhoodId: h.id, neighborhoodName: name })}
                style={[s.row, selected && s.rowSelected]}>
                <View style={[s.rowIcon, { backgroundColor: selected ? theme.orange : theme.blueSoft }]}>
                  <MapPinIcon
                    size={16}
                    color={selected ? '#fff' : theme.blue}
                    innerColor={selected ? theme.orange : '#fff'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowName}>{name}</Text>
                </View>
                {selected ? (
                  <View style={s.rowCheck}>
                    <CheckIcon size={12} color="#fff" />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        {error ? <Text style={s.errorText}>{error}</Text> : null}
        <PrimaryBtn onPress={onContinue} disabled={!signupLocation || submitting}>
          {submitting ? 'Creating account…' : 'Continue'}
        </PrimaryBtn>
      </View>
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
  useLocBtn: {
    marginTop: 22,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.blueSoft,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
  },
  useLocText: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.blue,
  },
  section: {
    marginTop: 22,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  list: {
    marginTop: 10,
    gap: 8,
  },
  row: {
    height: 60,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  rowSelected: {
    borderWidth: 2,
    borderColor: theme.orange,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowName: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  rowCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    paddingHorizontal: 24,
  },
  errorText: {
    marginBottom: 12,
    fontFamily: FONT.medium,
    fontSize: 13,
    color: '#c0392b',
    textAlign: 'center',
  },
});
