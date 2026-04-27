import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { theme, FONT } from '../../theme';
import {
  CloseIcon,
  CameraSlotIcon,
  PictureIcon,
  ChevronRightIcon,
} from '../../components/icons';
import { useDrafts } from '../../api/queries';
import { useListingDraft } from './ListingDraftContext';
import type {
  ListingStackParamList,
  MainTabsParamList,
} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ListingStackParamList, 'ListingStart'>,
  BottomTabScreenProps<MainTabsParamList>
>;

function draftMeta(d: { photoCount: number; hasPrice: boolean }): string {
  const parts: string[] = ['Draft'];
  if (d.photoCount > 0) parts.push(`${d.photoCount} photo${d.photoCount === 1 ? '' : 's'}`);
  if (!d.hasPrice) parts.push('Not priced');
  return parts.join(' · ');
}

export default function ListingStart({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { data: drafts = [] } = useDrafts();
  const { reset } = useListingDraft();

  const closeFlow = () => {
    reset();
    navigation.getParent<any>()?.navigate('HomeTab');
  };

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 18 }]}>
        <Text style={s.headerTitle}>New listing</Text>
        <Pressable onPress={closeFlow} style={s.closeBtn}>
          <CloseIcon size={14} color={theme.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Let's sell something{'\n'}that's collecting dust.</Text>
        <Text style={s.subtitle}>Most items in Dubai Marina sell in under 3 days.</Text>

        <Pressable onPress={() => navigation.navigate('ListingPhotos')} style={s.heroBtn}>
          <LinearGradient
            colors={[theme.blue, theme.blue, theme.orange]}
            locations={[0, 0.6, 1.4]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.heroGradient}>
            <View style={s.heroCircle1} />
            <View style={s.heroCircle2} />
            <View style={s.heroInner}>
              <Text style={s.heroEyebrow}>Start fresh</Text>
              <Text style={s.heroTitle}>Create a new listing</Text>
              <View style={s.heroCta}>
                <CameraSlotIcon size={18} color={theme.blue} />
                <Text style={s.heroCtaText}>Take a photo</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {drafts.length > 0 ? (
          <>
            <View style={s.draftsHeader}>
              <Text style={s.draftsTitle}>YOUR DRAFTS · {drafts.length}</Text>
              <Text style={s.draftsSeeAll}>See all</Text>
            </View>

            <View style={s.draftsList}>
              {drafts.map((d) => (
                <View key={d.id} style={s.draft}>
                  <View style={s.draftIcon}>
                    <PictureIcon size={22} color={theme.blue} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={s.draftTitle}>{d.title ?? 'Untitled draft'}</Text>
                    <Text style={s.draftMeta}>{draftMeta(d)}</Text>
                  </View>
                  <ChevronRightIcon size={8} color={theme.inkDim} />
                </View>
              ))}
            </View>
          </>
        ) : null}
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
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: 22,
    color: theme.ink,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    letterSpacing: -0.6,
    lineHeight: 31,
  },
  subtitle: {
    marginTop: 12,
    fontFamily: FONT.regular,
    fontSize: 15,
    color: theme.inkDim,
    lineHeight: 22,
  },
  heroBtn: {
    marginTop: 22,
    borderRadius: 22,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 22,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  heroCircle1: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroCircle2: {
    position: 'absolute',
    right: 30,
    bottom: -40,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.orange,
    opacity: 0.35,
  },
  heroInner: {
    position: 'relative',
  },
  heroEyebrow: {
    fontFamily: FONT.medium,
    fontSize: 15,
    color: '#fff',
    opacity: 0.8,
  },
  heroTitle: {
    marginTop: 4,
    fontFamily: FONT.bold,
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  heroCta: {
    marginTop: 18,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroCtaText: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  draftsHeader: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  draftsTitle: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  draftsSeeAll: {
    fontFamily: FONT.semibold,
    fontSize: 13,
    color: theme.blue,
  },
  draftsList: {
    marginTop: 12,
    gap: 10,
  },
  draft: {
    height: 64,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  draftIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftTitle: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  draftMeta: {
    marginTop: 2,
    fontFamily: FONT.medium,
    fontSize: 12,
    color: theme.orange,
  },
});
