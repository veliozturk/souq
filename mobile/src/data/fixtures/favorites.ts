import type { FavoriteListing } from '../../api/types';
import { HOME_LISTINGS, SEARCH_LISTINGS_FURNITURE } from './listings';

export const FAVORITES: FavoriteListing[] = [
  { ...HOME_LISTINGS[0], favoritedAt: '2026-04-26T10:00:00Z' },
  { ...SEARCH_LISTINGS_FURNITURE[0], favoritedAt: '2026-04-25T14:00:00Z' },
  { ...HOME_LISTINGS[5], favoritedAt: '2026-04-24T09:00:00Z' },
];
