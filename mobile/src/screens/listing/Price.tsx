import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { MinimalHeader } from '../../components/MinimalHeader';
import { PrimaryBtn } from '../../components/PrimaryBtn';
import { Toggle } from '../../components/Toggle';
import { useListingDraft } from './ListingDraftContext';
import type { ListingStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ListingStackParamList, 'ListingPrice'>;

export default function ListingPrice({ navigation }: Props) {
  const { draft, patch } = useListingDraft();
  const price = draft.priceAed;
  const acceptOffers = draft.acceptOffers;
  const setPrice = (v: string) => patch({ priceAed: v });
  const setAcceptOffers = (v: boolean) => patch({ acceptOffers: v });
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <MinimalHeader
        step={3}
        total={5}
        onBack={() => navigation.goBack()}
        onSkip={() => navigation.navigate('ListingPreview')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={s.flex}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={s.title}>Set your price.</Text>

          <View style={s.priceCard}>
            <View style={s.aedBadge}>
              <Text style={s.aedText}>AED</Text>
            </View>
            <TextInput
              value={price}
              onChangeText={(v) => setPrice(v.replace(/[^0-9]/g, '').slice(0, 7))}
              keyboardType="number-pad"
              selectionColor={theme.orange}
              style={s.priceInput}
            />
          </View>

          <View style={s.toggleRow}>
            <Toggle on={acceptOffers} onChange={setAcceptOffers} />
            <Text style={s.toggleLabel}>Accept offers</Text>
          </View>
        </ScrollView>
        <View style={[s.actions, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <PrimaryBtn onPress={() => navigation.navigate('ListingPreview')} disabled={!price}>
            Continue
          </PrimaryBtn>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 26,
    color: theme.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  priceCard: {
    marginTop: 28,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.blue,
    paddingVertical: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  aedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
  },
  aedText: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.blue,
    letterSpacing: -0.2,
  },
  priceInput: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 44,
    color: theme.ink,
    letterSpacing: -1.2,
    padding: 0,
  },
  rangeCard: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  rangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  rangeLabel: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  rangeMeta: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  rangeBarWrap: {
    marginTop: 14,
    height: 18,
    justifyContent: 'center',
  },
  rangeBar: {
    height: 10,
    borderRadius: 6,
    opacity: 0.22,
  },
  rangeMarker: {
    position: 'absolute',
    left: '58%',
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: theme.ink,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rangeLabels: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabelText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  rangeLabelHi: {
    fontFamily: FONT.bold,
    color: theme.orange,
  },
  predictRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.orangeSoft,
  },
  predictDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.orange,
  },
  predictText: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: theme.ink,
  },
  predictStrong: {
    fontFamily: FONT.bold,
  },
  toggleRow: {
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 15,
    color: theme.ink,
  },
  actions: {
    backgroundColor: theme.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.line,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
});
