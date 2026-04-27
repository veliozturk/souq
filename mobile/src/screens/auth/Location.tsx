import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { CrosshairIcon, MapPinIcon, CheckIcon } from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Location'>;

const NEIGHBOURHOODS = [
  { name: 'Dubai Marina', sub: '2.1 km away · 4,280 items' },
  { name: 'Downtown Dubai', sub: '5.4 km · 6,120 items' },
  { name: 'Jumeirah', sub: '3.8 km · 2,940 items' },
  { name: 'Business Bay', sub: '4.1 km · 3,550 items' },
  { name: 'JBR', sub: '1.9 km · 1,870 items' },
];

export default function LocationScreen({ navigation }: Props) {
  const { signupLocation, setSignupLocation } = useAuthStub();
  const insets = useSafeAreaInsets();

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
          {NEIGHBOURHOODS.map((h) => {
            const selected = signupLocation === h.name;
            return (
              <Pressable
                key={h.name}
                onPress={() => setSignupLocation(h.name)}
                style={[s.row, selected && s.rowSelected]}>
                <View style={[s.rowIcon, { backgroundColor: selected ? theme.orange : theme.blueSoft }]}>
                  <MapPinIcon
                    size={16}
                    color={selected ? '#fff' : theme.blue}
                    innerColor={selected ? theme.orange : '#fff'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowName}>{h.name}</Text>
                  <Text style={s.rowSub}>{h.sub}</Text>
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
        <PrimaryBtn onPress={() => navigation.navigate('Success')} disabled={!signupLocation}>
          Continue
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
  rowSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
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
});
