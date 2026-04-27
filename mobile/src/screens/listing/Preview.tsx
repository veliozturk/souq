import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { Toggle } from '../../components/Toggle';
import { PinIcon, BoltIcon } from '../../components/icons';
import { useCategories, useCreateListing, useMe, useSaveDraft } from '../../api/queries';
import { demoHue } from '../../utils/demoHue';
import { useListingDraft } from './ListingDraftContext';
import type {
  ListingStackParamList,
  MainTabsParamList,
} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ListingStackParamList, 'ListingPreview'>,
  BottomTabScreenProps<MainTabsParamList>
>;

export default function ListingPreview({ navigation }: Props) {
  const [boost, setBoost] = useState(true);
  const insets = useSafeAreaInsets();
  const { draft, reset } = useListingDraft();
  const { data: me } = useMe();
  const { data: categories = [] } = useCategories();
  const createListing = useCreateListing();
  const saveDraft = useSaveDraft();
  const canPublish = !!draft.title.trim() && !!draft.priceAed && !!draft.categoryId;
  const sellerName = me?.displayName.split(' ')[0] ?? 'You';
  const sellerInitial = me?.avatarInitial ?? sellerName[0] ?? 'Y';
  const nbhName = me?.homeNeighborhood?.name.en ?? 'Dubai';
  const categoryName = categories.find((c) => c.id === draft.categoryId)?.name.en;
  const locLine = categoryName ? `${nbhName} · ${categoryName}` : nbhName;
  const coverTint = draft.photoTints[0] ?? demoHue('preview-fallback');
  const photoCount = draft.photoTints.length;

  const closeFlow = () => {
    reset();
    navigation.getParent<any>()?.navigate('HomeTab');
    navigation.popToTop();
  };

  const publish = () => {
    if (!canPublish) return;
    createListing(draft);
    closeFlow();
  };

  const saveAsDraft = () => {
    saveDraft(draft);
    closeFlow();
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={4}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={closeFlow}
      />
      <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Looks good?</Text>
        <Text style={s.subtitle}>Here's how buyers will see it.</Text>

        <View style={s.previewCard}>
          <View style={[s.previewImage, { backgroundColor: coverTint }]}>
            {draft.conditionLabel ? (
              <View style={s.condBadge}>
                <Text style={s.condBadgeText}>{draft.conditionLabel.toUpperCase()}</Text>
              </View>
            ) : null}
            {photoCount > 0 ? (
              <View style={s.counterBadge}>
                <Text style={s.counterText}>1 / {photoCount}</Text>
              </View>
            ) : null}
          </View>
          <View style={s.previewBody}>
            <View style={s.previewTopRow}>
              <Text style={s.previewPrice}>AED {draft.priceAed || '—'}</Text>
              <Text style={s.previewMeta}>Posted just now</Text>
            </View>
            <Text style={s.previewTitle}>{draft.title || 'Your listing'}</Text>
            <View style={s.previewLocRow}>
              <PinIcon size={12} color={theme.blue} />
              <Text style={s.previewLoc}>{locLine}</Text>
            </View>

            <View style={s.previewSeller}>
              <LinearGradient
                colors={[theme.blueSoft, theme.orangeSoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.previewAvatar}>
                <Text style={s.previewAvatarText}>{sellerInitial}</Text>
              </LinearGradient>
              <Text style={s.previewSellerName}>{sellerName} · ★ New seller</Text>
            </View>
          </View>
        </View>

        <View style={s.boostCard}>
          <View style={s.boltBadge}>
            <BoltIcon size={14} color="#fff" />
          </View>
          <Text style={s.boostText}>
            Use your <Text style={s.boostStrong}>50 AED welcome credit</Text> to boost for 24h?
          </Text>
          <Toggle on={boost} onChange={setBoost} colorOn={theme.orange} />
        </View>
      </ScrollView>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom + 16, 28) }]}>
        <PrimaryBtn variant="orange" onPress={publish} disabled={!canPublish}>
          Publish listing
        </PrimaryBtn>
        <View style={s.draftRow}>
          <Text style={s.draftRowText}>Or </Text>
          <Pressable onPress={saveAsDraft}>
            <Text style={s.draftRowLink}>save as draft</Text>
          </Pressable>
        </View>
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
    paddingTop: 0,
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
  previewCard: {
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: 'hidden',
    shadowColor: '#142B3E',
    shadowOpacity: 0.08,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  previewImage: {
    aspectRatio: 1.4,
  },
  condBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: theme.orange,
  },
  condBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.8,
  },
  counterBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  counterText: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: '#fff',
  },
  previewBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  previewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  previewPrice: {
    fontFamily: FONT.bold,
    fontSize: 22,
    color: theme.ink,
    letterSpacing: -0.3,
  },
  previewMeta: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  previewTitle: {
    marginTop: 4,
    fontFamily: FONT.medium,
    fontSize: 15,
    color: theme.ink,
  },
  previewLocRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewLoc: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  previewSeller: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
  },
  previewSellerName: {
    flex: 1,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  boostCard: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: theme.blueSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boltBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: theme.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boostText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.ink,
    lineHeight: 18,
  },
  boostStrong: {
    fontFamily: FONT.bold,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 10,
  },
  draftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftRowText: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  draftRowLink: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.blue,
  },
});
