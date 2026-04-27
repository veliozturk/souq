import Svg, { Circle, Rect, G } from 'react-native-svg';
import { theme } from '../theme';

export function CompassIllo({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Circle cx="130" cy="130" r="110" fill={theme.blueSoft} />
      <Circle
        cx="130"
        cy="130"
        r="78"
        fill="none"
        stroke={theme.blue}
        strokeWidth="2"
        strokeDasharray="2 6"
        opacity={0.5}
      />
      <Rect x="122" y="30" width="16" height="42" rx="8" fill={theme.blue} />
      <Rect x="122" y="188" width="16" height="42" rx="8" fill={theme.blue} opacity={0.25} />
      <Rect x="30" y="122" width="42" height="16" rx="8" fill={theme.blue} opacity={0.25} />
      <Rect x="188" y="122" width="42" height="16" rx="8" fill={theme.blue} opacity={0.25} />
      <Circle cx="130" cy="130" r="32" fill={theme.orange} />
      <Circle cx="130" cy="130" r="10" fill="#fff" />
      <G transform="rotate(-12 81 81)">
        <Rect x="70" y="70" width="22" height="22" rx="5" fill={theme.orange} opacity={0.9} />
      </G>
      <Circle cx="192" cy="88" r="10" fill={theme.blue} />
      <Rect x="176" y="168" width="18" height="18" rx="4" fill={theme.orange} opacity={0.7} />
    </Svg>
  );
}
