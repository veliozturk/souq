import { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import {
  ChevronLeftIcon,
  MapPinIcon,
  CheckIcon,
  SearchIcon,
  CloseIcon,
  ChevronRightIcon,
} from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import { useNeighborhoods, useUpdateHomeNeighborhood } from '../../api/queries';
import type { BrowseStackParamList } from '../../navigation/types';
import type { Neighborhood } from '../../api/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'LocationPicker'>;

const ZONE_BY_SLUG: Record<string, string> = {
  'dubai-marina': 'marina-jbr',
  'jbr': 'marina-jbr',
  'jlt': 'marina-jbr',
  'palm-jumeirah': 'marina-jbr',
  'dubai-media-city': 'marina-jbr',
  'internet-city': 'marina-jbr',
  'barsha-heights': 'marina-jbr',
  'downtown': 'downtown-bay',
  'business-bay': 'downtown-bay',
  'difc': 'downtown-bay',
  'sheikh-zayed-road': 'downtown-bay',
  'city-walk': 'downtown-bay',
  'jumeirah': 'jumeirah-coast',
  'umm-suqeim': 'jumeirah-coast',
  'al-wasl': 'jumeirah-coast',
  'bur-dubai': 'bur-dubai',
  'karama': 'bur-dubai',
  'satwa': 'bur-dubai',
  'oud-metha': 'bur-dubai',
  'al-jaddaf': 'bur-dubai',
  'deira': 'deira-northeast',
  'al-rigga': 'deira-northeast',
  'al-mamzar': 'deira-northeast',
  'al-qusais': 'deira-northeast',
  'al-nahda': 'deira-northeast',
  'dubai-hills-estate': 'hills-mbr',
  'mbr-city': 'hills-mbr',
  'meydan': 'hills-mbr',
  'al-quoz': 'hills-mbr',
  'jvc': 'jvc-furjan',
  'jvt': 'jvc-furjan',
  'al-furjan': 'jvc-furjan',
  'discovery-gardens': 'jvc-furjan',
  'motor-city': 'jvc-furjan',
  'mirdif': 'mirdif-east',
  'al-warqa': 'mirdif-east',
  'international-city': 'mirdif-east',
  'festival-city': 'mirdif-east',
  'creek-harbour': 'mirdif-east',
  'dubai-south': 'dubai-south',
  'expo-city': 'dubai-south',
  'dip': 'dubai-south',
};

type ZoneDef = { key: string; name: { en: string; ar: string }; sortOrder: number };

const ZONES: ZoneDef[] = [
  { key: 'marina-jbr', name: { en: 'Marina & JBR', ar: 'المرسى وجي بي آر' }, sortOrder: 1 },
  { key: 'downtown-bay', name: { en: 'Downtown & Business Bay', ar: 'وسط المدينة وخليج الأعمال' }, sortOrder: 2 },
  { key: 'jumeirah-coast', name: { en: 'Jumeirah Coast', ar: 'ساحل جميرا' }, sortOrder: 3 },
  { key: 'bur-dubai', name: { en: 'Bur Dubai', ar: 'بر دبي' }, sortOrder: 4 },
  { key: 'deira-northeast', name: { en: 'Deira & Northeast', ar: 'ديرة والمنطقة الشمالية الشرقية' }, sortOrder: 5 },
  { key: 'hills-mbr', name: { en: 'Dubai Hills & MBR City', ar: 'دبي هيلز ومدينة محمد بن راشد' }, sortOrder: 6 },
  { key: 'jvc-furjan', name: { en: 'JVC/JVT & Al Furjan', ar: 'الضاحية الدائرية والفرجان' }, sortOrder: 7 },
  { key: 'mirdif-east', name: { en: 'Mirdif & East', ar: 'مردف والشرق' }, sortOrder: 8 },
  { key: 'dubai-south', name: { en: 'Dubai South', ar: 'دبي الجنوب' }, sortOrder: 9 },
];

const OTHER_ZONE: ZoneDef = {
  key: 'other',
  name: { en: 'Other areas', ar: 'مناطق أخرى' },
  sortOrder: 99,
};

export default function LocationPicker({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuthStub();
  const { data: neighborhoods = [] } = useNeighborhoods();
  const updateHomeNeighborhood = useUpdateHomeNeighborhood();
  const selectedId = currentUser?.homeNeighborhood?.id ?? null;

  const [searchActive, setSearchActive] = useState(false);
  const [query, setQuery] = useState('');
  const [expandedZones, setExpandedZones] = useState<Set<string>>(() => new Set());

  const popular = neighborhoods.slice(0, 6);

  const zoneGroups = useMemo(() => {
    const byKey = new Map<string, Neighborhood[]>();
    for (const n of neighborhoods) {
      const key = ZONE_BY_SLUG[n.slug] ?? OTHER_ZONE.key;
      const list = byKey.get(key) ?? [];
      list.push(n);
      byKey.set(key, list);
    }
    const ordered: { zone: ZoneDef; items: Neighborhood[] }[] = [];
    for (const z of ZONES) {
      const items = byKey.get(z.key);
      if (items && items.length > 0) ordered.push({ zone: z, items });
    }
    const others = byKey.get(OTHER_ZONE.key);
    if (others && others.length > 0) ordered.push({ zone: OTHER_ZONE, items: others });
    return ordered;
  }, [neighborhoods]);

  const trimmed = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!trimmed) return [];
    return neighborhoods.filter((n) => {
      const en = (n.name.en ?? '').toLowerCase();
      const ar = n.name.ar ?? '';
      return en.includes(trimmed) || ar.includes(query.trim());
    });
  }, [neighborhoods, trimmed, query]);

  const onPickNeighborhood = (h: Neighborhood) => {
    updateHomeNeighborhood({ id: h.id, slug: h.slug, name: h.name });
    navigation.goBack();
  };

  const toggleZone = (key: string) => {
    setExpandedZones((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const openSearch = () => setSearchActive(true);
  const closeSearch = () => {
    setQuery('');
    setSearchActive(false);
  };

  const renderRow = (h: Neighborhood) => {
    const selected = h.id === selectedId;
    return (
      <Pressable
        key={h.id}
        onPress={() => onPickNeighborhood(h)}
        style={[s.row, selected && s.rowSelected]}>
        <View style={[s.rowIcon, { backgroundColor: selected ? theme.orange : theme.blueSoft }]}>
          <MapPinIcon
            size={16}
            color={selected ? '#fff' : theme.blue}
            innerColor={selected ? theme.orange : '#fff'}
          />
        </View>
        <View style={s.rowBody}>
          <Text style={s.rowName}>{h.name.en}</Text>
        </View>
        {selected ? (
          <View style={s.rowCheck}>
            <CheckIcon size={12} color="#fff" />
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={s.root}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 8 }]}>
        <View style={s.headerRow}>
          <Pressable
            onPress={() => (searchActive ? closeSearch() : navigation.goBack())}
            style={s.backBtn}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          {searchActive ? (
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search areas"
              placeholderTextColor={theme.inkDim}
              style={s.searchInput}
              returnKeyType="search"
            />
          ) : (
            <Text style={s.title}>Browsing in</Text>
          )}
          {searchActive ? (
            <Pressable onPress={closeSearch} style={s.backBtn}>
              <CloseIcon size={14} />
            </Pressable>
          ) : (
            <Pressable onPress={openSearch} style={s.backBtn}>
              <SearchIcon size={15} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {searchActive && trimmed ? (
          <>
            <Text style={s.section}>
              {filtered.length === 0
                ? 'NO MATCHES'
                : `${filtered.length} ${filtered.length === 1 ? 'AREA' : 'AREAS'}`}
            </Text>
            {filtered.map(renderRow)}
          </>
        ) : (
          <>
            <Text style={s.section}>POPULAR IN DUBAI</Text>
            {popular.map(renderRow)}

            {zoneGroups.length > 0 ? (
              <Text style={[s.section, s.sectionSpaced]}>ALL AREAS</Text>
            ) : null}
            {zoneGroups.map(({ zone, items }) => {
              const expanded = expandedZones.has(zone.key);
              return (
                <View key={zone.key} style={s.zoneGroup}>
                  <Pressable
                    onPress={() => toggleZone(zone.key)}
                    style={s.zoneHeader}>
                    <Text style={s.zoneName}>{zone.name.en}</Text>
                    <Text style={s.zoneCount}>({items.length})</Text>
                    <View style={s.zoneSpacer} />
                    <View style={[s.zoneChevron, expanded && s.zoneChevronOpen]}>
                      <ChevronRightIcon size={8} color={theme.inkDim} />
                    </View>
                  </Pressable>
                  {expanded ? <View style={s.zoneItems}>{items.map(renderRow)}</View> : null}
                </View>
              );
            })}
          </>
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
  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
  title: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.ink,
    letterSpacing: -0.3,
  },
  searchInput: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    paddingHorizontal: 14,
    fontFamily: FONT.medium,
    fontSize: 15,
    color: theme.ink,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  section: {
    marginTop: 4,
    marginBottom: 4,
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  sectionSpaced: {
    marginTop: 16,
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
  rowBody: {
    flex: 1,
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
  zoneGroup: {
    gap: 8,
  },
  zoneHeader: {
    height: 48,
    borderRadius: 12,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 8,
  },
  zoneName: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  zoneCount: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.inkDim,
  },
  zoneSpacer: {
    flex: 1,
  },
  zoneChevron: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneChevronOpen: {
    transform: [{ rotate: '90deg' }],
  },
  zoneItems: {
    gap: 8,
  },
});
