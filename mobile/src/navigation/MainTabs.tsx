import type { ReactElement } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from './types';
import { theme, FONT } from '../theme';
import { BrowseStack } from './BrowseStack';
import { ListingStack } from './ListingStack';
import { InboxStack } from './InboxStack';
import { MeStack } from './MeStack';
import Saved from '../screens/Saved';
import { useConversations } from '../api/queries';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_LABELS: Record<keyof MainTabsParamList, string> = {
  HomeTab: 'Home',
  SavedTab: 'Saved',
  SellTab: 'Sell',
  InboxTab: 'Inbox',
  MeTab: 'Me',
};

type IconProps = { color: string };

function HomeIcon({ color }: IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M2 10l9-7 9 7v10H2V10z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

function SavedIcon({ color }: IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M11 19l-7-5a5 5 0 017-7 5 5 0 017 7l-7 5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

function InboxIcon({ color }: IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path d="M3 5h16v12H7l-4 3V5z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

function MeIcon({ color }: IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Circle cx={11} cy={8} r={3.5} stroke={color} strokeWidth={1.6} />
      <Path d="M4 19c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

const TAB_ICONS: Partial<Record<keyof MainTabsParamList, (props: IconProps) => ReactElement>> = {
  HomeTab: HomeIcon,
  SavedTab: SavedIcon,
  InboxTab: InboxIcon,
  MeTab: MeIcon,
};

function useTabBadges(): Partial<Record<keyof MainTabsParamList, number>> {
  const { data: conversations = [] } = useConversations();
  const inboxUnread = conversations.filter((c) => c.unread).length;
  return {
    InboxTab: inboxUnread > 0 ? inboxUnread : undefined,
  };
}

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const badges = useTabBadges();
  const activeRoute = state.routes[state.index];
  const nestedRouteName = getFocusedRouteNameFromRoute(activeRoute);
  if (activeRoute.name === 'InboxTab' && (nestedRouteName === 'Chat' || nestedRouteName === 'ItemDetail')) {
    return null;
  }
  if (
    activeRoute.name === 'HomeTab' &&
    (nestedRouteName === 'ItemDetail' || nestedRouteName === 'LocationPicker')
  ) {
    return null;
  }
  if (
    activeRoute.name === 'MeTab' &&
    (nestedRouteName === 'EditListing' ||
      nestedRouteName === 'EditPhotos' ||
      nestedRouteName === 'EditProfile' ||
      nestedRouteName === 'LocationPicker')
  ) {
    return null;
  }
  if (activeRoute.name === 'SellTab') {
    return null;
  }
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const name = route.name as keyof MainTabsParamList;
        const label = TAB_LABELS[name] ?? route.name;
        const isSell = route.name === 'SellTab';
        const badge = badges[name];
        const Icon = TAB_ICONS[name];
        const iconColor = focused ? theme.blue : theme.inkDim;
        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name as never);
              }
            }}
            style={s.tab}>
            {isSell ? (
              <View style={s.sellPill}>
                <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                  <Path d="M11 3v16M3 11h16" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
                </Svg>
              </View>
            ) : (
              <View style={s.iconColumn}>
                <View style={s.iconWrap}>
                  {Icon ? <Icon color={iconColor} /> : null}
                  {badge !== undefined ? (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[s.label, focused && s.labelFocused]}>{label}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="HomeTab" component={BrowseStack} />
      <Tab.Screen name="SavedTab" component={Saved} />
      <Tab.Screen name="SellTab" component={ListingStack} />
      <Tab.Screen name="InboxTab" component={InboxStack} />
      <Tab.Screen name="MeTab" component={MeStack} />
    </Tab.Navigator>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: theme.inkDim,
  },
  labelFocused: {
    color: theme.blue,
    fontFamily: FONT.semibold,
  },
  sellPill: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    shadowColor: theme.buttonShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  iconColumn: {
    alignItems: 'center',
    gap: 4,
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.orange,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    lineHeight: 13,
  },
});
