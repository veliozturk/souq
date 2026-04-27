import { View, Text, StyleSheet } from 'react-native';
import { theme, FONT } from '../theme';

type Props = {
  text: string;
  them?: boolean;
};

export function Bubble({ text, them = false }: Props) {
  return (
    <View style={[s.bubble, them ? s.them : s.me]}>
      <Text style={[s.text, them ? s.themText : s.meText]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  them: {
    alignSelf: 'flex-start',
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 18,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: theme.blue,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 6,
  },
  text: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 19,
  },
  themText: {
    color: theme.ink,
  },
  meText: {
    color: '#fff',
  },
});
