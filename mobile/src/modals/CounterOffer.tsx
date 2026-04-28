import { useState } from 'react';
import {
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
import { theme, FONT } from '../theme';
import { PrimaryBtn } from '../components/PrimaryBtn';
import { useCounterOffer } from '../api/queries';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CounterOffer'>;

export default function CounterOffer({ navigation, route }: Props) {
  const { conversationId, originalOfferId, originalOfferAed, listedPriceAed } = route.params;
  const counterOffer = useCounterOffer();
  const [priceText, setPriceText] = useState('');
  const insets = useSafeAreaInsets();

  const dismiss = () => navigation.goBack();

  const counterNum = parseInt(priceText, 10) || 0;
  const canSend = counterNum > originalOfferAed && counterNum <= listedPriceAed;
  const pctOff = listedPriceAed > 0 && counterNum > 0
    ? Math.round((1 - counterNum / listedPriceAed) * 100)
    : null;

  const submit = () => {
    if (!canSend) return;
    counterOffer(conversationId, originalOfferId, counterNum);
    dismiss();
  };

  const suggest = (mult: number) => {
    const target = Math.round(originalOfferAed * mult);
    setPriceText(String(Math.min(target, listedPriceAed)));
  };

  return (
    <View style={s.root}>
      <Pressable style={s.dim} onPress={dismiss} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable onPress={dismiss} style={s.handleHit}>
            <View style={s.handle} />
          </Pressable>
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={s.title}>Counter the offer</Text>
            <Text style={s.subtitle}>
              They offered AED {originalOfferAed.toLocaleString()} · Listed AED {listedPriceAed.toLocaleString()}
            </Text>

            <View style={s.priceCard}>
              <View style={s.aedBadge}>
                <Text style={s.aedText}>AED</Text>
              </View>
              <TextInput
                value={priceText}
                onChangeText={(v) => setPriceText(v.replace(/[^0-9]/g, '').slice(0, 7))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.inkDim}
                selectionColor={theme.orange}
                style={s.priceInput}
                autoFocus
              />
            </View>

            {pctOff !== null && pctOff > 0 ? (
              <Text style={s.pctLine}>That's {pctOff}% off the listed price</Text>
            ) : null}

            <View style={s.suggestRow}>
              {[
                { l: '+5%', mult: 1.05 },
                { l: '+10%', mult: 1.1 },
                { l: '+15%', mult: 1.15 },
              ].map((opt) => (
                <Pressable key={opt.l} onPress={() => suggest(opt.mult)} style={s.suggestChip}>
                  <Text style={s.suggestChipText}>{opt.l}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ marginTop: 18 }}>
              <PrimaryBtn variant="orange" onPress={submit} disabled={!canSend}>
                Send counter
              </PrimaryBtn>
            </View>

            {!canSend && counterNum > 0 ? (
              <Text style={s.hint}>
                {counterNum <= originalOfferAed
                  ? `Counter must be more than AED ${originalOfferAed.toLocaleString()}.`
                  : `Counter can't exceed listed price.`}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,33,46,0.55)',
  },
  sheet: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    maxHeight: '92%',
  },
  handleHit: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.line,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 20,
    color: theme.ink,
    letterSpacing: -0.4,
    marginTop: 4,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  priceCard: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: theme.blueSoft,
  },
  aedText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.blue,
  },
  priceInput: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 36,
    color: theme.ink,
    letterSpacing: -1,
    padding: 0,
  },
  pctLine: {
    marginTop: 10,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.inkDim,
  },
  suggestRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  suggestChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  suggestChipText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.ink,
  },
  hint: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
});
