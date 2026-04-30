import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../../theme';
import { ChevronLeftIcon } from '../../components/icons';
import type { BrowseStackParamList, MainTabsParamList } from '../../navigation/types';
import { NOTIFICATIONS } from '../../data/fixtures/notifications';
import type { Notification } from '../../api/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'Notifications'>;

type InboxTarget = { tab: 'InboxTab'; screen: 'InboxList' | 'Offers' };

function inboxTargetFor(kind: Notification['kind']): InboxTarget | null {
  if (kind === 'message') return { tab: 'InboxTab', screen: 'InboxList' };
  if (kind === 'offer') return { tab: 'InboxTab', screen: 'Offers' };
  return null;
}

export default function Notifications({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (n: Notification) => {
    const target = inboxTargetFor(n.kind);
    if (!target) return;
    const parent = navigation.getParent<BottomTabNavigationProp<MainTabsParamList>>();
    parent?.navigate(target.tab, { screen: target.screen });
  };

  return (
    <View style={s.root}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 8 }]}>
        <View style={s.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          <Text style={s.title}>Notifications</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((n) => {
          const linkable = inboxTargetFor(n.kind) !== null;
          const inner = (
            <>
              <View style={[s.dot, { backgroundColor: n.read ? theme.line : theme.orange }]} />
              <View style={s.body}>
                <Text style={[s.rowTitle, !n.read && s.rowTitleUnread]} numberOfLines={1}>
                  {n.title}
                </Text>
                <Text style={s.rowBody} numberOfLines={2}>
                  {n.body}
                </Text>
              </View>
              <Text style={s.time}>{n.relativeTime}</Text>
            </>
          );

          if (linkable) {
            return (
              <Pressable
                key={n.id}
                accessibilityRole="button"
                onPress={() => handlePress(n)}
                style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}
              >
                {inner}
              </Pressable>
            );
          }

          return (
            <View key={n.id} style={s.row}>
              {inner}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.ink,
    letterSpacing: -0.3,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  body: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  rowTitleUnread: {
    fontFamily: FONT.bold,
  },
  rowBody: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
    marginTop: 2,
    lineHeight: 16,
  },
  time: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
});
