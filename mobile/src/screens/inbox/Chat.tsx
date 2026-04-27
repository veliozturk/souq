import { useEffect, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { Bubble } from '../../components/Bubble';
import { MoreDotsIcon, PlusIcon, SendIcon } from '../../components/icons';
import { useConversations, useMarkConversationRead, useMessages, useSendMessage } from '../../api/queries';
import { demoHue } from '../../utils/demoHue';
import type { InboxStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'Chat'>;

export default function Chat({ navigation, route }: Props) {
  const { threadId } = route.params;
  const [draft, setDraft] = useState('');
  const insets = useSafeAreaInsets();
  const canSend = draft.trim().length > 0;

  const { data: conversations = [] } = useConversations();
  const conversation = conversations.find((c) => c.id === threadId);
  const { data: messages = [] } = useMessages(threadId);
  const sendMessage = useSendMessage();
  const markRead = useMarkConversationRead();

  useEffect(() => {
    markRead(threadId);
  }, [threadId, markRead]);

  const handleSend = () => {
    if (!canSend) return;
    sendMessage(threadId, draft);
    setDraft('');
  };

  const peerName = conversation?.peer.displayName ?? '';
  const peerInitial = conversation?.peer.avatarInitial ?? peerName[0] ?? '?';
  const isOnline = conversation?.peer.isOnline ?? false;
  const itemTitle = conversation?.listing.title ?? '';
  const itemPriceAed = conversation?.listing.priceAed;
  const itemHue = demoHue(conversation?.listing.id ?? threadId);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <BackBtn onPress={() => navigation.goBack()} size={36} arrowSize={9} />
        <LinearGradient
          colors={[theme.blueSoft, theme.orangeSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.avatar}>
          <Text style={s.avatarText}>{peerInitial}</Text>
        </LinearGradient>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={s.name}>{peerName}</Text>
          {isOnline ? (
            <View style={s.activeRow}>
              <View style={s.activeDot} />
              <Text style={s.activeText}>Active now</Text>
            </View>
          ) : null}
        </View>
        <View style={s.moreBtn}>
          <MoreDotsIcon size={14} color={theme.ink} />
        </View>
      </View>

      {conversation ? (
        <View style={s.itemContext}>
          <View style={[s.itemThumb, { backgroundColor: itemHue }]} />
          <View style={{ flex: 1 }}>
            <Text style={s.itemTitle}>{itemTitle}</Text>
            <Text style={s.itemPrice}>AED {itemPriceAed?.toLocaleString()}</Text>
          </View>
          <Text style={s.viewLink}>View</Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={s.dayLabel}>Today</Text>

          {messages.map((m) => {
            if (m.kind === 'text' && m.text != null) {
              return <Bubble key={m.id} them={!m.fromMe} text={m.text} />;
            }
            if (m.kind === 'offer' && m.offer) {
              return (
                <View key={m.id} style={s.offerCard}>
                  <View style={s.offerBody}>
                    <Text style={s.offerLabel}>OFFER</Text>
                    <View style={s.offerPriceRow}>
                      <Text style={s.offerPrice}>AED {m.offer.priceAed.toLocaleString()}</Text>
                      <Text style={s.offerWas}>{m.offer.listedPriceAed.toLocaleString()}</Text>
                    </View>
                    {m.offer.pickupNote ? (
                      <Text style={s.offerSub}>{m.offer.pickupNote}</Text>
                    ) : null}
                  </View>
                  <View style={s.offerActions}>
                    <Pressable style={s.offerActionBtn}>
                      <Text style={s.offerActionDecline}>Decline</Text>
                    </Pressable>
                    <Pressable style={[s.offerActionBtn, s.offerActionDivider]}>
                      <Text style={s.offerActionCounter}>Counter</Text>
                    </Pressable>
                    <Pressable style={s.offerActionBtn}>
                      <Text style={s.offerActionAccept}>Accept</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }
            return null;
          })}

          <View style={s.typing}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[s.typingDot, { opacity: 0.5 - i * 0.15 }]} />
            ))}
          </View>
        </ScrollView>

        <View style={[s.composer, { paddingBottom: Math.max(insets.bottom + 8, 12) }]}>
          <View style={s.plusBtn}>
            <PlusIcon size={16} color={theme.blue} />
          </View>
          <View style={s.inputWrap}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={theme.inkDim}
              selectionColor={theme.orange}
              style={s.input}
            />
          </View>
          <Pressable
            disabled={!canSend}
            onPress={handleSend}
            style={[s.sendBtn, !canSend && s.sendBtnDisabled]}>
            <SendIcon size={16} color="#fff" />
          </Pressable>
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
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.blue,
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: theme.ink,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.success,
  },
  activeText: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.success,
  },
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContext: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemThumb: {
    width: 46,
    height: 46,
    borderRadius: 9,
  },
  itemTitle: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  itemPrice: {
    marginTop: 2,
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.blue,
  },
  viewLink: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.blue,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  dayLabel: {
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
    marginVertical: 4,
  },
  offerCard: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    borderRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.orange,
  },
  offerBody: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
  },
  offerLabel: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: theme.orange,
    letterSpacing: 0.7,
  },
  offerPriceRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  offerPrice: {
    fontFamily: FONT.bold,
    fontSize: 22,
    color: theme.ink,
    letterSpacing: -0.4,
  },
  offerWas: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.inkDim,
    textDecorationLine: 'line-through',
  },
  offerSub: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  offerActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
  },
  offerActionBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  offerActionDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: theme.line,
  },
  offerActionDecline: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.inkDim,
  },
  offerActionCounter: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
  },
  offerActionAccept: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.orange,
  },
  typing: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 18,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.inkDim,
  },
  composer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: theme.bg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.ink,
    padding: 0,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C9D1D9',
  },
});
