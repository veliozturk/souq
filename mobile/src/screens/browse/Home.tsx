import { ActivityIndicator, Image, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../../theme';
import { useCategories, useListings, useMe } from '../../api/queries';
import { demoHue } from '../../utils/demoHue';
import {
  PinIcon,
  ChevronDownIcon,
  BellIcon,
  SearchIcon,
  HeartIcon,
  FilterBarsIcon,
} from '../../components/icons';
import type { BrowseStackParamList, MainTabsParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BrowseStackParamList, 'BrowseHome'>,
  BottomTabScreenProps<MainTabsParamList>
>;

export default function BrowseHome({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const categoriesQ = useCategories();
  const listingsQ = useListings({ limit: 6 });
  const { data: me } = useMe();
  const location = me?.homeNeighborhood?.name.en ?? 'Dubai';

  return (
    <View style={s.root}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.eyebrow}>BROWSING</Text>
            <View style={s.locationRow}>
              <PinIcon size={12} />
              <Text style={s.location}>{location}</Text>
              <ChevronDownIcon size={10} />
            </View>
          </View>
          <View style={s.bellWrap}>
            <BellIcon size={16} />
            <View style={s.bellDot} />
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('CategoryResults', { query: 'armchair' })}
          style={s.searchBtn}>
          <SearchIcon size={15} />
          <Text style={s.searchText}>Search items, brands, categories</Text>
          <View style={s.searchIconBtn}>
            <FilterBarsIcon size={14} />
          </View>
        </Pressable>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.catsRow}>
          {(categoriesQ.data ?? []).map((c, i) => {
            const active = i === 0;
            const hue = demoHue(c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => navigation.navigate('CategoryResults', { query: c.name.en.toLowerCase() })}
                style={s.cat}>
                <View
                  style={[
                    s.catTile,
                    { backgroundColor: hue },
                    active && { borderColor: theme.orange, borderWidth: 2 },
                  ]}>
                  <View style={s.catTileTint} />
                  <View style={s.catTileInner} />
                </View>
                <Text style={[s.catLabel, active && { color: theme.orange }]}>{c.name.en}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={s.bannerWrap}>
          <LinearGradient
            colors={[theme.blue, theme.blue, theme.orange]}
            locations={[0, 0.55, 1.3]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 0.7 }}
            style={s.banner}>
            <View style={s.bannerCircle1} />
            <View style={s.bannerCircle2} />
            <View>
              <Text style={s.bannerEyebrow}>RAMADAN CLEARANCE</Text>
              <Text style={s.bannerTitle}>Up to 60% off in{'\n'}your neighbourhood</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Near you</Text>
          <Text style={s.seeAll}>See all</Text>
        </View>

        {listingsQ.isPending ? (
          <View style={s.statusBox}>
            <ActivityIndicator color={theme.blue} />
          </View>
        ) : listingsQ.isError ? (
          <View style={s.statusBox}>
            <Text style={s.statusText}>Couldn't load listings.</Text>
            <Pressable onPress={() => listingsQ.refetch()} style={s.retryBtn}>
              <Text style={s.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View style={s.grid}>
            {(listingsQ.data ?? []).map((it) => {
              const hue = demoHue(it.id);
              const thumb = it.coverPhoto?.thumbUrl ?? it.coverPhoto?.url ?? null;
              return (
                <Pressable
                  key={it.id}
                  onPress={() => navigation.navigate('ItemDetail', { id: it.id })}
                  style={s.cardOuter}>
                  <View style={s.card}>
                    <View style={[s.cardImage, { backgroundColor: hue }]}>
                      {thumb ? (
                        <Image source={{ uri: thumb }} style={StyleSheet.absoluteFill} />
                      ) : null}
                      {it.isBoosted ? (
                        <View style={[s.badge, { backgroundColor: theme.orange }]}>
                          <Text style={s.badgeText}>BOOSTED</Text>
                        </View>
                      ) : null}
                      <View style={s.heartBtn}>
                        <HeartIcon size={14} color={theme.ink} />
                      </View>
                    </View>
                    <View style={s.cardBody}>
                      <Text style={s.cardPrice}>AED {it.priceAed.toLocaleString()}</Text>
                      <Text style={s.cardTitle} numberOfLines={1}>
                        {it.title.en}
                      </Text>
                      <Text style={s.cardLoc}>{it.neighborhood.name.en}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.ink,
    letterSpacing: -0.3,
  },
  bellWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.orange,
    borderWidth: 2,
    borderColor: theme.surface,
  },
  searchBtn: {
    marginTop: 12,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  searchIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  catsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 14,
  },
  cat: {
    alignItems: 'center',
    gap: 6,
  },
  catTile: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  catTileTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  catTileInner: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  catLabel: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.ink,
  },
  bannerWrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
  },
  banner: {
    height: 92,
    borderRadius: 16,
    paddingHorizontal: 18,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bannerCircle1: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bannerCircle2: {
    position: 'absolute',
    right: 20,
    bottom: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.orange,
    opacity: 0.5,
  },
  bannerEyebrow: {
    fontFamily: FONT.bold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: '#fff',
    opacity: 0.85,
  },
  bannerTitle: {
    fontFamily: FONT.bold,
    fontSize: 19,
    letterSpacing: -0.3,
    color: '#fff',
    marginTop: 2,
    lineHeight: 22,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: theme.ink,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
  grid: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardOuter: {
    width: '50%',
    padding: 5,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: 'hidden',
  },
  cardImage: {
    aspectRatio: 1,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  badgeText: {
    fontFamily: FONT.bold,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#fff',
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 8,
    paddingHorizontal: 10,
  },
  cardPrice: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.blue,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: theme.ink,
    marginTop: 2,
  },
  cardLoc: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: theme.inkDim,
    marginTop: 2,
  },
  statusBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
  retryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
  },
  retryText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
});
