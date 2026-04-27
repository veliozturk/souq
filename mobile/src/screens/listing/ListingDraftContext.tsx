import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { isDemoMode } from '../../api/client';
import { LISTING_PRESET } from '../../data/fixtures/listingPreset';
import type { ListingDraftBody } from '../../api/types';

export type ListingDraft = ListingDraftBody;

const EMPTY: ListingDraft = {
  photoTints: [],
  title: '',
  description: '',
  categoryId: null,
  conditionLabel: null,
  priceAed: '',
  acceptOffers: true,
};

const DEMO: ListingDraft = {
  photoTints: LISTING_PRESET.photoTints,
  title: LISTING_PRESET.title,
  description: LISTING_PRESET.description,
  categoryId: LISTING_PRESET.categoryId,
  conditionLabel: LISTING_PRESET.conditionLabel,
  priceAed: LISTING_PRESET.priceAed,
  acceptOffers: LISTING_PRESET.acceptOffers,
};

function initialDraft(): ListingDraft {
  return isDemoMode() ? { ...DEMO } : { ...EMPTY };
}

type Ctx = {
  draft: ListingDraft;
  patch: (p: Partial<ListingDraft>) => void;
  load: (body: ListingDraft) => void;
  reset: () => void;
};

const ListingDraftCtx = createContext<Ctx | null>(null);

export function ListingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ListingDraft>(initialDraft);
  const patch = useCallback((p: Partial<ListingDraft>) => {
    setDraft((d) => ({ ...d, ...p }));
  }, []);
  const load = useCallback((body: ListingDraft) => {
    setDraft({ ...body });
  }, []);
  const reset = useCallback(() => {
    setDraft(initialDraft());
  }, []);
  return (
    <ListingDraftCtx.Provider value={{ draft, patch, load, reset }}>
      {children}
    </ListingDraftCtx.Provider>
  );
}

export function useListingDraft(): Ctx {
  const v = useContext(ListingDraftCtx);
  if (!v) throw new Error('useListingDraft used outside ListingDraftProvider');
  return v;
}
