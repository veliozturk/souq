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
import { MicStandIcon, SparkleIcon } from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingDetails'>;

const VOICE_BARS = [10, 18, 24, 14, 8];

export default function ListingDetails({ navigation }: Props) {
  const { draft, patch } = useListingDraft();
  const title = draft.title;
  const description = draft.description;
  const setTitle = (v: string) => patch({ title: v });
  const setDescription = (v: string) => patch({ description: v });
  const insets = useSafeAreaInsets();

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

          <View style={s.fieldWrap}>
            <FieldLabel>Title</FieldLabel>
            <View style={s.inputRow}>
              <TextInput
                value={title}
                onChangeText={(v) => setTitle(v.slice(0, 80))}
                selectionColor={theme.orange}
                style={s.inputText}
              />
              <View style={s.micBtn}>
                <MicStandIcon size={14} color="#fff" />
              </View>
            </View>
            <View style={s.helperRow}>
              <Text style={s.helperLeft}>
                Type or tap <Text style={s.helperHi}>mic</Text> to dictate.
              </Text>
              <Text style={s.helperRight}>{title.length} / 80</Text>
            </View>
          </View>

          <LinearGradient
            colors={[theme.orange, theme.orange, theme.blue]}
            locations={[0, 0.55, 1.8]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.voiceCallout}>
            <View style={s.voiceBars}>
              {VOICE_BARS.map((h, i) => (
                <View key={i} style={[s.voiceBar, { height: h }]} />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.voiceTitle}>Just say it</Text>
              <Text style={s.voiceSub}>"Selling my beige IKEA armchair, like new…"</Text>
            </View>
            <View style={s.voicePill}>
              <Text style={s.voicePillText}>Hold to talk</Text>
            </View>
          </LinearGradient>

          <View style={s.descHeader}>
            <Text style={s.descLabel}>DESCRIPTION</Text>
            <View style={s.aiBtn}>
              <SparkleIcon size={12} color="#fff" />
              <Text style={s.aiBtnText}>Write with AI</Text>
            </View>
          </View>
          <View style={s.descBox}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              selectionColor={theme.orange}
              style={s.descInput}
            />
            <View style={s.aiTag}>
              <View style={s.aiTagDot} />
              <Text style={s.aiTagText}>Drafted by AI from your photos · edit freely</Text>
            </View>
          </View>
        </ScrollView>
        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <PrimaryBtn onPress={() => navigation.navigate('ListingCategory')} disabled={!title.trim()}>
            Continue
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
  fieldWrap: {
    marginTop: 20,
  },
  inputRow: {
    height: 56,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 14,
    gap: 8,
  },
  inputText: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 17,
    color: theme.ink,
    padding: 0,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.orange,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  helperRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperLeft: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  helperHi: {
    fontFamily: FONT.semibold,
    color: theme.orange,
  },
  helperRight: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  voiceCallout: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  voiceBars: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
  },
  voiceBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
    opacity: 0.95,
  },
  voiceTitle: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#fff',
  },
  voiceSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  voicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#fff',
  },
  voicePillText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.orange,
  },
  descHeader: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  descLabel: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.blue,
    shadowColor: theme.blue,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  aiBtnText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: '#fff',
    letterSpacing: 0.2,
  },
  descBox: {
    minHeight: 128,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 32,
    position: 'relative',
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
  aiTag: {
    position: 'absolute',
    left: 14,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.orange,
  },
  aiTagText: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.blue,
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
});
