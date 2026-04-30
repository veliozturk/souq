import { useEffect, useRef } from 'react';
import { useCategories, useClassifyVoice, useConditions } from '../../api/queries';
import { useListingDraft, type ListingDraft } from './ListingDraftContext';

export function useApplyVoiceClassification(transcript: string) {
  const classify = useClassifyVoice(transcript);
  const { data: categories = [] } = useCategories();
  const { data: conditions = [] } = useConditions();
  const { draft, patch } = useListingDraft();
  const appliedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (appliedKeyRef.current === transcript) return;
    if (!classify.data || !categories.length || !conditions.length) return;

    const next: Partial<ListingDraft> = {};
    if (!draft.categoryId) {
      const cat = categories.find((c) => c.slug === classify.data!.categorySlug);
      if (cat) next.categoryId = cat.id;
    }
    if (!draft.conditionId) {
      const cond = conditions.find((c) => c.slug === classify.data!.conditionSlug);
      if (cond) next.conditionId = cond.id;
    }
    if (!draft.priceAed && classify.data.priceAed != null) {
      next.priceAed = String(classify.data.priceAed);
    }
    if (Object.keys(next).length) patch(next);
    appliedKeyRef.current = transcript;
  }, [transcript, classify.data, categories, conditions, draft, patch]);
}
