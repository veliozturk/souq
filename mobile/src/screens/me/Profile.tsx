import { ReactNode } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../../theme';
import {
  ListingsIcon,
  OfferDiamondIcon,
  WalletIcon,
  HeartIcon,
  ReceiptIcon,
  BellIcon,
  MapPinSmallIcon,
  ShieldIcon,
  HelpIcon,
  ChevronRightIcon,
} from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import { useMe } from '../../api/queries';
import type {
  MeStackParamList,
  MainTabsParamList,
} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<MeStackParamList, 'MeProfile'>,
  BottomTabScreenProps<MainTabsParamList>
>;

type Row = {
  label: string;
  right?: string;
  rightColor?: string;
  hi?: boolean;
  icon: ReactNode;
  iconBg: string;
  onPress?: () => void;
};

export default function MeProfile({ navigation }: Props) {
  const { signOut } = useAuthStub();
  const insets = useSafeAreaInsets();
  const { data: me } = useMe();

  const display = me?.displayName ?? '';
  const initial = me?.avatarInitial ?? display.trim().charAt(0).toUpperCase() ?? '';
  const handle = me ? `@${me.handle}` : '';
  const ratingLine =
    me?.ratingAvg != null
      ? `${handle} · ★ ${me.ratingAvg} · ${me.soldCount} sold`
      : handle;
  const locationLabel = me?.homeNeighborhood?.name.en.toUpperCase() ?? '';

  const groups: { header: string; rows: Row[] }[] = [
    {
      header: 'SELLING',
      rows: [
        {
          label: 'My listings',
          right: me ? `${me.counts.activeListings} active` : '',
          icon: <ListingsIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
          onPress: () => navigation.navigate('MyListings'),
        },
        {
          label: 'Offers',
          right: me && me.counts.unreadOffers > 0 ? `${me.counts.unreadOffers} new` : '',
          hi: !!me && me.counts.unreadOffers > 0,
          icon: <OfferDiamondIcon size={16} color={theme.orange} />,
          iconBg: theme.orangeSoft,
          onPress: () => navigation.getParent<any>()?.navigate('InboxTab', { screen: 'Offers' }),
        },
        {
          label: 'Wallet',
          right: me ? `${me.walletBalanceAed.toLocaleString()} AED` : '',
          icon: <WalletIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
      ],
    },
    {
      header: 'BUYING',
      rows: [
        {
          label: 'Saved items',
          right: me ? String(me.counts.savedItems) : '',
          icon: <HeartIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
          onPress: () => navigation.getParent<any>()?.navigate('SavedTab'),
        },
        {
          label: 'Purchase history',
          icon: <ReceiptIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
      ],
    },
    {
      header: 'ACCOUNT',
      rows: [
        {
          label: 'Notifications',
          icon: <BellIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
        {
          label: me?.homeNeighborhood ? `Location · ${me.homeNeighborhood.name.en}` : 'Location',
          icon: <MapPinSmallIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
        {
          label: 'Verification',
          right: me?.isVerified ? '✓ Verified' : undefined,
          rightColor: theme.success,
          icon: <ShieldIcon size={14} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
        {
          label: 'Help & support',
          icon: <HelpIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
        },
        {
          label: 'Sign out',
          icon: <HelpIcon size={16} color={theme.blue} />,
          iconBg: theme.blueSoft,
          onPress: signOut,
        },
      ],
    },
  ];

  return (
    <View style={s.root}>
      <ScrollView style={s.flex} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[theme.blue, theme.blue, theme.orange]}
          locations={[0, 0.7, 2.2]}
          style={[s.hero, { paddingTop: insets.top + 12 }]}>
          <View style={s.heroCircle} />
          <View style={s.heroRow}>
            <LinearGradient
              colors={[theme.blueSoft, theme.orangeSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.avatar}>
              <Text style={s.avatarText}>{initial}</Text>
            </LinearGradient>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.name} numberOfLines={1}>
                {display}
              </Text>
              {ratingLine ? <Text style={s.handle}>{ratingLine}</Text> : null}
              {me?.isVerified && locationLabel ? (
                <View style={s.verifyBadge}>
                  <Text style={s.verifyBadgeText}>
                    ✓ ID VERIFIED · {locationLabel}
                  </Text>
                </View>
              ) : null}
            </View>
            <Pressable style={s.editBtn}>
              <Text style={s.editBtnText}>Edit</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={s.groups}>
          {groups.map((g) => (
            <View key={g.header} style={s.group}>
              <Text style={s.groupHeader}>{g.header}</Text>
              <View style={s.groupCard}>
                {g.rows.map((r, ri) => (
                  <Pressable
                    key={r.label}
                    onPress={r.onPress}
                    style={[s.row, ri < g.rows.length - 1 && s.rowDivider]}>
                    <View style={[s.rowIcon, { backgroundColor: r.iconBg }]}>{r.icon}</View>
                    <Text style={s.rowLabel}>{r.label}</Text>
                    {r.right ? (
                      <Text
                        style={[
                          s.rowRight,
                          r.hi && s.rowRightHi,
                          r.rightColor ? { color: r.rightColor } : null,
                        ]}>
                        {r.right}
                      </Text>
                    ) : null}
                    <ChevronRightIcon size={7} color={theme.inkDim} />
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  flex: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontFamily: FONT.bold,
    fontSize: 22,
    color: theme.blue,
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: 19,
    color: '#fff',
    letterSpacing: -0.3,
  },
  handle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
  },
  verifyBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  verifyBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  editBtnText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: '#fff',
  },
  groups: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  group: {
    marginBottom: 18,
  },
  groupHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    fontFamily: FONT.bold,
    fontSize: 11,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  groupCard: {
    marginHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 14,
    color: theme.ink,
  },
  rowRight: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: theme.inkDim,
  },
  rowRightHi: {
    fontFamily: FONT.bold,
    color: theme.orange,
  },
});
