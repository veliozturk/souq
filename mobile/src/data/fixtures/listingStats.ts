import type { ListingStats } from '../../api/types';

export const LISTING_STATS_BY_ID: Record<string, ListingStats> = {
  lst_l1: {
    listingId: 'lst_l1',
    totals: { views: 142, viewsTodayDelta: 18, saves: 23, savesRatePct: 16, messages: 4, unreadMessages: 2 },
    views7d: [
      { dayLabel: 'S', count: 14, isToday: false },
      { dayLabel: 'M', count: 22, isToday: false },
      { dayLabel: 'T', count: 18, isToday: false },
      { dayLabel: 'W', count: 28, isToday: false },
      { dayLabel: 'T', count: 24, isToday: false },
      { dayLabel: 'F', count: 34, isToday: true },
      { dayLabel: 'S', count: 18, isToday: false },
    ],
  },
};
