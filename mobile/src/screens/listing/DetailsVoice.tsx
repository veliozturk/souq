import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { FieldLabel } from '../../components/FieldLabel';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { MicStandIcon } from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingDetails'>;

export default function DetailsVoice({ navigation }: Props) {
  const { draft, patch } = useListingDraft();
  const insets = useSafeAreaInsets();

  const onStartRecording = () => navigation.navigate('ListingVoiceListening');

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={1}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={() => navigation.navigate('ListingCategory')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={s.title}>What are you selling?</Text>
          <Text style={s.subhead}>
            Title and a short description help your item show up in searches.
          </Text>

          <Pressable
            onPress={onStartRecording}
            style={({ pressed }) => [s.bannerWrap, pressed && s.bannerPressed]}>
            <LinearGradient
              colors={[theme.orange, theme.orange, theme.blue]}
              locations={[0, 0.6, 1.8]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.banner}>
              <View style={s.bannerSun} />
              <View style={s.bannerRow}>
                <View style={s.bannerIconPlate}>
                  <MicStandIcon size={20} color="#fff" />
                </View>
                <View style={s.bannerText}>
                  <Text style={s.bannerTitle}>Describe it out loud</Text>
                  <Text style={s.bannerSub}>
                    We'll fill in the title and description for you.
                  </Text>
                </View>
              </View>
              <View style={s.bannerCta}>
                <MicStandIcon size={14} color={theme.blue} />
                <Text style={s.bannerCtaText}>Start recording</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={s.field}>
            <FieldLabel>Title</FieldLabel>
            <View style={s.titleInput}>
              <TextInput
                value={draft.title}
                onChangeText={(v) => patch({ title: v.slice(0, 80) })}
                placeholder="e.g. IKEA Strandmon armchair, beige"
                placeholderTextColor={theme.inkDim}
                selectionColor={theme.orange}
                style={s.titleInputText}
              />
            </View>
          </View>

          <View style={s.field}>
            <FieldLabel>Description</FieldLabel>
            <View style={s.descBox}>
              <TextInput
                value={draft.description}
                onChangeText={(v) => patch({ description: v })}
                multiline
                placeholder="Tell buyers about condition, age, included accessories, pickup area."
                placeholderTextColor={theme.inkDim}
                selectionColor={theme.orange}
                style={s.descInput}
              />
            </View>
          </View>
        </ScrollView>
        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <PrimaryBtn
            onPress={() => navigation.navigate('ListingCategory')}
            disabled={!draft.title.trim()}>
            Continue
          </PrimaryBtn>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  title: {
    fontFamily: FONT.bold,
    fontSize: 26,
    color: theme.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subhead: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
    lineHeight: 20,
  },
  bannerWrap: {
    marginTop: 18,
    borderRadius: 18,
  },
  bannerPressed: { opacity: 0.94 },
  banner: {
    borderRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerSun: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerIconPlate: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: '#fff',
    letterSpacing: -0.2,
  },
  bannerSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: '#fff',
    opacity: 0.92,
    lineHeight: 18,
  },
  bannerCta: {
    marginTop: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bannerCtaText: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: theme.blue,
  },
  field: { marginTop: 18 },
  titleInput: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.line,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  titleInputText: {
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.ink,
    padding: 0,
  },
  descBox: {
    minHeight: 96,
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
    minHeight: 64,
    textAlignVertical: 'top',
    padding: 0,
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
});
