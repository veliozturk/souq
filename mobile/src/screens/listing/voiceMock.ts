export const MOCK_TRANSCRIPT =
  'Selling my IKEA Strandmon armchair, beige fabric, bought it about two years ago, used in a smoke-free apartment in JLT. Small scratch on the right leg but otherwise like new, no rips no stains. Asking around 600 dirhams, pickup from Marina Promenade.';

export const MOCK_DURATION_SECONDS = 14;

export type VoiceSuggestion = {
  title: string;
  body: string;
  tone: 'Honest' | 'Warm' | 'Concise';
};

export const FALLBACK_SUGGESTIONS: VoiceSuggestion[] = [
  {
    title: 'IKEA Strandmon armchair — beige, like new',
    body: '2-year-old Strandmon in beige fabric, smoke-free JLT apartment. Minor scratch on right leg, no rips or stains. Pickup from Marina Promenade.',
    tone: 'Honest',
  },
  {
    title: 'Cosy beige Strandmon armchair, gently used',
    body: 'Beige IKEA Strandmon, two careful years in a smoke-free home. Comfy and structurally perfect — small scratch on one leg, hidden when placed against a wall. Marina Promenade pickup.',
    tone: 'Warm',
  },
  {
    title: 'Strandmon armchair · beige · AED 600',
    body: 'IKEA Strandmon, beige. 2 yrs old. Smoke-free JLT. Light leg scratch, otherwise mint. Pickup: Marina Promenade.',
    tone: 'Concise',
  },
];

const TITLE_MAX = 80;

function truncateOnWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).trim();
}

export function splitTranscript(text: string): { title: string; description: string } {
  const trimmed = text.trim();
  const match = trimmed.match(/^([^.!?]+[.!?])\s+(.+)$/s);
  if (match) {
    return {
      title: truncateOnWord(match[1].replace(/[.!?]$/, '').trim(), TITLE_MAX),
      description: match[2].trim(),
    };
  }
  return {
    title: truncateOnWord(trimmed, TITLE_MAX),
    description: trimmed,
  };
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
