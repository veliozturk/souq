import type { Me } from '../../api/types';
import { DEMO_ME_ID, DEMO_NEIGHBORHOODS } from './_demoEntities';

export const ME: Me = {
  id: DEMO_ME_ID,
  handle: 'aisha.m',
  displayName: 'Aisha Al Mansouri',
  avatarUrl: null,
  avatarInitial: 'A',
  isVerified: true,
  ratingAvg: 4.9,
  soldCount: 11,
  homeNeighborhood: DEMO_NEIGHBORHOODS.marina,
  counts: {
    activeListings: 4,
    inactiveListings: 2,
    soldListings: 11,
    unreadOffers: 2,
    savedItems: 23,
  },
  walletBalanceAed: 1420,
};
