import type { DraftListing, DraftListingDetail } from '../../api/types';

export const DRAFTS: DraftListing[] = [
  { id: 'drf_d1', title: 'Mid-century coffee table', photoCount: 2, hasPrice: false, updatedAt: '2026-04-26T10:00:00Z' },
  { id: 'drf_d2', title: 'Road bike · Canyon Endurace', photoCount: 0, hasPrice: false, updatedAt: '2026-04-25T14:00:00Z' },
];

export const DRAFT_DETAILS_BY_ID: Record<string, DraftListingDetail> = {
  drf_d1: {
    id: 'drf_d1',
    title: 'Mid-century coffee table',
    photoCount: 2,
    hasPrice: false,
    updatedAt: '2026-04-26T10:00:00Z',
    photoTints: ['#A0826D', '#E8DCC4'],
    description: 'Walnut top, hairpin legs. Some scuffs on the underside, all visible from above is clean.',
    categoryId: 'cat_furniture',
    conditionLabel: 'Good',
    priceAed: '',
    acceptOffers: true,
  },
  drf_d2: {
    id: 'drf_d2',
    title: 'Road bike · Canyon Endurace',
    photoCount: 0,
    hasPrice: false,
    updatedAt: '2026-04-25T14:00:00Z',
    photoTints: [],
    description: '',
    categoryId: 'cat_sports',
    conditionLabel: 'Like new',
    priceAed: '',
    acceptOffers: true,
  },
};
