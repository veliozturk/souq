import type { Message } from '../../api/types';
import { DEMO_ME_ID, DEMO_SELLERS } from './_demoEntities';

export const MESSAGES_BY_CONVERSATION: Record<string, Message[]> = {
  cnv_t1: [
    { id: 'msg_1', conversationId: 'cnv_t1', fromUserId: DEMO_SELLERS.omar.id, fromMe: false,
      createdAt: '2026-04-27T10:50:00Z', kind: 'text', text: 'Hi! Is this armchair still available?', offer: null },
    { id: 'msg_2', conversationId: 'cnv_t1', fromUserId: DEMO_ME_ID, fromMe: true,
      createdAt: '2026-04-27T10:52:00Z', kind: 'text', text: 'Yes, still available — just posted 2 days ago.', offer: null },
    { id: 'msg_3', conversationId: 'cnv_t1', fromUserId: DEMO_SELLERS.omar.id, fromMe: false,
      createdAt: '2026-04-27T10:55:00Z', kind: 'text', text: 'Great. Is 750 AED possible? I can pick up today from Marina.', offer: null },
    { id: 'msg_4', conversationId: 'cnv_t1', fromUserId: DEMO_SELLERS.omar.id, fromMe: false,
      createdAt: '2026-04-27T10:58:00Z', kind: 'offer', text: null,
      offer: { priceAed: 750, listedPriceAed: 850, pickupNote: 'Pickup · today, 6pm', state: 'new' } },
  ],
};
