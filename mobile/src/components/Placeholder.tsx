import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { theme, FONT } from '../theme';
import { PrimaryBtn } from './PrimaryBtn';
import { SecondaryBtn } from './SecondaryBtn';

type Action = { label: string; onPress: () => void; variant?: 'primary' | 'secondary' };

export function Placeholder({ name, actions = [] }: { name: string; actions?: Action[] }) {
  return (
    <ScrollView contentContainerStyle={s.root}>
      <Text style={s.tag}>PLACEHOLDER</Text>
      <Text style={s.name}>{name}</Text>
      <Text style={s.note}>This screen is a stub during scaffolding.</Text>
      <View style={s.actions}>
        {actions.map((a, i) =>
          a.variant === 'secondary' ? (
            <SecondaryBtn key={a.label} onPress={a.onPress}>
              {a.label}
            </SecondaryBtn>
          ) : (
            <PrimaryBtn key={a.label} variant={i === 0 ? 'orange' : 'blue'} onPress={a.onPress}>
              {a.label}
            </PrimaryBtn>
          )
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.bg,
    gap: 12,
  },
  tag: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: theme.inkDim,
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: 28,
    color: theme.ink,
    textAlign: 'center',
  },
  note: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: theme.inkDim,
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: 10,
  },
});
