import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { theme, FONT } from '../../theme';
import { CloseIcon } from '../../components/icons';
import { useListingDraft } from './ListingDraftContext';
import { MOCK_TRANSCRIPT, formatDuration } from './voiceMock';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingVoiceListening'>;

const BAR_COUNT = 32;

function baseHeights(): number[] {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const a = (Math.sin(i * 1.7) + 1) / 2;
    const b = (Math.cos(i * 0.9 + 2) + 1) / 2;
    return 0.25 + a * 0.55 + b * 0.2;
  });
}

export default function VoiceListening({ navigation }: Props) {
  const { setVoice } = useListingDraft();
  const insets = useSafeAreaInsets();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const base = useMemo(baseHeights, []);
  const [jitter, setJitter] = useState<number[]>(() => base.map(() => 1));
  const [seconds, setSeconds] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const committedRef = useRef(false);
  const halo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setInterval(() => {
      setJitter(base.map(() => 0.55 + Math.random() * 0.45));
    }, 90);
    return () => clearInterval(id);
  }, [base]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [halo]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { granted } = await requestRecordingPermissionsAsync();
      if (cancelled) return;
      if (!granted) {
        setPermissionDenied(true);
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    })();
    return () => {
      cancelled = true;
      if (!committedRef.current) {
        recorder.stop().catch(() => {});
      }
    };
  }, []);

  const onStop = async () => {
    if (committedRef.current) return;
    committedRef.current = true;
    await recorder.stop().catch(() => {});
    setVoice({
      transcript: MOCK_TRANSCRIPT,
      durationSec: seconds,
      audioUri: recorder.uri ?? undefined,
    });
    navigation.replace('ListingVoiceTranscript');
  };

  const onCancel = () => navigation.goBack();

  const haloOpacity = halo.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const haloScale = halo.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });

  return (
    <View style={s.root}>
      <Pressable style={s.scrim} onPress={onCancel} />
      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) + 8 }]}>
        <View style={s.handle} />

        <View style={s.statusRow}>
          <View style={s.dotWrap}>
            <Animated.View
              style={[
                s.dotHalo,
                { opacity: haloOpacity, transform: [{ scale: haloScale }] },
              ]}
            />
            <View style={s.dot} />
          </View>
          <Text style={s.statusText}>Listening</Text>
        </View>

        <Text style={s.title}>Tell us about your item</Text>
        <Text style={s.subhead}>
          {permissionDenied
            ? 'Microphone access is off. Enable it in Settings to record.'
            : 'What it is, condition, age, asking price.'}
        </Text>

        <View style={s.waveform}>
          {base.map((h, i) => {
            const px = Math.max(8, h * 68 * jitter[i]);
            return <View key={i} style={[s.bar, { height: px }]} />;
          })}
        </View>

        <Text style={s.timer}>{formatDuration(seconds)}</Text>

        <View style={s.actions}>
          <Pressable style={s.cancelBtn} onPress={onCancel} hitSlop={8}>
            <CloseIcon size={16} color={theme.inkDim} />
          </Pressable>
          <Pressable
            style={[s.stopBtn, permissionDenied && s.stopBtnDisabled]}
            onPress={onStop}
            disabled={permissionDenied}>
            <View style={s.stopSquare} />
          </Pressable>
          <View style={s.spacer} />
        </View>

        <Text style={s.tapToStop}>Tap to stop</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,33,46,0.55)',
  },
  sheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: -20 },
    elevation: 24,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.line,
    alignSelf: 'center',
    marginBottom: 18,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dotWrap: {
    width: 8,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.orange,
  },
  dotHalo: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.orange,
  },
  statusText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.orange,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 10,
    fontFamily: FONT.bold,
    fontSize: 22,
    color: theme.ink,
    letterSpacing: -0.4,
    textAlign: 'center',
    lineHeight: 28,
  },
  subhead: {
    marginTop: 6,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    textAlign: 'center',
    lineHeight: 18,
  },
  waveform: {
    marginTop: 24,
    marginBottom: 8,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.orange,
    opacity: 0.85,
  },
  timer: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  cancelBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.line,
    backgroundColor: theme.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.orange,
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  stopBtnDisabled: {
    backgroundColor: theme.line,
    shadowOpacity: 0,
  },
  stopSquare: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  spacer: { width: 52 },
  tapToStop: {
    marginTop: 14,
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.inkDim,
    textAlign: 'center',
  },
});
