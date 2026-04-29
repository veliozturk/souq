import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import type { ListingDraftBody } from '../../api/types';

export type ListingDraft = ListingDraftBody;

export type VoiceCapture = {
  transcript: string;
  durationSec: number;
  audioUri?: string;
};

const EMPTY: ListingDraft = {
  photos: [],
  title: '',
  description: '',
  categoryId: null,
  conditionId: null,
  neighborhoodId: null,
  priceAed: '',
  acceptOffers: true,
};

const EMPTY_VOICE: VoiceCapture = { transcript: '', durationSec: 0 };

function initialDraft(): ListingDraft {
  return { ...EMPTY };
}

type Ctx = {
  draft: ListingDraft;
  patch: (p: Partial<ListingDraft>) => void;
  load: (body: ListingDraft) => void;
  reset: () => void;
  voice: VoiceCapture;
  setVoice: (v: VoiceCapture) => void;
};

const ListingDraftCtx = createContext<Ctx | null>(null);

export function ListingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ListingDraft>(initialDraft);
  const [voice, setVoiceState] = useState<VoiceCapture>(EMPTY_VOICE);
  const patch = useCallback((p: Partial<ListingDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
  }, []);
  const load = useCallback((body: ListingDraft) => {
    setDraft({ ...body });
  }, []);
  const reset = useCallback(() => {
    setDraft(initialDraft());
    setVoiceState(EMPTY_VOICE);
  }, []);
  const setVoice = useCallback((v: VoiceCapture) => setVoiceState(v), []);
  return (
    <ListingDraftCtx.Provider value={{ draft, patch, load, reset, voice, setVoice }}>
      {children}
    </ListingDraftCtx.Provider>
  );
}

export function useListingDraft(): Ctx {
  const v = useContext(ListingDraftCtx);
  if (!v) throw new Error('useListingDraft used outside ListingDraftProvider');
  return v;
}
