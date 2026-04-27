import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import {
  CatFurnitureIcon,
  CatElectronicsIcon,
  CatFashionIcon,
  CatHomeIcon,
  CatSportsIcon,
  CatKidsIcon,
  MapPinSimpleIcon,
  ChevronRightIcon,
} from '../../components/icons';
import { useCategories, useMe } from '../../api/queries';
import { isDemoMode } from '../../api/client';
import { LISTING_PRESET } from '../../data/fixtures/listingPreset';
import type { ListingStackParamList } from '../../navigation/types';
import type { ComponentType } from 'react';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingCategory'>;

const ICON_BY_KEY: Record<string, ComponentType<{ size: number; color: string }>> = {
  'cat-furniture': CatFurnitureIcon,
  'cat-electronics': CatElectronicsIcon,
  'cat-fashion': CatFashionIcon,
  'cat-home': CatHomeIcon,
  'cat-sports': CatSportsIcon,
  'cat-kids': CatKidsIcon,
};

const CONDITIONS = ['Brand new', 'Like new', 'Good', 'Fair'];

export default function ListingCategory({ navigation }: Props) {
  const { data: categories = [] } = useCategories();
  const { data: me } = useMe();
  const initialCat = isDemoMode() ? LISTING_PRESET.categoryId : null;
  const initialCond = isDemoMode() ? LISTING_PRESET.conditionLabel : null;
  const [cat, setCat] = useState<string | null>(initialCat);
  const [cond, setCond] = useState<string | null>(initialCond);
  const insets = useSafeAreaInsets();
  const pickupNbh = me?.homeNeighborhood?.name.en ?? null;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={2}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={() => navigation.navigate('ListingPrice')}
      />
      <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Category & condition.</Text>
        <Text style={s.subtitle}>Helps the right buyers find it.</Text>

        <View style={s.grid}>
          {categories.map((c) => {
            const sel = c.id === cat;
            const Icon = c.iconName ? ICON_BY_KEY[c.iconName] : null;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCat(c.id)}
                style={[s.cell]}>
                <View style={[s.tile, sel ? s.tileSelected : s.tileDefault]}>
                  {Icon ? <Icon size={20} color={sel ? '#fff' : theme.ink} /> : null}
                  <Text style={[s.tileText, { color: sel ? '#fff' : theme.ink }]}>{c.name.en}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={s.section}>CONDITION</Text>
        <View style={s.condRow}>
          {CONDITIONS.map((c) => {
            const sel = c === cond;
            return (
              <Pressable
                key={c}
                onPress={() => setCond(c)}
                style={[s.condChip, sel ? s.condChipOn : s.condChipOff]}>
                <Text style={[s.condText, { color: sel ? '#fff' : theme.ink }]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.locCard}>
          <View style={s.locIcon}>
            <MapPinSimpleIcon size={18} color={theme.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.locTitle}>{pickupNbh ? `Pickup from ${pickupNbh}` : 'Set pickup location'}</Text>
            <Text style={s.locSub}>Change location or offer delivery</Text>
          </View>
          <ChevronRightIcon size={8} color={theme.inkDim} />
        </View>
      </ScrollView>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        <PrimaryBtn onPress={() => navigation.navigate('ListingPrice')} disabled={!cat || !cond}>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 26,
    color: theme.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  grid: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.333%',
    padding: 5,
  },
  tile: {
    aspectRatio: 1.1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tileDefault: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  tileSelected: {
    backgroundColor: theme.blue,
  },
  tileText: {
    fontFamily: FONT.semibold,
    fontSize: 13,
  },
  section: {
    marginTop: 24,
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  condRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  condChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  condChipOff: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  condChipOn: {
    backgroundColor: theme.orange,
  },
  condText: {
    fontFamily: FONT.semibold,
    fontSize: 14,
  },
  locCard: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locTitle: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.ink,
  },
  locSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  actions: {
    paddingHorizontal: 20,
  },
});
