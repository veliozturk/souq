import { useState } from 'react';
import { Image, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { SearchIcon, MoreDotsIcon } from '../../components/icons';
import { useMe, useMyListings } from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import { demoHue } from '../../utils/demoHue';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'MyListings'>;

type TabId = 'active' | 'paused' | 'sold';

export default function MyListings({ navigation }: Props) {
  const [tab, setTab] = useState<TabId>('active');
  const insets = useSafeAreaInsets();

  const { data: me } = useMe();
  const { data: listings = [] } = useMyListings(tab);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'active', label: `Active · ${me?.counts.activeListings ?? '—'}` },
    { id: 'paused', label: `Inactive · ${me?.counts.inactiveListings ?? '—'}` },
    { id: 'sold', label: `Sold · ${me?.counts.soldListings ?? '—'}` },
  ];

  const stats = [
    { k: 'ACTIVE', v: String(me?.counts.activeListings ?? '—'), c: theme.blue },
    { k: 'VIEWS 7D', v: me ? String(me.sellerStats.views7d) : '—', c: theme.ink },
    { k: 'EARNED', v: me ? `AED ${me.sellerStats.earnedAed.toLocaleString()}` : '—', c: theme.orange },
  ];

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <BackBtn onPress={() => navigation.goBack()} />
          <Text style={s.headerTitle}>My listings</Text>
          <View style={s.searchBtn}>
            <SearchIcon size={16} color={theme.ink} />
          </View>
        </View>

        <View style={s.statsRow}>
          {stats.map((st) => (
            <View key={st.k} style={s.statCard}>
              <Text style={s.statKey}>{st.k}</Text>
              <Text style={[s.statValue, { color: st.c }]}>{st.v}</Text>
            </View>
          ))}
        </View>

        <View style={s.tabs}>
          {tabs.map((tb) => {
            const on = tb.id === tab;
            return (
              <Pressable key={tb.id} onPress={() => setTab(tb.id)} style={s.tab}>
                <Text style={[s.tabText, on && s.tabTextOn]}>{tb.label}</Text>
                {on ? <View style={s.tabUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
        {listings.map((l) => (
          <Pressable
            key={l.id}
            onPress={() => navigation.navigate('ListingAdmin', { id: l.id })}
            style={s.row}>
            <View style={[s.thumb, { backgroundColor: demoHue(l.id) }]}>
              {l.coverPhoto ? (
                <Image
                  source={{ uri: photoUri(l.coverPhoto.thumbUrl ?? l.coverPhoto.url) }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              {l.isBoosted ? (
                <View style={s.boostBadge}>
                  <Text style={s.boostBadgeText}>BOOSTED</Text>
                </View>
              ) : null}
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.title} numberOfLines={1}>
                {l.title.original}
              </Text>
              <Text style={s.price}>AED {l.priceAed.toLocaleString()}</Text>
              <View style={s.metaRow}>
                <Text style={s.meta}>{l.sellerStats?.viewsCount ?? 0} views</Text>
                <Text style={s.meta}>{l.sellerStats?.messagesCount ?? 0} messages</Text>
                {l.sellerStats && l.sellerStats.pendingOffersCount > 0 ? (
                  <Text style={s.metaOffers}>● {l.sellerStats.pendingOffersCount} offers</Text>
                ) : null}
              </View>
            </View>
            <View style={s.moreBtn}>
              <MoreDotsIcon size={14} color={theme.inkDim} />
            </View>
          </Pressable>
        ))}
        {listings.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyText}>
              {tab === 'active'
                ? 'No active listings yet.'
                : tab === 'paused'
                  ? 'No inactive listings right now.'
                  : 'Your sold items will appear here.'}
            </Text>
          </View>
        )}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 24,
    color: theme.ink,
    letterSpacing: -0.5,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.line,
  },
  statKey: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.inkDim,
    letterSpacing: 0.6,
  },
  statValue: {
    marginTop: 2,
    fontFamily: FONT.bold,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  tabs: {
    marginTop: 16,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
  },
  tab: {
    paddingVertical: 10,
    marginRight: 24,
    position: 'relative',
  },
  tabText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: theme.inkDim,
  },
  tabTextOn: {
    fontFamily: FONT.bold,
    color: theme.ink,
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: theme.orange,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 10,
  },
  row: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    overflow: 'hidden',
  },
  boostBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: theme.orange,
  },
  boostBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 9,
    color: '#fff',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.ink,
  },
  price: {
    marginTop: 3,
    fontFamily: FONT.bold,
    fontSize: 15,
    color: theme.blue,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  metaOffers: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: theme.orange,
  },
  moreBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
});
