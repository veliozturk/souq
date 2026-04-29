import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { theme } from '../theme';

type Color = string;

export function PinIcon({ size = 12, color = theme.orange }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 14) / 12} viewBox="0 0 12 14">
      <Path d="M6 13c3.5-3.8 5-6.3 5-7.7a5 5 0 10-10 0c0 1.4 1.5 3.9 5 7.7z" fill={color} />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 10, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 6) / 10} viewBox="0 0 10 6" fill="none">
      <Path d="M1 1l4 4 4-4" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 9, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 14) / 9} viewBox="0 0 9 14" fill="none">
      <Path d="M7 1L1 7l6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 15, color = theme.inkDim }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <Circle cx="6.5" cy="6.5" r="5" stroke={color} strokeWidth={1.4} />
      <Path d="M10.5 10.5l3.5 3.5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

export function HeartIcon({
  size = 14,
  color = theme.ink,
  filled = false,
}: {
  size?: number;
  color?: Color;
  filled?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 14l-5-4a3.5 3.5 0 115-5 3.5 3.5 0 115 5l-5 4z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

export function BellIcon({ size = 16, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M3 10V7a5 5 0 0110 0v3l1 2H2l1-2z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

export function FilterBarsIcon({ size = 14, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M2 3h10M4 7h6M6 11h2" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function FilterIcon({ size = 10, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d="M1 2h8M2 5h6M4 8h2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function VerifiedIcon({ size = 13, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
      <Path
        d="M6.5 1l1.7 1.3 2.1-.3.3 2.1 1.3 1.7L10.6 7.4l-.3 2.1-2.1.3L6.5 11.3 4.8 9.8l-2.1-.3L2.4 7.4 1 6.5l1.4-1.7L2.7 2.7l2.1-.3L6.5 1z"
        fill={color}
      />
      <Path d="M4.5 6.5l1.5 1.5L9 5" stroke="#fff" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function MessageBubbleIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M1 2h14v9H5l-4 3V2z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

export function SendIcon({ size = 14, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 8l12-6-5 14-2-5-5-3z" fill={color} />
    </Svg>
  );
}

export function SparkleIcon({ size = 14, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5z" fill={color} />
    </Svg>
  );
}

export function MicIcon({ size = 12, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 18) / 14} viewBox="0 0 14 18" fill="none">
      <Rect x="4" y="1" width="6" height="10" rx="3" fill={color} />
      <Path d="M1.5 9a5.5 5.5 0 0011 0M7 14.5V17" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function ShieldIcon({ size = 14, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 1l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7V3l6-2z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function MoreDotsIcon({ size = 14, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 4) / 14} viewBox="0 0 14 4">
      <Circle cx="2" cy="2" r="1.5" fill={color} />
      <Circle cx="7" cy="2" r="1.5" fill={color} />
      <Circle cx="12" cy="2" r="1.5" fill={color} />
    </Svg>
  );
}

export function ShareIcon({ size = 14, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M10 5V3a1 1 0 00-1-1H2a1 1 0 00-1 1v7a1 1 0 001 1h2M5 13h7a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v6a1 1 0 001 1z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LockIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x="2" y="6" width="12" height="9" rx="2" fill={theme.blueSoft} stroke={color} strokeWidth={1.5} />
      <Path d="M5 6V4a3 3 0 016 0v2" stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

export function CameraIcon({ size = 16, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 14) / 16} viewBox="0 0 16 14" fill="none">
      <Path d="M2 4h2.5l1-1.5h5l1 1.5H14v8H2V4z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function CrosshairIcon({ size = 20, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="8" stroke={color} strokeWidth={1.8} />
      <Circle cx="10" cy="10" r="3" fill={color} />
      <Path d="M10 2v2M10 16v2M2 10h2M16 10h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckCircleIcon({ size = 18, color = theme.success }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="8" fill={color} />
      <Path
        d="M5.5 9.5l2.5 2.5 4.5-5"
        stroke="#fff"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CheckIcon({ size = 12, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 10) / 12} viewBox="0 0 12 10" fill="none">
      <Path
        d="M1 5l3.5 3.5L11 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MapPinIcon({
  size = 16,
  color = theme.blue,
  innerColor = '#fff',
}: {
  size?: number;
  color?: Color;
  innerColor?: Color;
}) {
  return (
    <Svg width={size} height={(size * 18) / 16} viewBox="0 0 16 18" fill="none">
      <Path
        d="M8 17c5-5.5 7-9 7-11a7 7 0 10-14 0c0 2 2 5.5 7 11z"
        fill={color}
      />
      <Circle cx="8" cy="6" r="2.3" fill={innerColor} />
    </Svg>
  );
}

export function CloseIcon({ size = 14, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M1 1l12 12M13 1L1 13" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 8, color = theme.inkDim }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 14) / 8} viewBox="0 0 8 14" fill="none">
      <Path d="M1 1l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 12, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M6 1v10M1 6h10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function PictureIcon({ size = 22, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x="2" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth={1.6} />
      <Path d="M2 14l5-4 4 3 4-5 5 5" stroke={color} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

export function CameraSlotIcon({ size = 22, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 18) / 22} viewBox="0 0 22 18" fill="none">
      <Rect x="1" y="4" width="20" height="13" rx="2.5" stroke={color} strokeWidth={1.8} />
      <Path d="M7 4l1.5-2.5h5L15 4" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx="11" cy="10.5" r="3.5" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function RefreshIcon({ size = 14, color = theme.inkDim }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 2v3.5h3.5M14 14v-3.5h-3.5M2.5 6.5A6 6 0 0113 5M13.5 9.5A6 6 0 013 11"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function MicStandIcon({ size = 14, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 18) / 14} viewBox="0 0 14 18" fill="none">
      <Rect x="4" y="1" width="6" height="10" rx="3" fill={color} />
      <Path d="M1.5 9a5.5 5.5 0 0011 0M7 14.5V17M4 17h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function BoltIcon({ size = 14, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 16) / 14} viewBox="0 0 14 16" fill="none">
      <Path d="M7 1l-5 8h4l-1 6 5-8H6l1-6z" fill={color} />
    </Svg>
  );
}

export function InfoIcon({ size = 10, color = '#fff' }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path d="M5 1v4M5 7v2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function CatFurnitureIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2" y="8" width="16" height="6" rx="1.5" stroke={color} strokeWidth={1.6} />
      <Path d="M5 14v3M15 14v3" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function CatElectronicsIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2" y="4" width="16" height="11" rx="1.5" stroke={color} strokeWidth={1.6} />
      <Path d="M6 18h8" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function CatFashionIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M6 3l-4 3 2 3 2-1v9h8v-9l2 1 2-3-4-3-2 2h-4l-2-2z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CatHomeIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M2 9l8-6 8 6v8H2V9z" stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}

export function CatSportsIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth={1.6} />
      <Path d="M2.5 10h15M10 2.5v15" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
}

export function CatKidsIcon({ size = 20, color = theme.ink }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="7" r="3" stroke={color} strokeWidth={1.6} />
      <Path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function ListingsIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x="2" y="3" width="12" height="10" rx="1.5" stroke={color} strokeWidth={1.5} />
      <Path d="M2 9l3-2 3 2 3-3 3 3" stroke={color} strokeWidth={1.5} fill="none" />
    </Svg>
  );
}

export function OfferDiamondIcon({ size = 16, color = theme.orange }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M2 8L8 2l6 6-6 6-6-6z" stroke={color} strokeWidth={1.5} />
      <Circle cx="6" cy="6" r="1" fill={color} />
    </Svg>
  );
}

export function WalletIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Rect x="2" y="4" width="12" height="9" rx="1.5" stroke={color} strokeWidth={1.5} />
      <Circle cx="11" cy="8.5" r="1.2" fill={color} />
    </Svg>
  );
}

export function ReceiptIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 4h2l2 8h7l2-6H5"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function HelpIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth={1.5} />
      <Path
        d="M6 6.5A2 2 0 018 4.5a2 2 0 011 3.5c-.5.3-1 .5-1 1M8 11.5v.01"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MapPinSmallIcon({ size = 16, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 15c4-4.5 6-7 6-9a6 6 0 10-12 0c0 2 2 4.5 6 9z" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function MapPinSimpleIcon({ size = 18, color = theme.blue }: { size?: number; color?: Color }) {
  return (
    <Svg width={size} height={(size * 20) / 18} viewBox="0 0 18 20" fill="none">
      <Path d="M9 19c5-5.5 7-9 7-11a7 7 0 10-14 0c0 2 2 5.5 7 11z" stroke={color} strokeWidth={1.6} />
      <Circle cx="9" cy="8" r="2.3" fill={color} />
    </Svg>
  );
}

export function UAEFlag({ width = 24, height = 16 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 16">
      <Rect width="24" height="16" fill="#fff" />
      <Rect width="24" height="5.33" fill="#00732F" />
      <Rect y="10.67" width="24" height="5.33" fill="#000" />
      <Rect width="7" height="16" fill="#FF0000" />
    </Svg>
  );
}
