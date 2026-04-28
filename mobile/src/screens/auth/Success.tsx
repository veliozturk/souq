import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, FONT } from '../../theme';
import { Progress } from '../../components/Progress';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { SecondaryBtn } from '../../components/SecondaryBtn';
import { useAuthStub } from '../../auth/AuthStub';
import { useAppConfig } from '../../api/queries';

function SuccessIllo({ size = 180 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180">
      <Circle cx="90" cy="90" r="78" fill={theme.orangeSoft} />
      <Circle cx="90" cy="90" r="54" fill={theme.orange} />
      <Path
        d="M68 92l14 14 32-32"
        stroke="#fff"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <G transform="rotate(20 28 44)">
        <Rect x="24" y="40" width="8" height="8" rx="2" fill={theme.blue} />
      </G>
      <Circle cx="152" cy="46" r="5" fill={theme.blue} />
      <Rect x="148" y="130" width="10" height="4" rx="2" fill={theme.orange} />
      <Circle cx="32" cy="136" r="4" fill={theme.blue} opacity={0.5} />
      <Rect x="12" y="90" width="6" height="6" rx="1" fill={theme.orange} opacity={0.7} />
    </Svg>
  );
}

export default function Success() {
  const { signIn, pendingUser, signupDraft } = useAuthStub();
  const { data: appConfig } = useAppConfig();
  const insets = useSafeAreaInsets();
  const firstName =
    pendingUser?.displayName?.split(' ')[0] ||
    signupDraft.firstName?.trim() ||
    'there';
  const locationName =
    pendingUser?.homeNeighborhood?.name.en ?? signupDraft.neighborhoodName ?? 'Dubai';
  const creditLine = appConfig ? `+${appConfig.welcomeCreditAed} AED welcome credit` : 'Welcome credit';
  const onDone = () => {
    // Registration is disabled — this path is unreachable in the normal flow.
    // Kept compile-safe for when registration is re-enabled (will need sessionId from API).
    if (pendingUser) signIn(pendingUser, '');
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 12 }]}>
      <Progress step={5} total={6} />
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>
        <SuccessIllo size={180} />

        <Text style={s.title}>You're in,{'\n'}{firstName}.</Text>
        <Text style={s.subtitle}>
          You're set up in <Text style={s.subtitleStrong}>{locationName}</Text>. List your first item
          and start earning AED.
        </Text>

        <View style={s.creditCard}>
          <View style={s.creditBadge}>
            <Text style={s.creditBadgeText}>AED</Text>
          </View>
          <View>
            <Text style={s.creditTitle}>{creditLine}</Text>
            <Text style={s.creditSub}>Boost your first listing, on us.</Text>
          </View>
        </View>
      </ScrollView>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        <PrimaryBtn variant="orange" onPress={onDone}>
          List my first item
        </PrimaryBtn>
        <SecondaryBtn onPress={onDone}>Browse the market</SecondaryBtn>
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    marginTop: 32,
    fontFamily: FONT.bold,
    fontSize: 32,
    color: theme.ink,
    letterSpacing: -0.7,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 14,
    fontFamily: FONT.regular,
    fontSize: 16,
    color: theme.inkDim,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 300,
  },
  subtitleStrong: {
    color: theme.ink,
    fontFamily: FONT.semibold,
  },
  creditCard: {
    marginTop: 28,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
  },
  creditBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
    letterSpacing: -0.3,
  },
  creditTitle: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.ink,
  },
  creditSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
});
