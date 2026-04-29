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
import { ShieldIcon, CloseIcon } from '../components/icons';
import { useListing, useMakeOffer } from '../api/queries';
import { demoHue } from '../utils/demoHue';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'MakeOffer'>;

export default function MakeOffer({ navigation, route }: Props) {
  const { itemId } = route.params;
  const { data: listing } = useListing(itemId);
  const makeOffer = useMakeOffer();

  const [priceText, setPriceText] = useState('');
  const insets = useSafeAreaInsets();

  const dismiss = () => navigation.goBack();

  const offerNum = parseInt(priceText, 10) || 0;
  const listed = listing?.priceAed ?? 0;
  const canSend = !!listing && offerNum > 0 && offerNum < listed;
  const pctDown = listed > 0 && offerNum > 0
    ? Math.round((1 - offerNum / listed) * 100)
    : null;

  const submit = async () => {
    if (!canSend || !listing) return;
    const conversationId = await makeOffer({
      listingId: listing.id,
      listingTitle: listing.title.original,
      listingPriceAed: listing.priceAed,
      peerId: listing.seller.id,
      peerName: listing.seller.name,
      peerInitial: listing.seller.avatarInitial,
      offerPriceAed: offerNum,
      pickupNote: null,
    });
    if (!conversationId) return;
    navigation.goBack();
    navigation.navigate('Main', {
      screen: 'InboxTab',
      params: { screen: 'Chat', params: { threadId: conversationId } },
    });
  };

  const suggest = (mult: number) => {
    if (!listed) return;
    setPriceText(String(Math.round(listed * mult)));
  };

  return (
    <View style={s.root}>
      <Pressable style={s.dim} onPress={dismiss} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable onPress={dismiss} style={s.closeBtn} hitSlop={8}>
            <CloseIcon size={14} color={theme.ink} />
          </Pressable>
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={s.title}>Make an offer</Text>
            <Text style={s.subtitle}>Sellers usually reply within a few hours.</Text>

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

            {pctDown !== null && pctDown > 0 ? (
              <Text style={[s.pctLine, pctDown > 25 && s.pctLineHi]}>
                That's {pctDown}% off the listed price
              </Text>
            ) : null}

            {listed > 0 ? (
              <View style={s.suggestRow}>
                {[
                  { l: '−10%', mult: 0.9 },
                  { l: '−15%', mult: 0.85 },
                  { l: '−20%', mult: 0.8 },
                ].map((opt) => (
                  <Pressable key={opt.l} onPress={() => suggest(opt.mult)} style={s.suggestChip}>
                    <Text style={s.suggestChipText}>{opt.l}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {/* <View style={s.notice}>
              <ShieldIcon size={14} color={theme.blue} />
              <Text style={s.noticeText}>
                <Text style={s.noticeBold}>Your offer is binding for 24h.</Text> The seller can accept,
                decline, or counter.
              </Text>
            </View> */}

            <View style={{ marginTop: 14 }}>
              <PrimaryBtn variant="orange" onPress={submit} disabled={!canSend}>
                Send offer
              </PrimaryBtn>
            </View>
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
    maxHeight: '100%',
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
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  itemCard: {
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: 9,
  },
  itemTitle: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  itemPrice: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
    marginTop: 1,
  },
  priceCard: {
    marginTop: 18,
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
  pctLineHi: {
    color: theme.orange,
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
  notice: {
    marginTop: 16,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  noticeText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.ink,
    lineHeight: 16,
  },
  noticeBold: {
    fontFamily: FONT.bold,
  },
});
