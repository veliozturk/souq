import { ActivityIndicator, Image, ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { Chip } from '../../components/Chip';
import {
  ChevronLeftIcon,
  ShareIcon,
  HeartIcon,
  VerifiedIcon,
  MessageBubbleIcon,
} from '../../components/icons';
import { useListing } from '../../api/queries';
import { demoHue } from '../../utils/demoHue';
import type { BrowseStackParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BrowseStackParamList, 'ItemDetail'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ItemDetail({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const listingQ = useListing(route.params.id);
  const listing = listingQ.data;

  if (listingQ.isPending) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={theme.blue} />
      </View>
    );
  }
  if (listingQ.isError || !listing) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={s.errorText}>Couldn't load this listing.</Text>
        <Pressable onPress={() => listingQ.refetch()} style={s.retryBtn}>
          <Text style={s.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const cover = listing.photos[0];
  const photoCount = Math.max(listing.photos.length, 1);
  const discount =
    listing.previousPriceAed && listing.previousPriceAed > 0
      ? Math.round(((listing.previousPriceAed - listing.priceAed) / listing.previousPriceAed) * 100)
      : null;
  const sellerInitial =
    listing.seller.avatarInitial ?? listing.seller.name.charAt(0).toUpperCase();

  return (
    <View style={s.root}>
      <View style={[s.floatingHeader, { top: insets.top + 4 }]}>
        <Pressable onPress={() => navigation.goBack()} style={s.circleBtn}>
          <ChevronLeftIcon size={9} />
        </Pressable>
        <View style={s.floatingRight}>
          <View style={s.circleBtn}>
            <ShareIcon size={14} />
          </View>
          <View style={s.circleBtn}>
            <HeartIcon size={16} />
          </View>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={[s.gallery, { backgroundColor: demoHue(listing.id) }]}>
          {cover ? (
            <Image source={{ uri: cover.url }} style={StyleSheet.absoluteFill} />
          ) : null}
          {listing.isBoosted ? (
            <View style={s.boostBadge}>
              <Text style={s.boostBadgeText}>BOOSTED</Text>
            </View>
          ) : null}
          <View style={s.dotsRow}>
            {Array.from({ length: photoCount }).map((_, i) => (
              <View key={i} style={[s.dot, i === 0 ? s.dotActive : null]} />
            ))}
          </View>
          <View style={s.counter}>
            <Text style={s.counterText}>1 / {photoCount}</Text>
          </View>
        </View>

        <View style={s.content}>
          <View style={s.priceRow}>
            <Text style={s.price}>AED {listing.priceAed.toLocaleString()}</Text>
            {listing.previousPriceAed ? (
              <Text style={s.was}>{listing.previousPriceAed.toLocaleString()}</Text>
            ) : null}
            {discount !== null && discount > 0 ? (
              <View style={s.discount}>
                <Text style={s.discountText}>−{discount}%</Text>
              </View>
            ) : null}
          </View>
          <Text style={s.title}>{listing.title.en}</Text>

          <View style={s.chipsRow}>
            <Chip>{listing.condition.name.en}</Chip>
            <Chip>{listing.category.name.en}</Chip>
            {listing.hasPickup ? <Chip>Pickup</Chip> : null}
          </View>

          <Text style={s.desc}>{listing.description.en}</Text>

          <Pressable
            onPress={() => navigation.navigate('SellerProfile', { id: listing.seller.id })}
            style={s.sellerCard}>
            <LinearGradient
              colors={[theme.blueSoft, theme.orangeSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.sellerAvatar}>
              <Text style={s.sellerAvatarText}>{sellerInitial}</Text>
            </LinearGradient>
            <View style={s.sellerBody}>
              <View style={s.sellerNameRow}>
                <Text style={s.sellerName}>{listing.seller.name}</Text>
                {listing.seller.isVerified ? (
                  <VerifiedIcon size={13} color={theme.blue} />
                ) : null}
              </View>
              <Text style={s.sellerMeta}>
                @{listing.seller.handle} · Joined {listing.seller.joinedYear}
              </Text>
            </View>
            <Text style={s.sellerView}>View</Text>
          </Pressable>

          <View style={s.locCard}>
            <LinearGradient
              colors={[theme.blueSoft, theme.orangeSoft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.locThumb}>
              <View style={[s.mapLine, { top: 6 }]} />
              <View style={[s.mapLine, { top: 18 }]} />
              <View style={[s.mapLine, { top: 30 }]} />
              <View style={s.mapPin} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={s.locTitle}>{listing.neighborhood.name.en}</Text>
              {listing.pickupNote ? (
                <Text style={s.locSubtitle}>{listing.pickupNote}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={s.saveBtn}>
          <HeartIcon size={20} color={theme.blue} />
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate('SendMessage', {
              itemId: listing.id,
              sellerId: listing.seller.id,
            })
          }
          style={s.messageBtn}>
          <MessageBubbleIcon size={16} color={theme.blue} />
          <Text style={s.messageBtnText}>Message</Text>
        </Pressable>
        {listing.acceptOffers ? (
          <Pressable style={s.offerBtn}>
            <Text style={s.offerBtnText}>Make offer</Text>
          </Pressable>
        ) : null}
      </View>
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
  floatingRight: {
    flexDirection: 'row',
    gap: 8,
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
  gallery: {
    height: 320,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#fff',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  counterText: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: '#fff',
  },
  content: {
    padding: 18,
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
  },
  price: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
  },
  was: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
    textDecorationLine: 'line-through',
  },
  discount: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: theme.orangeSoft,
  },
  discountText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: theme.orange,
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: FONT.semibold,
    fontSize: 17,
    color: theme.ink,
    marginTop: 4,
    lineHeight: 21,
  },
  chipsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 6,
  },
  desc: {
    marginTop: 14,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.ink,
    lineHeight: 19,
  },
  descMore: {
    fontFamily: FONT.semibold,
    color: theme.blue,
  },
  sellerCard: {
    marginTop: 16,
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerAvatarText: {
    fontFamily: FONT.bold,
    fontSize: 16,
    color: theme.blue,
  },
  sellerBody: {
    flex: 1,
    minWidth: 0,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerName: {
    fontFamily: FONT.bold,
    fontSize: 14,
    color: theme.ink,
  },
  sellerMeta: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
    marginTop: 1,
  },
  sellerView: {
    fontFamily: FONT.bold,
    fontSize: 11,
    color: theme.blue,
  },
  locCard: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mapLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: theme.line,
  },
  mapPin: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.orange,
    borderWidth: 2,
    borderColor: '#fff',
  },
  locTitle: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  locSubtitle: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
    marginTop: 1,
  },
  bottomBar: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageBtnText: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: theme.blue,
  },
  offerBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.orange,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  offerBtnText: {
    fontFamily: FONT.bold,
    fontSize: 15,
    color: '#fff',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
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
  boostBadge: {
    position: 'absolute',
    top: 70,
    left: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: theme.orange,
  },
  boostBadgeText: {
    fontFamily: FONT.bold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
});
