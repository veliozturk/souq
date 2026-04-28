import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme, FONT } from '../../theme';
import { ChevronLeftIcon, MapPinIcon, CheckIcon } from '../../components/icons';
import { useAuthStub } from '../../auth/AuthStub';
import { useNeighborhoods } from '../../api/queries';
import type { BrowseStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<BrowseStackParamList, 'LocationPicker'>;

export default function LocationPicker({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { currentUser, updateMe } = useAuthStub();
  const { data: neighborhoods = [] } = useNeighborhoods();
  const selectedId = currentUser?.homeNeighborhood?.id ?? null;

  return (
    <View style={s.root}>
      <View style={[s.headerWrap, { paddingTop: insets.top + 8 }]}>
        <View style={s.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <ChevronLeftIcon size={9} />
          </Pressable>
          <Text style={s.title}>Browsing in</Text>
          <View style={s.backBtn} />
        </View>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        <Text style={s.section}>POPULAR IN DUBAI</Text>
        {neighborhoods.map((h) => {
          const selected = h.id === selectedId;
          return (
            <Pressable
              key={h.id}
              onPress={() => {
                updateMe({
                  homeNeighborhood: { id: h.id, slug: h.slug, name: h.name },
                });
                navigation.goBack();
              }}
              style={[s.row, selected && s.rowSelected]}>
              <View style={[s.rowIcon, { backgroundColor: selected ? theme.orange : theme.blueSoft }]}>
                <MapPinIcon
                  size={16}
                  color={selected ? '#fff' : theme.blue}
                  innerColor={selected ? theme.orange : '#fff'}
                />
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowName}>{h.name.en}</Text>
              </View>
              {selected ? (
                <View style={s.rowCheck}>
                  <CheckIcon size={12} color="#fff" />
                </View>
              ) : null}
            </Pressable>
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
    justifyContent: 'space-between',
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
  section: {
    marginTop: 4,
    marginBottom: 4,
    fontFamily: FONT.semibold,
    fontSize: 12,
    color: theme.inkDim,
    letterSpacing: 0.8,
  },
  row: {
    height: 60,
    borderRadius: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  rowSelected: {
    borderWidth: 2,
    borderColor: theme.orange,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  rowCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
