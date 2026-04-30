import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  theme,
  FONT,
  loadThemePreference,
  saveThemePreference,
  type ThemeName,
} from '../../theme';
import { BackBtn } from '../../components/BackBtn';
import { CheckCircleIcon } from '../../components/icons';
import type { MeStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MeStackParamList, 'Appearance'>;

const OPTIONS: { id: ThemeName; label: string; description: string }[] = [
  { id: 'sand', label: 'Sand', description: 'Warm earthy tones' },
  { id: 'blue', label: 'Blue', description: 'Cool blue and orange' },
  { id: 'amber', label: 'Warm Amber', description: 'Amber and clay on cream' },
];

export default function Appearance({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ThemeName>('sand');

  useEffect(() => {
    loadThemePreference().then((name) => {
      if (name) setSelected(name);
    });
  }, []);

  const onPick = async (name: ThemeName) => {
    setSelected(name);
    await saveThemePreference(name);
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <BackBtn onPress={() => navigation.goBack()} />
          <Text style={s.headerTitle}>Appearance</Text>
        </View>
      </View>

      <View style={s.body}>
        <View style={s.card}>
          {OPTIONS.map((opt, i) => {
            const on = opt.id === selected;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onPick(opt.id)}
                style={[s.row, i < OPTIONS.length - 1 && s.rowDivider]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>{opt.label}</Text>
                  <Text style={s.rowDesc}>{opt.description}</Text>
                </View>
                {on ? <CheckCircleIcon size={20} color={theme.success} /> : null}
              </Pressable>
            );
          })}
        </View>
        <Text style={s.footnote}>Applied on next app open.</Text>
      </View>
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
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: 24,
    color: theme.ink,
    letterSpacing: -0.5,
  },
  body: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.line,
  },
  rowLabel: {
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: theme.ink,
  },
  rowDesc: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: theme.inkDim,
  },
  footnote: {
    marginTop: 12,
    paddingHorizontal: 4,
    fontFamily: FONT.medium,
    fontSize: 12,
    color: theme.inkDim,
  },
});
