import { ActivityIndicator, Image, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { Stat } from '../../components/Stat';
import {
  ChevronLeftIcon,
  MoreDotsIcon,
  VerifiedIcon,
  MessageBubbleIcon,
} from '../../components/icons';
import { useUser, useListings } from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import type { BrowseStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'SellerProfile'>;

export default function SellerProfile({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const sellerId = route.params.id;
  const userQ = useUser(sellerId);
  const listingsQ = useListings({ sellerId });
  const user = userQ.data;
  const listings = listingsQ.data ?? [];
  const initial = user?.avatarInitial ?? user?.name?.[0] ?? '?';
  const homeNbh = user?.homeNeighborhood?.name.en ?? '';
  return (
    <View style={s.root}>
      <View style={[s.floatingHeader, { top: insets.top + 4 }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.circleBtn}>
          <ChevronLeftIcon size={9} />
        </Pressable>
        <View style={s.circleBtn}>
          <MoreDotsIcon size={14} />
        </View>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[theme.blue, theme.blue, theme.bg]}
          locations={[0, 0.7, 1]}
          style={[s.hero, { paddingTop: insets.top + 70 }]}>
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />

          <View style={s.heroInner}>
            <LinearGradient
              colors={[theme.blueSoft, theme.orangeSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.avatar}>
              <Text style={s.avatarText}>{initial}</Text>
            </LinearGradient>

            <View style={s.nameRow}>
              <Text style={s.name}>{user?.name ?? '...'}</Text>
              {user?.isVerified ? <VerifiedIcon size={16} color="#fff" /> : null}
            </View>
            <Text style={s.handle}>
              @{user?.handle ?? '...'}
              {homeNbh ? ` · ${homeNbh}` : ''}
              {user?.joinedYear ? ` · Joined ${user.joinedYear}` : ''}
            </Text>

            <View style={s.statsCard}>
              <Stat k="Rating" v={user?.ratingAvg != null ? `★ ${user.ratingAvg}` : '—'} />
              <Stat k="Sold" v={user ? String(user.soldCount) : '—'} />
              <Stat k="Active" v={String(listings.length)} />
              <Stat k="Reply" v={user?.replyTime ?? '—'} />
            </View>

            <View style={s.actionsRow}>
              <View style={s.followBtn}>
                <Text style={s.followBtnText}>Follow</Text>
              </View>
              <Pressable style={s.messageBtn}>
                <MessageBubbleIcon size={14} color="#fff" />
                <Text style={s.messageBtnText}>Message</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <View style={s.tabsRow}>
          {[
            `Listings · ${listings.length}`,
            user ? `Sold · ${user.soldCount}` : 'Sold',
          ].map((tab, i) => {
            const on = i === 0;
            return (
              <View key={tab} style={s.tab}>
                <Text style={[s.tabText, on && s.tabTextOn]}>{tab}</Text>
                {on ? <View style={s.tabUnderline} /> : null}
              </View>
            );
          })}
        </View>

        {listingsQ.isPending ? (
          <View style={s.gridStatus}>
            <ActivityIndicator color={theme.blue} />
          </View>
        ) : (
          <View style={s.itemsGrid}>
            {listings.map((it) => {
              const thumb = it.coverPhoto?.thumbUrl ?? it.coverPhoto?.url ?? null;
              return (
                <Pressable
                  key={it.id}
                  onPress={() => navigation.navigate('ItemDetail', { id: it.id })}
                  style={s.itemTile}>
                  <View style={[s.itemImg, { backgroundColor: theme.blueSoft }]}>
                    {thumb ? (
                      <Image source={{ uri: photoUri(thumb) }} style={StyleSheet.absoluteFill} />
                    ) : null}
                  </View>
                  <View style={s.itemBody}>
                    <Text style={s.itemPrice}>AED {it.priceAed.toLocaleString()}</Text>
                    <Text style={s.itemTitle} numberOfLines={1}>
                      {it.title.en}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  floatingHeader: {
    position: 'absolute',
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scroll: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    right: -30,
    top: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroCircle2: {
    position: 'absolute',
    left: -40,
    bottom: 0,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.orange,
    opacity: 0.2,
  },
  heroInner: {
    alignItems: 'center',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarText: {
    fontFamily: FONT.bold,
    fontSize: 30,
    color: theme.blue,
  },
  nameRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: 20,
    color: '#fff',
    letterSpacing: -0.3,
  },
  handle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
  },
  statsCard: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.surface,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    alignSelf: 'stretch',
  },
  actionsRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
  },
  followBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtnText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
  },
  messageBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.orange,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  messageBtnText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: '#fff',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 22,
    position: 'relative',
  },
  tabText: {
    fontFamily: FONT.medium,
    fontSize: 13,
    color: theme.inkDim,
  },
  tabTextOn: {
    fontFamily: FONT.bold,
    color: theme.ink,
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 2.5,
    backgroundColor: theme.orange,
    borderRadius: 2,
  },
  itemsGrid: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemTile: {
    width: '33.333%',
    padding: 4,
  },
  itemImg: {
    aspectRatio: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  itemBody: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.line,
  },
  itemPrice: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.blue,
  },
  itemTitle: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: theme.ink,
  },
  reviewWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  reviewLabel: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.inkDim,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  reviewCard: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.line,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  reviewName: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: theme.ink,
  },
  reviewTime: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: theme.inkDim,
  },
  reviewStars: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.orange,
    marginTop: 2,
    letterSpacing: 1,
  },
  reviewText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.ink,
    marginTop: 4,
    lineHeight: 17,
  },
  gridStatus: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});
