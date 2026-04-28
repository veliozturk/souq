import type { Notification } from '../../api/types';

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'nty_n1', kind: 'offer',
    title: 'New offer on IKEA Strandmon armchair',
    body: 'Omar K. offered AED 750 — listed at AED 850.',
    createdAt: '2026-04-27T10:58:00Z', relativeTime: '2m', read: false,
  },
  {
    id: 'nty_n2', kind: 'message',
    title: 'Message from Layla R.',
    body: 'Great, see you at Marina Mall at 6.',
    createdAt: '2026-04-27T10:42:00Z', relativeTime: '18m', read: false,
  },
  {
    id: 'nty_n3', kind: 'listing',
    title: 'Your listing was approved',
    body: 'Dyson V11 vacuum is now visible in search.',
    createdAt: '2026-04-27T08:15:00Z', relativeTime: '3h', read: true,
  },
  {
    id: 'nty_n4', kind: 'boost',
    title: 'Boost expired',
    body: 'Canyon road bike is no longer boosted. Boost again to reach more buyers.',
    createdAt: '2026-04-26T14:00:00Z', relativeTime: '1d', read: true,
  },
  {
    id: 'nty_n5', kind: 'system',
    title: 'Welcome credit applied',
    body: 'AED 50 added to your wallet for joining Souq.',
    createdAt: '2026-04-25T09:30:00Z', relativeTime: '2d', read: true,
  },
];
