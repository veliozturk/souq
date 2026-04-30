import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { CloseIcon, PlusIcon, InfoIcon } from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import { pickPhotosFromLibrary } from './photoPicker';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingPhotos'>;

const TOTAL_SLOTS = 9;

export default function ListingPhotos({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { draft, patch } = useListingDraft();
  const [picking, setPicking] = useState(false);
  const photos = draft.photos;

  const pick = useCallback(async () => {
    if (picking) return;
    const remaining = TOTAL_SLOTS - photos.length;
    if (remaining <= 0) return;

    setPicking(true);
    try {
      const picked = await pickPhotosFromLibrary(remaining);
      if (picked.length) patch({ photos: [...photos, ...picked] });
    } catch (e) {
      Alert.alert('Photo picker error', String((e as Error).message ?? e));
    } finally {
      setPicking(false);
    }
  }, [picking, photos, patch]);

  const removeAt = useCallback((index: number) => {
    patch({ photos: photos.filter((_, i) => i !== index) });
  }, [photos, patch]);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={0}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={() => navigation.navigate('ListingDetails')}
      />
      <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Add some photos.</Text>
        <Text style={s.subtitle}>
          First photo is the cover. Listings with 4+ photos sell{' '}
          <Text style={s.subtitleHi}>2.4× faster</Text>.
        </Text>

        <View style={s.grid}>
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
            const photo = photos[i];
            if (photo) {
              return (
                <View key={i} style={s.cell}>
                  <View style={s.tile}>
                    <Image source={{ uri: photo.uri }} style={s.tileImage} />
                    {i === 0 ? (
                      <View style={s.coverBadge}>
                        <Text style={s.coverBadgeText}>COVER</Text>
                      </View>
                    ) : null}
                    <Pressable onPress={() => removeAt(i)} style={s.removeBtn} hitSlop={6}>
                      <CloseIcon size={10} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              );
            }
            const isAdd = i === photos.length;
            return (
              <View key={i} style={s.cell}>
                {isAdd ? (
                  <Pressable onPress={pick} style={s.addTile} disabled={picking}>
                    <View style={s.plusCircle}>
                      <PlusIcon size={12} color="#fff" />
                    </View>
                    <Text style={s.addLabel}>{picking ? '…' : 'Add'}</Text>
                  </Pressable>
                ) : (
                  <View style={s.emptyTile}>
                    <View style={s.emptyDot} />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={s.tip}>
          <View style={s.tipBadge}>
            <InfoIcon size={10} color="#fff" />
          </View>
          <Text style={s.tipText}>
            Shoot in daylight, clean background, show any scratches. It builds trust.
          </Text>
        </View>
      </ScrollView>
      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <PrimaryBtn onPress={() => navigation.navigate('ListingDetails')}>
          {photos.length > 0 ? `Continue · ${photos.length} photo${photos.length === 1 ? '' : 's'}` : 'Continue'}
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
    marginTop: 8,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
    lineHeight: 21,
  },
  subtitleHi: {
    fontFamily: FONT.semibold,
    color: theme.orange,
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
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.surface,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: theme.orange,
  },
  coverBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.6,
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTile: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: theme.blueSoft,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.blue,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  plusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    fontFamily: FONT.semibold,
    fontSize: 10,
    color: theme.blue,
  },
  emptyTile: {
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  tip: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: theme.orangeSoft,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.ink,
    lineHeight: 18,
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
});
