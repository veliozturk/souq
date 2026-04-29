import { useCallback, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, TextInput, Image, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { SearchIcon } from '../../components/icons';
import { useConversations } from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import { demoHue } from '../../utils/demoHue';
import type { InboxStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'InboxList'>;

const FILTERS = ['All', 'Buying', 'Selling', 'Offers'];

export default function Inbox({ navigation }: Props) {
  const [filter, setFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();
  const { data: conversations = [], refetch, isRefetching } = useConversations();
  const unreadCount = conversations.filter((c) => c.unread).length;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const q = searchText.trim().toLowerCase();
  const visibleConversations = conversations.filter((c) => {
    if (filter === 'Buying' && c.iAmSeller) return false;
    if (filter === 'Selling' && !c.iAmSeller) return false;
    if (filter === 'Offers' && !c.hasOffer) return false;
    if (!q) return true;
    return (
      c.peer.displayName.toLowerCase().includes(q) ||
      c.listing.title.toLowerCase().includes(q) ||
      c.lastMessage.text.toLowerCase().includes(q)
    );
  });

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.titleRow}>
          <Text style={s.title}>Inbox</Text>
          {unreadCount > 0 ? (
            <View style={s.newBadge}>
              <Text style={s.newBadgeText}>{unreadCount} new</Text>
            </View>
          ) : null}
        </View>
        <View style={s.search}>
          <SearchIcon size={14} color={theme.inkDim} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search messages"
            placeholderTextColor={theme.inkDim}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            style={s.searchInput}
          />
        </View>
        <View style={s.filterRow}>
          {FILTERS.map((f) => {
            const on = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[s.filterChip, on ? s.filterChipOn : s.filterChipOff]}>
                <Text style={[s.filterText, { color: on ? '#fff' : theme.ink }]}>{f}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.inkDim} />
        }>
        {visibleConversations.length === 0 ? (
          <Text style={s.emptyText}>No conversations</Text>
        ) : null}
        {visibleConversations.map((c, i) => (
          <Pressable
            key={c.id}
            onPress={() => navigation.navigate('Chat', { threadId: c.id })}
            style={[s.row, i < visibleConversations.length - 1 && s.rowDivider]}>
            <View style={s.avatarWrap}>
              <View style={[s.itemThumb, { backgroundColor: demoHue(c.listing.id) }]}>
                {c.listing.coverPhoto ? (
                  <Image
                    source={{ uri: photoUri(c.listing.coverPhoto.thumbUrl ?? c.listing.coverPhoto.url) }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
              </View>
              <LinearGradient
                colors={[theme.blueSoft, theme.orangeSoft]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.avatarOverlay}>
                <Text style={s.avatarText}>{c.peer.avatarInitial ?? c.peer.displayName[0]}</Text>
              </LinearGradient>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={s.nameRow}>
                <Text style={[s.name, c.unread && s.nameUnread]}>{c.peer.displayName}</Text>
                <Text
                  style={[
                    s.time,
                    c.unread ? s.timeUnread : null,
                  ]}>
                  {c.lastMessage.relativeTime}
                </Text>
              </View>
              <Text style={s.itemLine} numberOfLines={1}>
                on · {c.listing.title}
              </Text>
              <View style={s.lastRow}>
                {c.hasOffer ? (
                  <View style={s.offerChip}>
                    <Text style={s.offerChipText}>OFFER</Text>
                  </View>
                ) : null}
                <Text
                  style={[s.lastText, c.unread ? s.lastTextUnread : null]}
                  numberOfLines={1}>
                  {c.lastMessage.fromMe ? `You: ${c.lastMessage.text}` : c.lastMessage.text}
                </Text>
              </View>
            </View>
            {c.unread ? <View style={s.unreadDot} /> : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
  },
  newBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: theme.orangeSoft,
  },
  newBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.orange,
  },
  search: {
    marginTop: 12,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.ink,
    padding: 0,
  },
  emptyText: {
    marginTop: 32,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
  },
  filterRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  filterChipOn: {
    backgroundColor: theme.blue,
  },
  filterChipOff: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  filterText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
  },
  avatarWrap: {
    position: 'relative',
  },
  itemThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  avatarOverlay: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: theme.blue,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: theme.ink,
  },
  nameUnread: {
    fontFamily: FONT.bold,
  },
  time: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: theme.inkDim,
  },
  timeUnread: {
    fontFamily: FONT.bold,
    color: theme.orange,
  },
  itemLine: {
    marginTop: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  lastRow: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offerChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: theme.orange,
  },
  offerChipText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
  lastText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
  lastTextUnread: {
    fontFamily: FONT.medium,
    color: theme.ink,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.orange,
  },
});
