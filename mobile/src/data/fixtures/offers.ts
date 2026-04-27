import type { Offer } from '../../api/types';
import { DEMO_SELLERS } from './_demoEntities';

export const OFFERS: Offer[] = [
  {
    id: 'ofr_o1', buyer: { id: DEMO_SELLERS.omar.id, displayName: 'Omar K.', avatarInitial: 'O' },
    listing: { id: 'lst_l1', title: 'IKEA Strandmon armchair', priceAed: 850 },
    offerAed: 750, state: 'new',
    createdAt: '2026-04-27T10:58:00Z', expiresAt: null, relativeTime: '2m',
  },
  {
    id: 'ofr_o2', buyer: { id: DEMO_SELLERS.sara.id, displayName: 'Sara D.', avatarInitial: 'S' },
    listing: { id: 'lst_l3', title: 'Dyson V11 vacuum', priceAed: 1100 },
    offerAed: 950, state: 'new',
    createdAt: '2026-04-27T10:32:00Z', expiresAt: null, relativeTime: '28m',
  },
  {
    id: 'ofr_o3', buyer: { id: DEMO_SELLERS.rashid.id, displayName: 'Rashid N.', avatarInitial: 'R' },
    listing: { id: 'lst_l2', title: 'Canyon road bike', priceAed: 4200 },
    offerAed: 3900, state: 'countered',
    createdAt: '2026-04-27T09:00:00Z', expiresAt: null, relativeTime: '2h',
  },
  {
    id: 'ofr_o4', buyer: { id: DEMO_SELLERS.fatima.id, displayName: 'Fatima L.', avatarInitial: 'F' },
    listing: { id: 'lst_l4', title: 'Nintendo Switch OLED', priceAed: 920 },
    offerAed: 850, state: 'expiring',
    createdAt: '2026-04-26T15:00:00Z', expiresAt: '2026-04-27T15:00:00Z', relativeTime: 'Expires 4h',
  },
  {
    id: 'ofr_o5', buyer: { id: DEMO_SELLERS.yusuf.id, displayName: 'Yusuf K.', avatarInitial: 'Y' },
    listing: { id: 'lst_l1', title: 'IKEA Strandmon armchair', priceAed: 850 },
    offerAed: 600, state: 'declined',
    createdAt: '2026-04-26T11:00:00Z', expiresAt: null, relativeTime: 'Yesterday',
  },
];
