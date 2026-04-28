import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { CloseIcon, PlusIcon, InfoIcon } from '../../components/icons';
import {
  useListing,
  useUpdateListingPhotos,
  type EditPhotoItem,
} from '../../api/queries';
import { pickPhotoFromLibrary } from '../listing/photoPicker';
import { photoUri } from '../../api/photoUri';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'EditPhotos'>;

const TOTAL_SLOTS = 9;

function tileUri(item: EditPhotoItem): string {
  if (item.kind === 'remote') return photoUri(item.photo.thumbUrl ?? item.photo.url);
  return item.photo.uri;
}

function tileKey(item: EditPhotoItem, index: number): string {
  return item.kind === 'remote' ? `r:${item.photo.id}` : `l:${item.photo.uri}:${index}`;
}

export default function EditPhotos({ navigation, route }: Props) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: listing, isPending, isError, refetch } = useListing(id);
  const updatePhotos = useUpdateListingPhotos();

  const [seeded, setSeeded] = useState(false);
  const [items, setItems] = useState<EditPhotoItem[]>([]);
  const [picking, setPicking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!listing || seeded) return;
    setItems(listing.photos.map((photo) => ({ kind: 'remote', photo })));
    setSeeded(true);
  }, [listing, seeded]);

  const removeAt = (index: number) => {
    setItems((curr) => curr.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setItems((curr) => {
      const next = curr.slice();
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    setItems((curr) => {
      if (index >= curr.length - 1) return curr;
      const next = curr.slice();
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const pick = async () => {
    if (picking || items.length >= TOTAL_SLOTS) return;
    setPicking(true);
    try {
      const photo = await pickPhotoFromLibrary();
      if (photo) setItems((curr) => [...curr, { kind: 'local', photo }]);
    } catch (e) {
      Alert.alert('Photo picker error', String((e as Error).message ?? e));
    } finally {
      setPicking(false);
    }
  };

  const canSave = !saving && seeded && items.length > 0;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    const ok = await updatePhotos(id, items);
    setSaving(false);
    if (!ok) {
      Alert.alert('Save failed', 'Could not update photos. Try again.');
      return;
    }
    navigation.goBack();
  };

  if (isPending) {
    return (
      <View style={[s.root, s.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={theme.blue} />
      </View>
    );
  }
  if (isError || !listing) {
    return (
      <View style={[s.root, s.center, { paddingTop: insets.top }]}>
        <Text style={s.errorText}>Couldn't load this listing.</Text>
        <Pressable onPress={() => refetch()} style={s.retryBtn}>
          <Text style={s.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={s.headerTitle}>Edit photos</Text>
        <Pressable onPress={save} disabled={!canSave} style={s.saveBtn} hitSlop={8}>
          {saving ? (
            <ActivityIndicator color={theme.blue} />
          ) : (
            <Text style={[s.saveText, !canSave ? s.saveTextDisabled : null]}>Save</Text>
          )}
        </Pressable>
      </View>
      <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}>
          First photo is the cover. Tap <Text style={s.subtitleHi}>↑</Text> /{' '}
          <Text style={s.subtitleHi}>↓</Text> to reorder.
        </Text>

        <View style={s.grid}>
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
            const item = items[i];
            if (item) {
              const isCover = i === 0;
              const isLast = i === items.length - 1;
              return (
                <View key={tileKey(item, i)} style={s.cell}>
                  <View style={s.tile}>
                    <Image source={{ uri: tileUri(item) }} style={s.tileImage} />
                    {isCover ? (
                      <View style={s.coverBadge}>
                        <Text style={s.coverBadgeText}>COVER</Text>
                      </View>
                    ) : null}
                    <Pressable onPress={() => removeAt(i)} style={s.removeBtn} hitSlop={6}>
                      <CloseIcon size={10} color="#fff" />
                    </Pressable>
                    <View style={s.arrows}>
                      <Pressable
                        onPress={() => moveUp(i)}
                        disabled={isCover}
                        style={[s.arrowBtn, isCover ? s.arrowBtnDisabled : null]}
                        hitSlop={4}>
                        <Text style={s.arrowText}>↑</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => moveDown(i)}
                        disabled={isLast}
                        style={[s.arrowBtn, isLast ? s.arrowBtnDisabled : null]}
                        hitSlop={4}>
                        <Text style={s.arrowText}>↓</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }
            const isAdd = i === items.length;
            return (
              <View key={`empty-${i}`} style={s.cell}>
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

        {items.length === 0 ? (
          <View style={s.tip}>
            <View style={s.tipBadge}>
              <InfoIcon size={10} color="#fff" />
            </View>
            <Text style={s.tipText}>
              At least one photo is required. Tap "Add" to upload from your library.
            </Text>
          </View>
        ) : null}
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
  saveBtn: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  saveText: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.blue,
  },
  saveTextDisabled: {
    color: theme.inkDim,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
    lineHeight: 21,
  },
  subtitleHi: {
    fontFamily: FONT.semibold,
    color: theme.ink,
  },
  grid: {
    marginTop: 18,
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
  arrows: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    gap: 4,
  },
  arrowBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnDisabled: {
    opacity: 0.35,
  },
  arrowText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#fff',
    lineHeight: 14,
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
  errorText: {
    fontFamily: FONT.medium,
    fontSize: 15,
    color: theme.ink,
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.blue,
  },
  retryText: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: '#fff',
  },
});
