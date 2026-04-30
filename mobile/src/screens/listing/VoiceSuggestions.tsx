import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { CheckIcon, RefreshIcon, SparkleIcon } from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import { useApplyVoiceClassification } from './useApplyVoiceClassification';
import { FALLBACK_SUGGESTIONS } from './voiceMock';
import { useVoiceSuggestions } from '../../api/queries';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingVoiceSuggestions'>;

function SkeletonCard({ shimmer }: { shimmer: Animated.Value }) {
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });
  return (
    <View style={ss.card}>
      <Animated.View style={[ss.shimmer, { opacity }]} />
      <View style={[ss.bar, { width: '60%', height: 14 }]} />
      <View style={[ss.bar, { width: '95%', marginTop: 12, opacity: 0.7 }]} />
      <View style={[ss.bar, { width: '88%', marginTop: 8, opacity: 0.7 }]} />
      <View style={[ss.bar, { width: '70%', marginTop: 8, opacity: 0.7 }]} />
    </View>
  );
}

const ss = StyleSheet.create({
  card: {
    height: 132,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.blueSoft,
  },
  bar: {
    height: 10,
    borderRadius: 4,
    backgroundColor: theme.line,
  },
});

export default function VoiceSuggestions({ navigation }: Props) {
  const { voice, patch } = useListingDraft();
  const insets = useSafeAreaInsets();

  useApplyVoiceClassification(voice.transcript);

  const query = useVoiceSuggestions(voice.transcript);
  const suggestions =
    query.data?.suggestions ?? (query.isError ? FALLBACK_SUGGESTIONS : []);
  const showSkeleton = suggestions.length === 0 || query.isFetching;

  const [selected, setSelected] = useState(0);
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showSkeleton) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [showSkeleton, shimmer]);

  const onRefresh = () => {
    query.refetch();
  };

  const onUseThis = () => {
    const s = suggestions[selected];
    if (!s) return;
    patch({ title: s.title, description: s.body });
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
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={s.eyebrowRow}>
          <SparkleIcon size={12} color={theme.blue} />
          <Text style={s.eyebrow}>Suggestions</Text>
        </View>
        <Text style={s.title}>Pick one — or edit after</Text>
        <Text style={s.subhead}>Three rewrites of your recording, with different tones.</Text>

        {showSkeleton && (
          <View style={s.list}>
            <SkeletonCard shimmer={shimmer} />
            <SkeletonCard shimmer={shimmer} />
            <SkeletonCard shimmer={shimmer} />
            <Text style={s.loadingCaption}>Drafting three versions…</Text>
          </View>
        )}

        {!showSkeleton && (
          <View style={s.list}>
            {suggestions.map((sug, i) => {
              const active = selected === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => setSelected(i)}
                  style={({ pressed }) => [
                    s.suggestionCard,
                    active && s.suggestionCardActive,
                    pressed && !active && s.pressed,
                  ]}>
                  <View style={s.cardTopRow}>
                    <View style={s.tonePill}>
                      <Text style={s.toneText}>{sug.tone}</Text>
                    </View>
                    <View style={[s.radio, active && s.radioActive]}>
                      {active && <CheckIcon size={11} color="#fff" />}
                    </View>
                  </View>
                  <Text style={s.suggestionTitle}>{sug.title}</Text>
                  <Text style={s.suggestionBody}>{sug.body}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          onPress={onRefresh}
          style={({ pressed }) => [s.refreshBtn, pressed && s.pressed]}
          accessibilityLabel="Refresh suggestions">
          <RefreshIcon size={16} color={theme.inkDim} />
        </Pressable>
        <View style={s.flex}>
          <PrimaryBtn onPress={onUseThis} disabled={showSkeleton || suggestions.length === 0}>
            Use this one
          </PrimaryBtn>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyebrow: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
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
  subhead: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    lineHeight: 19,
  },
  list: {
    marginTop: 18,
    gap: 12,
  },
  loadingCaption: {
    marginTop: 4,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
    textAlign: 'center',
  },
  suggestionCard: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  suggestionCardActive: {
    borderWidth: 2,
    borderColor: theme.blue,
    shadowColor: theme.blue,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tonePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: theme.orangeSoft,
  },
  toneText: {
    fontFamily: FONT.bold,
    fontSize: 10.5,
    color: theme.orange,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: theme.line,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: theme.blue,
    borderColor: theme.blue,
  },
  suggestionTitle: {
    fontFamily: FONT.bold,
    fontSize: 15.5,
    color: theme.ink,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  suggestionBody: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
  },
  refreshBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.line,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
