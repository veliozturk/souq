import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { useOffers } from '../../api/queries';
import { photoUri } from '../../api/photoUri';
import type { OfferState } from '../../api/types';
import { demoHue } from '../../utils/demoHue';
import type { InboxStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'Offers'>;

const STATUS: Record<OfferState, { bg: string; fg: string; label: string }> = {
  new: { bg: theme.orange, fg: '#fff', label: 'New' },
  countered: { bg: theme.blueSoft, fg: theme.blue, label: 'Countered' },
  expiring: { bg: '#FEF3C7', fg: '#92400E', label: 'Expiring' },
  declined: { bg: theme.line, fg: theme.inkDim, label: 'Declined' },
  accepted: { bg: theme.blueSoft, fg: theme.blue, label: 'Accepted' },
};

export default function Offers({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: offers = [] } = useOffers();
  const newCount = offers.filter((o) => o.state === 'new').length;
  const expiringCount = offers.filter((o) => o.state === 'expiring').length;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <BackBtn onPress={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Offers</Text>
          <Text style={s.subtitle}>{newCount} new · {expiringCount} expiring today</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {offers.map((o) => {
          const st = STATUS[o.state];
          const pctDown = Math.round((1 - o.offerAed / o.listing.priceAed) * 100);
          const isHigh = pctDown > 20;
          return (
            <View
              key={o.id}
              style={[s.card, o.state === 'new' && s.cardNew]}>
              <View style={[s.thumb, { backgroundColor: demoHue(o.listing.id) }]}>
                {o.listing.coverPhoto ? (
                  <Image
                    source={{ uri: photoUri(o.listing.coverPhoto.thumbUrl ?? o.listing.coverPhoto.url) }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={s.cardHead}>
                  <Text style={s.buyer} numberOfLines={1}>
                    {o.buyer.displayName}
                  </Text>
                  <View style={[s.statusBadge, { backgroundColor: st.bg }]}>
                    <Text style={[s.statusText, { color: st.fg }]}>{st.label.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={s.itemLine} numberOfLines={1}>
                  {o.listing.title}
                </Text>
                <View style={s.priceRow}>
                  <Text style={s.price}>AED {o.offerAed.toLocaleString()}</Text>
                  <Text style={s.was}>{o.listing.priceAed.toLocaleString()}</Text>
                  <Text style={[s.pct, isHigh && s.pctHigh]}>−{pctDown}%</Text>
                  <View style={{ flex: 1 }} />
                  <Text style={[s.time, o.state === 'expiring' && s.timeExpiring]}>{o.relativeTime}</Text>
                </View>
              </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: theme.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.inkDim,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 10,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardNew: {
    borderWidth: 2,
    borderColor: theme.orange,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 11,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  buyer: {
    flex: 1,
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.ink,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  statusText: {
    fontFamily: FONT.bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  itemLine: {
    marginTop: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
  },
  priceRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontFamily: FONT.bold,
    fontSize: 17,
    color: theme.ink,
    letterSpacing: -0.3,
  },
  was: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: theme.inkDim,
    textDecorationLine: 'line-through',
  },
  pct: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: theme.inkDim,
  },
  pctHigh: {
    color: '#C53030',
  },
  time: {
    fontFamily: FONT.semibold,
    fontSize: 10,
    color: theme.inkDim,
  },
  timeExpiring: {
    color: '#C53030',
  },
});
