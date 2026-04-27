import type { Bilingual, BilingualUgc, ListingDetail, ListingSummary, Neighborhood } from '../../api/types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from './_demoEntities';
import {
  HOME_LISTINGS,
  MY_ACTIVE_LISTINGS,
  SEARCH_LISTINGS_FURNITURE,
  SELLER_LISTINGS_AISHA,
} from './listings';

const ALL_SUMMARIES: ListingSummary[] = [
  ...HOME_LISTINGS,
  ...MY_ACTIVE_LISTINGS,
  ...SEARCH_LISTINGS_FURNITURE,
  ...SELLER_LISTINGS_AISHA,
];

const DESCRIPTIONS: Record<string, string> = {
  lst_r1: 'Bought 2 years ago, used in a smoke-free apartment in JLT. Small scratch on the right leg (shown in photo 3). No rips, no stains. Pickup from Marina Promenade.',
  lst_l1: 'Bought 2 years ago, used in a smoke-free apartment in JLT. Small scratch on the right leg (shown in photo 3). No rips, no stains. Pickup from Marina Promenade.',
  lst_s1: 'Beige IKEA Strandmon armchair. Smoke-free home. Pickup from Marina.',
  lst_h1: 'Aeron size B, fully loaded. Bought from the Herman Miller store, used 18 months in a home office.',
  lst_h2: '3-seater leather sofa, brown, gently used. No tears. Some natural patina.',
  lst_h3: 'Unlocked iPhone 15 Pro 256GB, deep purple. Always in a case, screen pristine. Battery 96%.',
  lst_h4: 'Dyson Airwrap Complete Long, used a handful of times. All attachments included.',
  lst_h5: 'Brompton M6L, mint condition. One previous owner. Folds tight, perfect for the metro.',
  lst_h6: 'Switch OLED with white Joy-Cons, dock, and 3 game cards (Zelda, Mario, Splatoon).',
  lst_l2: 'Canyon Endurace 7, size M. Aluminum frame, carbon fork. Recently serviced.',
  lst_l3: 'Dyson V11 Animal, full kit. Battery still strong.',
  lst_l4: 'Switch OLED + Mario Kart, Zelda, Pokémon. All in original boxes.',
};

const nbhFull = (nbh: { id: string; slug: string; name: Bilingual }): Neighborhood => ({
  ...nbh,
  centerLat: null,
  centerLng: null,
});

const ugc = (en: string): BilingualUgc => ({ original: en, en, ar: en });

const conditionLikeNew = {
  id: 'cond_like_new',
  slug: 'like-new',
  name: { en: 'Like new', ar: 'كالجديد' } as Bilingual,
};

function fullCategory(categoryId: string) {
  const cat = Object.values(DEMO_CATEGORIES).find((c) => c.id === categoryId);
  return cat ?? { id: categoryId, slug: 'unknown', name: { en: 'Unknown', ar: 'غير معروف' } };
}

function neighborhoodOf(nbhId: string): Neighborhood {
  const match = Object.values(DEMO_NEIGHBORHOODS).find((n) => n.id === nbhId);
  return nbhFull(match ?? DEMO_NEIGHBORHOODS.marina);
}

export function buildListingDetail(id: string): ListingDetail | null {
  const summary = ALL_SUMMARIES.find((l) => l.id === id);
  if (!summary) return null;

  const desc = DESCRIPTIONS[id] ?? `Available in ${summary.neighborhood.name.en}.`;

  return {
    id: summary.id,
    title: summary.title,
    description: ugc(desc),
    priceAed: summary.priceAed,
    previousPriceAed: summary.previousPriceAed,
    acceptOffers: true,
    hasPickup: true,
    pickupNote: `Pickup from ${summary.neighborhood.name.en}`,
    status: 'active',
    publishedAt: summary.publishedAt,
    seller: summary.seller,
    category: fullCategory(summary.categoryId),
    condition: conditionLikeNew,
    neighborhood: neighborhoodOf(summary.neighborhood.id),
    photos: [],
    isBoosted: summary.isBoosted,
    boostEndsAt: null,
  };
}
