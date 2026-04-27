import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet } from './client';
import type {
  Category,
  Conversation,
  DraftListing,
  DraftListingDetail,
  FavoriteListing,
  ListingDetail,
  ListingDraftBody,
  ListingFilters,
  ListingStats,
  ListingSummary,
  Me,
  Message,
  Offer,
  OfferState,
  UserDetail,
} from './types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiGet<Category[]>('/api/categories'),
  });
}

function buildListingsPath(f: ListingFilters): string {
  const params = new URLSearchParams();
  if (f.categoryId) params.set('categoryId', f.categoryId);
  if (f.sellerId) params.set('sellerId', f.sellerId);
  if (f.q) params.set('q', f.q);
  if (f.limit !== undefined) params.set('limit', String(f.limit));
  if (f.offset !== undefined) params.set('offset', String(f.offset));
  const qs = params.toString();
  return qs ? `/api/listings?${qs}` : '/api/listings';
}

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => apiGet<ListingSummary[]>(buildListingsPath(filters)),
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => apiGet<ListingDetail>(`/api/listings/${id}`),
    enabled: !!id,
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiGet<UserDetail>(`/api/users/${id}`),
    enabled: !!id,
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiGet<Me>('/api/me'),
  });
}

export function useMyListings(status?: 'active' | 'inactive' | 'sold') {
  const path = status
    ? `/api/listings?sellerId=me&status=${status}`
    : '/api/listings?sellerId=me';
  return useQuery({
    queryKey: ['my-listings', status ?? 'all'],
    queryFn: () => apiGet<ListingSummary[]>(path),
  });
}

export function useListingStats(id: string | undefined) {
  return useQuery({
    queryKey: ['listing-stats', id],
    queryFn: () => apiGet<ListingStats | null>(`/api/listings/${id}/stats`),
    enabled: !!id,
  });
}

export function useDrafts() {
  return useQuery({
    queryKey: ['drafts'],
    queryFn: () => apiGet<DraftListing[]>('/api/listings/drafts'),
  });
}

export function useDraft(id: string | undefined) {
  return useQuery({
    queryKey: ['draft', id],
    queryFn: () => apiGet<DraftListingDetail>(`/api/listings/drafts/${id}`),
    enabled: !!id,
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiGet<FavoriteListing[]>('/api/me/favorites'),
  });
}

export function useFavoriteToggle() {
  const qc = useQueryClient();
  const { data: favorites = [] } = useFavorites();
  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = (id: string) => ids.has(id);

  const toggle = (item: ListingSummary) => {
    qc.setQueryData<FavoriteListing[]>(['favorites'], (current) => {
      const list = current ?? [];
      const has = list.some((f) => f.id === item.id);
      if (has) return list.filter((f) => f.id !== item.id);
      const entry: FavoriteListing = { ...item, favoritedAt: new Date().toISOString() };
      return [entry, ...list];
    });
  };

  return { isFavorite, toggle };
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiGet<Conversation[]>('/api/conversations'),
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => apiGet<Message[]>(`/api/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
  });
}

export type StartConversationInput = {
  listingId: string;
  listingTitle: string;
  listingPriceAed: number;
  peerId: string;
  peerName: string;
  peerInitial: string | null;
  text: string;
};

export function useStartConversation() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (input: StartConversationInput): string | null => {
    if (!me) return null;
    const text = input.text.trim();
    if (!text) return null;

    const conversations = qc.getQueryData<Conversation[]>(['conversations']) ?? [];
    const existing = conversations.find(
      (c) => c.listing.id === input.listingId && c.peer.id === input.peerId,
    );

    const now = new Date();
    const conversationId = existing?.id ?? `cnv_local_${now.getTime()}`;

    const newMessage: Message = {
      id: `msg_${now.getTime()}`,
      conversationId,
      fromUserId: me.id,
      fromMe: true,
      createdAt: now.toISOString(),
      kind: 'text',
      text,
      offer: null,
    };

    qc.setQueryData<Message[]>(['messages', conversationId], (current) => {
      const list = current ?? [];
      return [...list, newMessage];
    });

    if (existing) {
      qc.setQueryData<Conversation[]>(['conversations'], (current) => {
        const list = current ?? [];
        return list.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: { text, createdAt: now.toISOString(), fromMe: true, relativeTime: 'now' },
                unread: false,
              }
            : c,
        );
      });
    } else {
      const newConv: Conversation = {
        id: conversationId,
        peer: {
          id: input.peerId,
          displayName: input.peerName,
          avatarUrl: null,
          avatarInitial: input.peerInitial,
          isOnline: false,
        },
        listing: {
          id: input.listingId,
          title: input.listingTitle,
          priceAed: input.listingPriceAed,
        },
        lastMessage: { text, createdAt: now.toISOString(), fromMe: true, relativeTime: 'now' },
        unread: false,
        hasOffer: false,
      };
      qc.setQueryData<Conversation[]>(['conversations'], (current) => {
        const list = current ?? [];
        return [newConv, ...list];
      });
    }

    return conversationId;
  };
}

export type MakeOfferInput = {
  listingId: string;
  listingTitle: string;
  listingPriceAed: number;
  peerId: string;
  peerName: string;
  peerInitial: string | null;
  offerPriceAed: number;
  pickupNote: string | null;
};

export function useMakeOffer() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (input: MakeOfferInput): string | null => {
    if (!me || input.offerPriceAed <= 0) return null;

    const conversations = qc.getQueryData<Conversation[]>(['conversations']) ?? [];
    const existing = conversations.find(
      (c) => c.listing.id === input.listingId && c.peer.id === input.peerId,
    );

    const now = new Date();
    const conversationId = existing?.id ?? `cnv_local_${now.getTime()}`;
    const offerId = `ofr_local_${now.getTime()}`;

    const offerMessage: Message = {
      id: `msg_${now.getTime()}`,
      conversationId,
      fromUserId: me.id,
      fromMe: true,
      createdAt: now.toISOString(),
      kind: 'offer',
      text: null,
      offer: {
        id: offerId,
        priceAed: input.offerPriceAed,
        listedPriceAed: input.listingPriceAed,
        pickupNote: input.pickupNote,
        state: 'new',
      },
    };

    qc.setQueryData<Message[]>(['messages', conversationId], (current) => {
      const list = current ?? [];
      return [...list, offerMessage];
    });

    const lastMessageText = `Offered AED ${input.offerPriceAed.toLocaleString()}`;

    if (existing) {
      qc.setQueryData<Conversation[]>(['conversations'], (current) => {
        const list = current ?? [];
        return list.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: { text: lastMessageText, createdAt: now.toISOString(), fromMe: true, relativeTime: 'now' },
                hasOffer: true,
                unread: false,
              }
            : c,
        );
      });
    } else {
      const newConv: Conversation = {
        id: conversationId,
        peer: {
          id: input.peerId,
          displayName: input.peerName,
          avatarUrl: null,
          avatarInitial: input.peerInitial,
          isOnline: false,
        },
        listing: {
          id: input.listingId,
          title: input.listingTitle,
          priceAed: input.listingPriceAed,
        },
        lastMessage: { text: lastMessageText, createdAt: now.toISOString(), fromMe: true, relativeTime: 'now' },
        unread: false,
        hasOffer: true,
      };
      qc.setQueryData<Conversation[]>(['conversations'], (current) => {
        const list = current ?? [];
        return [newConv, ...list];
      });
    }

    return conversationId;
  };
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (conversationId: string, rawText: string) => {
    const text = rawText.trim();
    if (!text || !me) return;
    const now = new Date();

    const newMessage: Message = {
      id: `msg_${now.getTime()}`,
      conversationId,
      fromUserId: me.id,
      fromMe: true,
      createdAt: now.toISOString(),
      kind: 'text',
      text,
      offer: null,
    };

    qc.setQueryData<Message[]>(['messages', conversationId], (current) => {
      const list = current ?? [];
      return [...list, newMessage];
    });

    qc.setQueryData<Conversation[]>(['conversations'], (current) => {
      const list = current ?? [];
      return list.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: {
                text,
                createdAt: now.toISOString(),
                fromMe: true,
                relativeTime: 'now',
              },
              unread: false,
            }
          : c,
      );
    });
  };
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return (conversationId: string) => {
    qc.setQueryData<Conversation[]>(['conversations'], (current) => {
      const list = current ?? [];
      return list.map((c) => (c.id === conversationId && c.unread ? { ...c, unread: false } : c));
    });
  };
}

export function useOffers(state?: OfferState) {
  const path = state ? `/api/me/offers?status=${state}` : '/api/me/offers';
  return useQuery({
    queryKey: ['offers', state ?? 'all'],
    queryFn: () => apiGet<Offer[]>(path),
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (draft: ListingDraftBody): string | null => {
    if (!me) return null;
    const id = `lst_local_${Date.now()}`;
    const now = new Date().toISOString();
    const priceNum = parseInt(draft.priceAed, 10) || 0;
    const nbh = me.homeNeighborhood ?? {
      id: 'nbh_unknown',
      slug: 'unknown',
      name: { en: 'Dubai', ar: 'دبي' },
    };

    const summary: ListingSummary = {
      id,
      title: { original: draft.title, en: draft.title, ar: draft.title },
      priceAed: priceNum,
      previousPriceAed: null,
      publishedAt: now,
      categoryId: draft.categoryId ?? 'cat_furniture',
      neighborhood: nbh,
      seller: {
        id: me.id,
        handle: me.handle,
        name: me.displayName,
        avatarUrl: me.avatarUrl,
        avatarInitial: me.avatarInitial,
        isVerified: me.isVerified,
        joinedYear: new Date().getFullYear(),
      },
      coverPhoto: null,
      isBoosted: false,
      sellerStats: { viewsCount: 0, messagesCount: 0, pendingOffersCount: 0 },
    };

    const detail: ListingDetail = {
      ...summary,
      description: { original: draft.description, en: draft.description, ar: draft.description },
      acceptOffers: draft.acceptOffers,
      hasPickup: true,
      pickupNote: me.homeNeighborhood ? `Pickup from ${me.homeNeighborhood.name.en}` : null,
      status: 'active',
      category: {
        id: draft.categoryId ?? 'cat_furniture',
        slug: 'unknown',
        name: { en: '', ar: '' },
      },
      condition: {
        id: 'cond_unknown',
        slug: 'unknown',
        name: { en: draft.conditionLabel ?? 'Like new', ar: 'كالجديد' },
      },
      neighborhood: { ...nbh, centerLat: null, centerLng: null },
      photos: [],
      boostEndsAt: null,
    };

    qc.setQueryData<ListingSummary[]>(['my-listings', 'active'], (current) => {
      const list = current ?? [];
      return [summary, ...list];
    });

    qc.setQueryData<ListingDetail>(['listing', id], detail);

    qc.setQueryData<Me>(['me'], (current) =>
      current
        ? { ...current, counts: { ...current.counts, activeListings: current.counts.activeListings + 1 } }
        : current,
    );

    return id;
  };
}

export function useSaveDraft() {
  const qc = useQueryClient();

  return (draft: ListingDraftBody): string => {
    const id = `drf_local_${Date.now()}`;
    const updatedAt = new Date().toISOString();

    const summary: DraftListing = {
      id,
      title: draft.title || null,
      photoCount: draft.photoTints.length,
      hasPrice: draft.priceAed.length > 0,
      updatedAt,
    };

    const detail: DraftListingDetail = { ...summary, ...draft };

    qc.setQueryData<DraftListing[]>(['drafts'], (current) => {
      const list = current ?? [];
      return [summary, ...list];
    });

    qc.setQueryData<DraftListingDetail>(['draft', id], detail);

    return id;
  };
}

export function useDecideOffer() {
  const qc = useQueryClient();

  return (offerId: string, conversationId: string, decision: 'accepted' | 'declined') => {
    qc.setQueryData<Message[]>(['messages', conversationId], (current) => {
      const list = current ?? [];
      return list.map((m) =>
        m.offer && m.offer.id === offerId
          ? { ...m, offer: { ...m.offer, state: decision } }
          : m,
      );
    });

    qc.setQueriesData<Offer[]>({ queryKey: ['offers'] }, (current) => {
      const list = current ?? [];
      return list.map((o) => (o.id === offerId ? { ...o, state: decision } : o));
    });
  };
}
