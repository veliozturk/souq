import { useEffect } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import {
  CheckIcon,
  MicIcon,
  RefreshIcon,
  SparkleIcon,
} from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import { formatDuration, splitTranscript } from './voiceMock';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingVoiceTranscript'>;

function PolishGlyph({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 11l5-5 5 5M8 6v8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayGlyph({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
      <Path d="M3 2l6 3.5L3 9z" fill={color} />
    </Svg>
  );
}

function PauseGlyph({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
      <Path d="M3 2h2v7H3zM6 2h2v7H6z" fill={color} />
    </Svg>
  );
}

export default function VoiceTranscriptReview({ navigation }: Props) {
  const { voice, patch } = useListingDraft();
  const insets = useSafeAreaInsets();

  const transcript = voice.transcript;
  const duration = voice.durationSec;
  const audioUri = voice.audioUri;

  const player = useAudioPlayer(audioUri ?? null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status.didJustFinish, player]);

  const onTogglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  // Polish and Use-as-is share behaviour in the UI-only scope.
  const fillFromTranscript = () => {
    const { title, description } = splitTranscript(transcript);
    patch({ title, description });
    navigation.navigate('ListingDetails');
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={1}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={() => navigation.navigate('ListingCategory')}
      />
      <ScrollView
        style={s.flex}
        contentContainerStyle={[s.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 12 }]}
        showsVerticalScrollIndicator={false}>
        <View style={s.eyebrowRow}>
          <CheckIcon size={12} color={theme.orange} />
          <Text style={s.eyebrow}>Got it</Text>
        </View>
        <Text style={s.title}>Here's what we heard</Text>

        <View style={s.transcriptCard}>
          <View style={s.transcriptTag}>
            <MicIcon size={9} color={theme.orange} />
            <Text style={s.transcriptTagText}>
              Transcript · {formatDuration(duration)}
            </Text>
          </View>
          <Text style={s.transcriptText}>"{transcript}"</Text>
          <View style={s.chipRow}>
            {audioUri ? (
              <Pressable
                style={({ pressed }) => [s.reRecordChip, pressed && s.pressed]}
                onPress={onTogglePlay}>
                {status.playing ? (
                  <PauseGlyph color={theme.inkDim} />
                ) : (
                  <PlayGlyph color={theme.inkDim} />
                )}
                <Text style={s.reRecordText}>
                  {status.playing ? 'Pause' : 'Play recording'}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              style={({ pressed }) => [s.reRecordChip, pressed && s.pressed]}
              onPress={() => navigation.navigate('ListingVoiceListening')}>
              <RefreshIcon size={11} color={theme.inkDim} />
              <Text style={s.reRecordText}>Re-record</Text>
            </Pressable>
          </View>
        </View>

        <Text style={s.sectionLabel}>What next?</Text>

        <Pressable
          style={({ pressed }) => [s.actionCard, pressed && s.pressed]}
          onPress={fillFromTranscript}>
          <View style={[s.iconPlate, { backgroundColor: theme.blueSoft }]}>
            <PolishGlyph color={theme.blue} />
          </View>
          <View style={s.actionText}>
            <Text style={s.actionTitle}>Polish it up</Text>
            <Text style={s.actionSub}>Fix grammar, tighten the wording. Same content.</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.actionCard, pressed && s.pressed]}
          onPress={fillFromTranscript}>
          <View style={[s.iconPlate, { backgroundColor: theme.orangeSoft }]}>
            <CheckIcon size={14} color={theme.orange} />
          </View>
          <View style={s.actionText}>
            <Text style={s.actionTitle}>Use as is</Text>
            <Text style={s.actionSub}>Drop my words straight into title and description.</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.actionCardPrimary, pressed && s.pressed]}
          onPress={() => navigation.navigate('ListingVoiceSuggestions')}>
          <View style={s.recommendedPill}>
            <Text style={s.recommendedText}>Recommended</Text>
          </View>
          <View style={[s.iconPlate, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <SparkleIcon size={16} color="#fff" />
          </View>
          <View style={s.actionText}>
            <Text style={s.actionTitlePrimary}>Get 3 suggestions</Text>
            <Text style={s.actionSubPrimary}>
              Claude rewrites it three ways — pick the one you like.
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyebrow: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.orange,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 8,
    fontFamily: FONT.bold,
    fontSize: 24,
    color: theme.ink,
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  transcriptCard: {
    marginTop: 22,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  transcriptTag: {
    position: 'absolute',
    top: -11,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  transcriptTagText: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.inkDim,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  transcriptText: {
    fontFamily: FONT.regular,
    fontSize: 14.5,
    lineHeight: 22,
    color: theme.ink,
    marginTop: 4,
  },
  chipRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  reRecordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  reRecordText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.inkDim,
  },
  sectionLabel: {
    marginTop: 22,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  actionCard: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  actionCardPrimary: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.blue,
    position: 'relative',
    shadowColor: theme.blue,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  iconPlate: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionText: { flex: 1 },
  actionTitle: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: theme.ink,
  },
  actionSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: theme.inkDim,
    lineHeight: 17,
  },
  actionTitlePrimary: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#fff',
  },
  actionSubPrimary: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 17,
  },
  recommendedPill: {
    position: 'absolute',
    top: 10,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  recommendedText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pressed: { opacity: 0.7 },
});
