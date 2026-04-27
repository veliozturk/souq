import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { BoltIcon } from '../../components/icons';
import { useListing, useListingStats } from '../../api/queries';
import { demoHue } from '../../utils/demoHue';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'ListingAdmin'>;

const SECONDARY_BTNS = [
  { label: 'Pause', color: theme.ink },
  { label: 'Mark sold', color: theme.ink },
  { label: 'Delete', color: '#C53030' },
];

export default function ListingAdmin({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { id } = route.params;
  const { data: listing } = useListing(id);
  const { data: stats } = useListingStats(id);

  const title = listing?.title.original ?? '';
  const priceAed = listing?.priceAed;
  const status = listing?.status?.toUpperCase() ?? 'ACTIVE';

  const statCards = stats
    ? [
        { k: 'VIEWS', v: String(stats.totals.views), sub: `+${stats.totals.viewsTodayDelta} today` },
        { k: 'SAVES', v: String(stats.totals.saves), sub: `${stats.totals.savesRatePct}% rate` },
        { k: 'MESSAGES', v: String(stats.totals.messages), sub: `${stats.totals.unreadMessages} unread`, hi: true },
      ]
    : [];

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={s.headerTitle}>Listing</Text>
        <Pressable style={s.shareBtn}>
          <Text style={s.shareBtnText}>Share</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.summary}>
          <View style={[s.thumb, { backgroundColor: demoHue(id) }]} />
          <View style={{ flex: 1 }}>
            <View style={s.statusBadge}>
              <Text style={s.statusBadgeText}>● {status}</Text>
            </View>
            <Text style={s.title}>{title}</Text>
            {priceAed != null ? (
              <Text style={s.price}>AED {priceAed.toLocaleString()}</Text>
            ) : null}
          </View>
        </View>

        {statCards.length > 0 ? (
          <View style={s.statGrid}>
            {statCards.map((st) => (
              <View
                key={st.k}
                style={[s.statCard, st.hi ? s.statCardHi : s.statCardDefault]}>
                <Text
                  style={[
                    s.statKey,
                    st.hi ? s.statKeyHi : null,
                  ]}>
                  {st.k}
                </Text>
                <Text
                  style={[
                    s.statValue,
                    st.hi ? s.statValueHi : null,
                  ]}>
                  {st.v}
                </Text>
                <Text
                  style={[
                    s.statSub,
                    st.hi ? s.statSubHi : null,
                  ]}>
                  {st.sub}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {stats?.views7d.length ? (
          <View style={s.chartCard}>
            <View style={s.chartHeader}>
              <Text style={s.chartLabel}>VIEWS · LAST 7 DAYS</Text>
              <Text style={s.chartLink}>Details</Text>
            </View>
            <View style={s.chart}>
              {stats.views7d.map((d, i) => (
                <View key={i} style={s.chartCol}>
                  <View
                    style={[
                      s.bar,
                      {
                        height: d.count * 1.5,
                        backgroundColor: d.isToday ? theme.orange : theme.blue,
                        opacity: d.isToday ? 1 : 0.85,
                      },
                    ]}
                  />
                  <Text style={s.dayLabel}>{d.dayLabel}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={s.primaryRow}>
          <Pressable style={s.boostBtn}>
            <BoltIcon size={14} color="#fff" />
            <Text style={s.boostBtnText}>Boost · 50 AED</Text>
          </Pressable>
          <Pressable style={s.editBtn}>
            <Text style={s.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        <View style={s.secondaryRow}>
          {SECONDARY_BTNS.map((b) => (
            <Pressable key={b.label} style={s.secondaryBtn}>
              <Text style={[s.secondaryBtnText, { color: b.color }]}>{b.label}</Text>
            </Pressable>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  shareBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  shareBtnText: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.blue,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  summary: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: 14,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#10B98122',
  },
  statusBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#058A5C',
    letterSpacing: 0.6,
  },
  title: {
    marginTop: 6,
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.ink,
    lineHeight: 21,
  },
  price: {
    marginTop: 4,
    fontFamily: FONT.bold,
    fontSize: 18,
    color: theme.blue,
  },
  statGrid: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statCardDefault: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  statCardHi: {
    backgroundColor: theme.orange,
  },
  statKey: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: theme.inkDim,
  },
  statKeyHi: {
    color: '#fff',
    opacity: 0.85,
  },
  statValue: {
    marginTop: 2,
    fontFamily: FONT.bold,
    fontSize: 22,
    letterSpacing: -0.4,
    color: theme.ink,
  },
  statValueHi: {
    color: '#fff',
  },
  statSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  statSubHi: {
    color: '#fff',
    opacity: 0.85,
  },
  chartCard: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  chartLabel: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.inkDim,
    letterSpacing: 0.7,
  },
  chartLink: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
  chart: {
    marginTop: 12,
    height: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  dayLabel: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: theme.inkDim,
  },
  primaryRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  boostBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  boostBtnText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#fff',
  },
  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.ink,
  },
  secondaryRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: FONT.medium,
    fontSize: 13,
  },
});
