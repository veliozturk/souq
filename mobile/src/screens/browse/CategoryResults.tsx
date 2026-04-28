import { ActivityIndicator, Image, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { useFavoriteToggle, useListings } from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import { demoHue } from '../../utils/demoHue';
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  SearchIcon,
  HeartIcon,
  PinIcon,
  FilterIcon,
} from '../../components/icons';
import type { BrowseStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'CategoryResults'>;

type Filter = { l: string; active?: boolean; icon?: boolean };

const FILTERS: Filter[] = [
  { l: 'Filters', icon: true },
  { l: 'Marina', active: true },
  { l: 'Under 1,500', active: true },
  { l: 'Like new' },
  { l: 'Delivery' },
];

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function CategoryResults({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { query, categoryId, label } = route.params ?? {};
  const listingsQ = useListings(categoryId ? { categoryId } : { q: query ?? '' });
  const items = listingsQ.data ?? [];
  const headerText = label ?? query ?? '';
  const { isFavorite, toggle } = useFavoriteToggle();

  return (
    <View style={s.root}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 8 }]}>
        <View style={s.searchRow}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          <View style={s.searchInput}>
            <SearchIcon size={13} />
            <Text style={s.searchText}>{headerText}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}>
          {FILTERS.map((f) => {
            const isFiltersBtn = !!f.icon;
            const bg = isFiltersBtn ? theme.blue : f.active ? theme.orangeSoft : theme.surface;
            const fg = isFiltersBtn ? '#fff' : f.active ? theme.orange : theme.ink;
            return (
              <View
                key={f.l}
                style={[
                  s.filterChip,
                  { backgroundColor: bg },
                  !isFiltersBtn && !f.active && s.filterChipBorder,
                ]}>
                {isFiltersBtn ? <FilterIcon size={10} color="#fff" /> : null}
                <Text style={[s.filterText, { color: fg }]}>{f.l}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={s.metaRow}>
          <Text style={s.metaText}>
            <Text style={s.metaCount}>{items.length}</Text> items
          </Text>
          <View style={s.sortRow}>
            <Text style={s.sortText}>Sort: Closest first</Text>
            <ChevronDownIcon size={8} color={theme.blue} />
          </View>
        </View>
      </View>

      {listingsQ.isPending ? (
        <View style={s.statusBox}>
          <ActivityIndicator color={theme.blue} />
        </View>
      ) : listingsQ.isError ? (
        <View style={s.statusBox}>
          <Text style={s.statusText}>Couldn't load results.</Text>
          <Pressable onPress={() => listingsQ.refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : items.length === 0 ? (
        <View style={s.statusBox}>
          <Text style={s.statusText}>No matches for "{headerText}".</Text>
        </View>
      ) : (
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}>
          {items.map((it, i) => {
            const hue = demoHue(it.id);
            const thumb = it.coverPhoto?.thumbUrl ?? it.coverPhoto?.url ?? null;
            return (
              <Pressable
                key={it.id}
                onPress={() => navigation.navigate('ItemDetail', { id: it.id })}
                style={[s.row, i === 0 && s.rowFeatured]}>
                <View style={[s.rowImg, { backgroundColor: hue }]}>
                  {thumb ? (
                    <Image source={{ uri: photoUri(thumb) }} style={StyleSheet.absoluteFill} />
                  ) : null}
                  {it.isBoosted ? (
                    <View style={[s.newBadge, { backgroundColor: theme.orange }]}>
                      <Text style={s.newBadgeText}>BOOSTED</Text>
                    </View>
                  ) : null}
                </View>
                <View style={s.rowBody}>
                  <View style={s.priceRow}>
                    <Text style={s.price}>AED {it.priceAed.toLocaleString()}</Text>
                    {it.previousPriceAed ? (
                      <Text style={s.was}>{it.previousPriceAed.toLocaleString()}</Text>
                    ) : null}
                  </View>
                  <Text style={s.title} numberOfLines={2}>
                    {it.title.en}
                  </Text>
                  <View style={s.locRow}>
                    <PinIcon size={10} color={theme.inkDim} />
                    <Text style={s.loc}>
                      {it.neighborhood.name.en} · {timeAgo(it.publishedAt)}
                    </Text>
                  </View>
                  <View style={s.sellerRow}>
                    <Text style={s.seller}>@{it.seller.handle}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => toggle(it)}
                  hitSlop={8}
                  style={s.rowHeart}>
                  <HeartIcon
                    size={18}
                    color={isFavorite(it.id) ? theme.orange : theme.inkDim}
                    filled={isFavorite(it.id)}
                  />
                </Pressable>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
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
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchText: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.ink,
  },
  filterRow: {
    paddingTop: 12,
    gap: 6,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterChipBorder: {
    borderWidth: 1,
    borderColor: theme.line,
  },
  filterText: {
    fontFamily: FONT.bold,
    fontSize: 11,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  metaCount: {
    fontFamily: FONT.bold,
    color: theme.ink,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.line,
  },
  rowFeatured: {
    borderColor: theme.blue,
    borderWidth: 1.5,
  },
  rowImg: {
    width: 96,
    height: 96,
    borderRadius: 11,
    overflow: 'hidden',
  },
  newBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: theme.blue,
  },
  newBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 9,
    color: '#fff',
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.blue,
    letterSpacing: -0.3,
  },
  was: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
    textDecorationLine: 'line-through',
  },
  title: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.ink,
    marginTop: 2,
    lineHeight: 17,
  },
  locRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loc: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  sellerRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seller: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  offerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: theme.orangeSoft,
  },
  offerBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 9,
    color: theme.orange,
    letterSpacing: 0.4,
  },
  rowHeart: {
    alignSelf: 'flex-start',
  },
  statusBox: {
    paddingVertical: 40,
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
