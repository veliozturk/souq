import type { Conversation } from '../../api/types';
import { DEMO_SELLERS } from './_demoEntities';

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'cnv_t1',
    peer: { id: DEMO_SELLERS.omar.id, displayName: 'Omar K.', avatarUrl: null, avatarInitial: 'O', isOnline: true },
    listing: { id: 'lst_l1', title: 'IKEA Strandmon armchair', priceAed: 850 },
    lastMessage: { text: 'Is 750 AED possible? Can pick up today.', createdAt: '2026-04-27T10:58:00Z', fromMe: false, relativeTime: '2m' },
    unread: true,
    hasOffer: true,
  },
  {
    id: 'cnv_t2',
    peer: { id: DEMO_SELLERS.layla.id, displayName: 'Layla R.', avatarUrl: null, avatarInitial: 'L', isOnline: false },
    listing: { id: 'lst_l4', title: 'Nintendo Switch OLED', priceAed: 920 },
    lastMessage: { text: 'Great, see you at Marina Mall at 6.', createdAt: '2026-04-27T10:42:00Z', fromMe: false, relativeTime: '18m' },
    unread: true,
    hasOffer: false,
  },
  {
    id: 'cnv_t3',
    peer: { id: DEMO_SELLERS.ahmed.id, displayName: 'Ahmed S.', avatarUrl: null, avatarInitial: 'A', isOnline: false },
    listing: { id: 'lst_l2', title: 'Canyon road bike', priceAed: 4200 },
    lastMessage: { text: 'Thanks! Will transfer tonight.', createdAt: '2026-04-27T10:00:00Z', fromMe: false, relativeTime: '1h' },
    unread: true,
    hasOffer: false,
  },
  {
    id: 'cnv_t4',
    peer: { id: DEMO_SELLERS.priya.id, displayName: 'Priya M.', avatarUrl: null, avatarInitial: 'P', isOnline: false },
    listing: { id: 'lst_l3', title: 'Dyson V11 vacuum', priceAed: 1100 },
    lastMessage: { text: 'Sure, it works perfectly.', createdAt: '2026-04-27T08:00:00Z', fromMe: true, relativeTime: '3h' },
    unread: false,
    hasOffer: false,
  },
  {
    id: 'cnv_t5',
    peer: { id: DEMO_SELLERS.hassan.id, displayName: 'Hassan T.', avatarUrl: null, avatarInitial: 'H', isOnline: false },
    listing: { id: 'lst_l1', title: 'IKEA Strandmon armchair', priceAed: 850 },
    lastMessage: { text: 'Is this still available?', createdAt: '2026-04-26T15:00:00Z', fromMe: false, relativeTime: 'Yesterday' },
    unread: false,
    hasOffer: false,
  },
  {
    id: 'cnv_t6',
    peer: { id: DEMO_SELLERS.noura.id, displayName: 'Noura A.', avatarUrl: null, avatarInitial: 'N', isOnline: false },
    listing: { id: 'lst_l4', title: 'Nintendo Switch OLED', priceAed: 920 },
    lastMessage: { text: 'Yes, comes with 3 games.', createdAt: '2026-04-20T15:00:00Z', fromMe: true, relativeTime: 'Mon' },
    unread: false,
    hasOffer: false,
  },
];
