import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { MainTabsParamList } from './types';
import { theme, FONT } from '../theme';
import { BrowseStack } from './BrowseStack';
import { ListingStack } from './ListingStack';
import { InboxStack } from './InboxStack';
import { MeStack } from './MeStack';
import Saved from '../screens/Saved';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_LABELS: Record<keyof MainTabsParamList, string> = {
  HomeTab: 'Home',
  SavedTab: 'Saved',
  SellTab: 'Sell',
  InboxTab: 'Inbox',
  MeTab: 'Me',
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = TAB_LABELS[route.name as keyof MainTabsParamList] ?? route.name;
        const isSell = route.name === 'SellTab';
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
                <Text style={s.sellPillText}>+</Text>
              </View>
            ) : (
              <Text style={[s.label, focused && s.labelFocused]}>{label}</Text>
            )}
            {isSell ? <Text style={[s.label, focused && s.labelFocused]}>{label}</Text> : null}
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
    paddingTop: 8,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sellPillText: {
    color: theme.surface,
    fontFamily: FONT.bold,
    fontSize: 22,
    lineHeight: 24,
  },
});
