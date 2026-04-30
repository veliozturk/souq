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
import {
  useMe,
  useUpdateMe,
  useUpdateAvatar,
  type UpdateMeBody,
} from '../../api/queries';
import { ApiError } from '../../api/client';
import { photoUri } from '../../api/photoUri';
import { pickPhotoFromLibrary } from '../listing/photoPicker';
import type { LocalPhoto } from '../../api/types';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'EditProfile'>;

const HANDLE_REGEX = /^[a-z0-9._]{3,32}$/;

export default function EditProfile({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: me, isPending } = useMe();
  const updateMe = useUpdateMe();
  const updateAvatar = useUpdateAvatar();

  const [seeded, setSeeded] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [pickedAvatar, setPickedAvatar] = useState<LocalPhoto | null>(null);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [handleError, setHandleError] = useState<string | null>(null);

  useEffect(() => {
    if (!me || seeded) return;
    setDisplayName(me.displayName);
    setHandle(me.handle);
    setSeeded(true);
  }, [me, seeded]);

  const trimmedName = displayName.trim();
  const trimmedHandle = handle.trim();
  const nameChanged = !!me && trimmedName !== me.displayName;
  const handleChanged = !!me && trimmedHandle !== me.handle;
  const avatarChanged = pickedAvatar !== null;
  const dirty = nameChanged || handleChanged || avatarChanged;
  const nameValid = trimmedName.length > 0 && trimmedName.length <= 80;
  const handleValid = HANDLE_REGEX.test(trimmedHandle);
  const canSave = !saving && dirty && nameValid && handleValid;

  const onPickAvatar = async () => {
    try {
      const photo = await pickPhotoFromLibrary();
      if (photo) setPickedAvatar(photo);
    } catch (e) {
      Alert.alert('Photo picker error', String((e as Error).message ?? e));
    }
  };

  const save = async () => {
    if (!canSave || !me) return;
    setSaving(true);
    setNameError(null);
    setHandleError(null);

    try {
      if (avatarChanged && pickedAvatar) {
        await updateAvatar(pickedAvatar);
      }

      if (nameChanged || handleChanged) {
        const body: UpdateMeBody = {};
        if (nameChanged) body.displayName = trimmedName;
        if (handleChanged) body.handle = trimmedHandle;
        await updateMe(body);
      }

      navigation.goBack();
      return;
    } catch (err) {
      if (err instanceof ApiError) {
        let code: string | null = null;
        try {
          const parsed = JSON.parse(err.body);
          code = typeof parsed?.error === 'string' ? parsed.error : null;
        } catch {
          code = null;
        }
        if (err.status === 409 && code === 'handle_taken') {
          setHandleError('Handle is taken');
        } else if (err.status === 400 && code === 'handle_invalid') {
          setHandleError('Use letters, numbers, dots or underscores (3–32 chars)');
        } else if (err.status === 400 && code === 'name_required') {
          setNameError('Name is required');
        } else if (err.status === 400 && code === 'name_too_long') {
          setNameError('Name is too long');
        } else {
          setNameError("Couldn't save. Please try again.");
        }
      } else {
        setNameError("Couldn't save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !me) {
    return (
      <View style={[s.root, s.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={theme.blue} />
      </View>
    );
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <Text style={s.headerTitle}>Edit profile</Text>
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
          <View style={s.avatarWrap}>
            <Pressable onPress={onPickAvatar} style={s.avatarPressable}>
              {pickedAvatar ? (
                <Image source={{ uri: pickedAvatar.uri }} style={s.avatarImage} />
              ) : me.avatarUrl ? (
                <Image source={{ uri: photoUri(me.avatarUrl) }} style={s.avatarImage} />
              ) : (
                <View style={s.avatarFallback}>
                  <Text style={s.avatarFallbackText}>
                    {me.avatarInitial ?? me.displayName.trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={s.avatarBadge}>
                <Text style={s.avatarBadgeText}>Change photo</Text>
              </View>
            </Pressable>
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Display name</FieldLabel>
            <View style={s.inputRow}>
              <TextInput
                value={displayName}
                onChangeText={(v) => {
                  setNameError(null);
                  setDisplayName(v.slice(0, 80));
                }}
                selectionColor={theme.orange}
                style={s.inputText}
              />
            </View>
            {nameError ? (
              <Text style={s.errorMsg}>{nameError}</Text>
            ) : (
              <Text style={s.helperRight}>{displayName.length} / 80</Text>
            )}
          </View>

          <View style={s.fieldWrap}>
            <FieldLabel>Handle</FieldLabel>
            <View style={s.inputRow}>
              <Text style={s.handlePrefix}>@</Text>
              <TextInput
                value={handle}
                onChangeText={(v) => {
                  setHandleError(null);
                  setHandle(v.replace(/\s/g, '').toLowerCase().slice(0, 32));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={theme.orange}
                style={s.inputText}
              />
            </View>
            {handleError ? (
              <Text style={s.errorMsg}>{handleError}</Text>
            ) : (
              <Text style={s.helperLeft}>
                Letters, numbers, dots or underscores. 3–32 characters.
              </Text>
            )}
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
  avatarWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  avatarPressable: {
    alignItems: 'center',
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: theme.surface,
  },
  avatarFallback: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    fontFamily: FONT.bold,
    fontSize: 38,
    color: theme.blue,
  },
  avatarBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.blueSoft,
  },
  avatarBadgeText: {
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
    gap: 6,
  },
  inputText: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.ink,
    padding: 0,
  },
  handlePrefix: {
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.inkDim,
  },
  helperRight: {
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  helperLeft: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  errorMsg: {
    marginTop: 6,
    fontFamily: FONT.medium,
    fontSize: 12,
    color: '#c0392b',
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
});
