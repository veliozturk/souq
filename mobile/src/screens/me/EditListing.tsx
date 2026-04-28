import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { FieldLabel } from '../../components/FieldLabel';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { Toggle } from '../../components/Toggle';
import {
  useCategories,
  useConditions,
  useListing,
  useUpdateListing,
} from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'EditListing'>;

export default function EditListing({ navigation, route }: Props) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: listing, isPending, isError, refetch } = useListing(id);
  const { data: categories = [] } = useCategories();
  const { data: conditions = [] } = useConditions();
  const updateListing = useUpdateListing();

  const [seeded, setSeeded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [conditionId, setConditionId] = useState<string | null>(null);
  const [priceAed, setPriceAed] = useState('');
  const [acceptOffers, setAcceptOffers] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!listing || seeded) return;
    setTitle(listing.title.original);
    setDescription(listing.description.original);
    setCategoryId(listing.category.id);
    setConditionId(listing.condition.id);
    setPriceAed(String(listing.priceAed));
    setAcceptOffers(listing.acceptOffers);
    setSeeded(true);
  }, [listing, seeded]);

  const titleTrimmed = title.trim();
  const priceNum = parseInt(priceAed, 10);
  const canSave =
    !saving &&
    !!listing &&
    titleTrimmed.length > 0 &&
    Number.isFinite(priceNum) &&
    priceNum >= 0 &&
    !!categoryId &&
    !!conditionId;

  const save = async () => {
    if (!canSave || !listing) return;
    setSaving(true);
    const ok = await updateListing(id, {
      title: titleTrimmed,
      description: description.trim(),
      categoryId: categoryId!,
      conditionId: conditionId!,
      neighborhoodId: listing.neighborhood.id,
      priceAed: priceNum,
      acceptOffers,
    });
    setSaving(false);
    if (ok) {
      navigation.goBack();
    } else {
      Alert.alert('Could not save', 'Please try again.');
    }
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
        <Text style={s.headerTitle}>Edit listing</Text>
        <View style={s.headerSpacer} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable
            onPress={() => navigation.navigate('EditPhotos', { id })}
            style={s.photoStripPressable}>
            {listing.photos.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.photoStrip}>
                {listing.photos.map((p) => (
                  <Image
                    key={p.id}
                    source={{ uri: photoUri(p.thumbUrl ?? p.url) }}
                    style={s.photo}
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={s.photoStripEmpty}>
                <Text style={s.photoStripEmptyText}>Add photos</Text>
              </View>
            )}
            <View style={s.editPhotosBtn}>
              <Text style={s.editPhotosBtnText}>Edit photos</Text>
            </View>
          </Pressable>

          <View style={s.fieldWrap}>
            <FieldLabel>Title</FieldLabel>
            <View style={s.inputRow}>
              <TextInput
                value={title}
                onChangeText={(v) => setTitle(v.slice(0, 80))}
                selectionColor={theme.orange}
                style={s.inputText}
              />
            </View>
            <Text style={s.helperRight}>{title.length} / 80</Text>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Description</FieldLabel>
            <View style={s.descBox}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                selectionColor={theme.orange}
                style={s.descInput}
              />
            </View>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Price (AED)</FieldLabel>
            <View style={s.priceRow}>
              <View style={s.aedBadge}>
                <Text style={s.aedText}>AED</Text>
              </View>
              <TextInput
                value={priceAed}
                onChangeText={(v) => setPriceAed(v.replace(/[^0-9]/g, '').slice(0, 7))}
                keyboardType="number-pad"
                selectionColor={theme.orange}
                style={s.priceInput}
              />
            </View>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Category</FieldLabel>
            <View style={s.chipRow}>
              {categories.map((c) => {
                const sel = c.id === categoryId;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setCategoryId(c.id)}
                    style={[s.chip, sel ? s.chipOnBlue : s.chipOff]}>
                    <Text style={[s.chipText, { color: sel ? '#fff' : theme.ink }]}>
                      {c.name.en}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Condition</FieldLabel>
            <View style={s.chipRow}>
              {conditions.map((c) => {
                const sel = c.id === conditionId;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setConditionId(c.id)}
                    style={[s.chip, sel ? s.chipOnOrange : s.chipOff]}>
                    <Text style={[s.chipText, { color: sel ? '#fff' : theme.ink }]}>
                      {c.name.en}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={s.toggleRow}>
            <Toggle on={acceptOffers} onChange={setAcceptOffers} />
            <Text style={s.toggleLabel}>Accept offers</Text>
          </View>
        </ScrollView>
        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <PrimaryBtn onPress={save} disabled={!canSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </PrimaryBtn>
        </View>
      </KeyboardAvoidingView>
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
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  photoStripPressable: {
    marginTop: 4,
  },
  photoStrip: {
    paddingVertical: 4,
    gap: 8,
  },
  photo: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: theme.surface,
  },
  photoStripEmpty: {
    height: 84,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoStripEmptyText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: theme.inkDim,
  },
  editPhotosBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.blueSoft,
  },
  editPhotosBtnText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
  fieldWrap: {
    marginTop: 22,
  },
  inputRow: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  inputText: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.ink,
    padding: 0,
  },
  helperRight: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  descBox: {
    minHeight: 120,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  descInput: {
    fontFamily: FONT.regular,
    fontSize: 15,
    color: theme.ink,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: 'top',
    padding: 0,
  },
  priceRow: {
    height: 64,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  aedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.blueSoft,
  },
  aedText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.blue,
    letterSpacing: -0.2,
  },
  priceInput: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
    padding: 0,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipOff: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  chipOnBlue: {
    backgroundColor: theme.blue,
  },
  chipOnOrange: {
    backgroundColor: theme.orange,
  },
  chipText: {
    fontFamily: FONT.semibold,
    fontSize: 14,
  },
  toggleRow: {
    marginTop: 22,
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
  toggleLabel: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 15,
    color: theme.ink,
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
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
