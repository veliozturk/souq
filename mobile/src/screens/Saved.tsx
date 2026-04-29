import { useCallback } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../theme';
import { HeartIcon } from '../components/icons';
import { useFavorites, useFavoriteToggle } from '../api/queries';
import { photoUri } from '../api/photoUri';
import { demoHue } from '../utils/demoHue';
import type { MainTabsParamList } from '../navigation/types';

type Props = BottomTabScreenProps<MainTabsParamList, 'SavedTab'>;

export default function Saved({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: favorites = [], isPending, isError, isRefetching, refetch } = useFavorites();
  const { toggle } = useFavoriteToggle();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const confirmRemove = (it: (typeof favorites)[number]) => {
    Alert.alert(
      'Remove from saved?',
      it.title.original,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => toggle(it) },
      ],
    );
  };

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Text style={s.title}>Saved</Text>
        <Text style={s.subtitle}>{favorites.length} item{favorites.length === 1 ? '' : 's'}</Text>
      </View>

      {isPending ? (
        <View style={s.statusBox}>
          <ActivityIndicator color={theme.blue} />
        </View>
      ) : isError ? (
        <View style={s.statusBox}>
          <Text style={s.statusText}>Couldn't load saved items.</Text>
          <Pressable onPress={() => refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : favorites.length === 0 ? (
        <View style={s.statusBox}>
          <Text style={s.statusText}>You haven't saved any items yet.</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.inkDim} />
          }>
          <View style={s.grid}>
            {favorites.map((it) => {
              const thumb = it.coverPhoto?.thumbUrl ?? it.coverPhoto?.url ?? null;
              return (
                <Pressable
                  key={it.id}
                  onPress={() =>
                    navigation.navigate('HomeTab', { screen: 'ItemDetail', params: { id: it.id } })
                  }
                  style={s.cardOuter}>
                  <View style={s.card}>
                    <View style={[s.cardImage, { backgroundColor: demoHue(it.id) }]}>
                      {thumb ? <Image source={{ uri: photoUri(thumb) }} style={StyleSheet.absoluteFill} /> : null}
                      <Pressable
                        onPress={() => confirmRemove(it)}
                        hitSlop={8}
                        style={s.heartBtn}>
                        <HeartIcon size={14} color={theme.orange} filled />
                      </Pressable>
                    </View>
                    <View style={s.cardBody}>
                      <Text style={s.cardPrice}>AED {it.priceAed.toLocaleString()}</Text>
                      <Text style={s.cardTitle} numberOfLines={1}>
                        {it.title.original}
                      </Text>
                      <Text style={s.cardLoc}>{it.neighborhood.name.en}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
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
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardOuter: {
    width: '50%',
    padding: 5,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: 'hidden',
  },
  cardImage: {
    aspectRatio: 1,
  },
  heartBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 8,
    paddingHorizontal: 10,
  },
  cardPrice: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.blue,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: FONT.medium,
    fontSize: 12,
    color: theme.ink,
    marginTop: 2,
  },
  cardLoc: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: theme.inkDim,
    marginTop: 2,
  },
  statusBox: {
    paddingVertical: 64,
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
  retryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
  },
  retryText: {
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.blue,
  },
});
