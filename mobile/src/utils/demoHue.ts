const PALETTE = [
  '#D4B896', '#8FA4B8', '#E8B4B8', '#9BB89C', '#F4C988',
  '#6B7A8C', '#A08060', '#B8C4D0', '#4A7B8C', '#B89874',
  '#8B6F4E', '#D4A8A0', '#A0B890',
];

export function demoHue(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[h % PALETTE.length];
}
