import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../theme';
import { QUICK_REPLIES } from '../data/quickReplies';
import { SparkleIcon, MicIcon, SendIcon, ShieldIcon } from '../components/icons';
import { useListing } from '../api/queries';
import { demoHue } from '../utils/demoHue';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SendMessage'>;

export default function SendMessage({ navigation, route }: Props) {
  const { itemId } = route.params;
  const { data: listing } = useListing(itemId);

  const [message, setMessage] = useState('');
  const [activeReply, setActiveReply] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const dismiss = () => navigation.goBack();
  const canSend = message.trim().length > 0;

  const sellerFirstName = listing?.seller.name.split(' ')[0] ?? '';
  const itemTitle = listing?.title.original ?? '';
  const itemPrice = listing?.priceAed;

  return (
    <View style={s.root}>
      <Pressable style={s.dim} onPress={dismiss} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable onPress={dismiss} style={s.handleHit}>
            <View style={s.handle} />
          </Pressable>

          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text style={s.title}>{sellerFirstName ? `Message ${sellerFirstName}` : 'Message'}</Text>
            <Text style={s.subtitle}>Replies in ~2h · English, Arabic</Text>

            {listing ? (
              <View style={s.itemCard}>
                <View style={[s.itemThumb, { backgroundColor: demoHue(listing.id) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.itemTitle}>{itemTitle}</Text>
                  {itemPrice != null ? (
                    <Text style={s.itemPrice}>AED {itemPrice.toLocaleString()}</Text>
                  ) : null}
                </View>
              </View>
            ) : null}

            <Text style={s.section}>QUICK MESSAGES</Text>
            <View style={s.quickRow}>
              {QUICK_REPLIES.map((q, i) => {
                const on = i === activeReply;
                return (
                  <Pressable
                    key={q}
                    onPress={() => {
                      setActiveReply(i);
                      setMessage(sellerFirstName ? `Hi ${sellerFirstName}! ${q}` : q);
                    }}
                    style={[s.quickChip, on && s.quickChipOn]}>
                    <Text style={[s.quickText, on && s.quickTextOn]}>
                      {on ? '✓ ' : ''}
                      {q}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={s.composer}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                style={s.composerInput}
                placeholder="Write a message"
                placeholderTextColor={theme.inkDim}
              />
              <View style={s.composerActions}>
                <View style={s.composerActionBlue}>
                  <SparkleIcon size={14} color={theme.blue} />
                </View>
                <View style={s.composerActionOrange}>
                  <MicIcon size={11} color="#fff" />
                </View>
              </View>
            </View>

            <View style={s.notice}>
              <ShieldIcon size={14} color={theme.blue} />
              <Text style={s.noticeText}>
                <Text style={s.noticeBold}>Keep it on Souq.</Text> Don't share phone, bank details or WhatsApp until
                you're ready to meet.
              </Text>
            </View>

            <View style={s.buttonsRow}>
              <Pressable onPress={dismiss} style={s.saveBtn}>
                <Text style={s.saveBtnText}>Save for later</Text>
              </Pressable>
              <Pressable
                onPress={dismiss}
                disabled={!canSend}
                style={[s.sendBtn, !canSend && s.sendBtnDisabled]}>
                <SendIcon size={14} color="#fff" />
                <Text style={s.sendBtnText}>Send message</Text>
              </Pressable>
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
  scroll: {
    flexGrow: 0,
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
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
    marginTop: 2,
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
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.blue,
    marginTop: 1,
  },
  section: {
    marginTop: 18,
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  quickRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  quickChipOn: {
    backgroundColor: theme.blueSoft,
    borderColor: theme.blue,
    borderWidth: 1.5,
  },
  quickText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.ink,
  },
  quickTextOn: {
    color: theme.blue,
  },
  composer: {
    marginTop: 18,
    minHeight: 108,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 40,
    position: 'relative',
  },
  composerInput: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.ink,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  composerActions: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    gap: 6,
  },
  composerActionBlue: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerActionOrange: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notice: {
    marginTop: 12,
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
  buttonsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.blue,
  },
  sendBtn: {
    flex: 1.3,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.orange,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: '#C9D1D9',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendBtnText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: '#fff',
  },
});
