import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost, apiPatch, apiMultipartPost, type MultipartFile } from './client';
import { useAuthStub } from '../auth/AuthStub';
import type {
  AppConfig,
  Category,
  Condition,
  Conversation,
  DraftListing,
  DraftListingDetail,
  FavoriteListing,
  ListingDetail,
  ListingDraftBody,
  ListingFilters,
  ListingPhoto,
  ListingStats,
  ListingSummary,
  ListingUpdateBody,
  LocalPhoto,
  Me,
  Message,
  Neighborhood,
  Offer,
  OfferState,
  QuickReply,
  UserDetail,
} from './types';

export type EditPhotoItem =
  | { kind: 'remote'; photo: ListingPhoto }
  | { kind: 'local'; photo: LocalPhoto };

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiGet<Category[]>('/api/categories'),
  });
}

export function useConditions() {
  return useQuery({
    queryKey: ['conditions'],
    queryFn: () => apiGet<Condition[]>('/api/conditions'),
  });
}

export function useNeighborhoods() {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: () => apiGet<Neighborhood[]>('/api/neighborhoods'),
  });
}

export function useQuickReplies() {
  return useQuery({
    queryKey: ['quick-replies'],
    queryFn: () => apiGet<QuickReply[]>('/api/quick-replies'),
  });
}

export function useAppConfig() {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: () => apiGet<AppConfig>('/api/config'),
  });
}

type Bilingual = { original?: string; en?: string; ar?: string } | string | null;

function flatten(b: Bilingual): string {
  if (!b) return '';
  if (typeof b === 'string') return b;
  return b.original ?? b.en ?? b.ar ?? '';
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

type ApiConversation = {
  id: string;
  peer: { id: string; displayName: string; avatarUrl: string | null; avatarInitial: string | null; isOnline: boolean };
  listing: { id: string; title: Bilingual; priceAed: number };
  lastMessage: { text: Bilingual; createdAt: string; fromMe: boolean; kind: string } | null;
  unread: boolean;
  hasOffer: boolean;
  iAmSeller?: boolean;
};

type ApiMessage = {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromMe: boolean;
  createdAt: string;
  kind: 'text' | 'offer' | 'system';
  text: Bilingual;
  offer: { id: string; priceAed: number; listedPriceAed: number; state: string } | null;
};

function toConversation(c: ApiConversation): Conversation {
  const last = c.lastMessage;
  const text = last ? (last.kind === 'offer' ? 'Sent an offer' : flatten(last.text)) : '';
  return {
    id: c.id,
    peer: c.peer,
    listing: { id: c.listing.id, title: flatten(c.listing.title), priceAed: c.listing.priceAed },
    lastMessage: {
      text,
      createdAt: last?.createdAt ?? '',
      fromMe: last?.fromMe ?? false,
      relativeTime: relativeTime(last?.createdAt),
    },
    unread: c.unread,
    hasOffer: c.hasOffer,
    iAmSeller: c.iAmSeller ?? false,
  };
}

type ApiOffer = {
  id: string;
  buyer: { id: string; displayName: string; avatarInitial: string | null };
  listing: { id: string; title: Bilingual; priceAed: number };
  offerAed: number;
  state: string;
  createdAt: string;
  expiresAt: string | null;
};

function toOffer(o: ApiOffer): Offer {
  let state: string = o.state;
  if (state === 'expired') {
    state = 'declined';
  } else if (state === 'new' && o.expiresAt) {
    const hoursLeft = (new Date(o.expiresAt).getTime() - Date.now()) / 3600000;
    if (hoursLeft <= 24) state = 'expiring';
  }
  return {
    id: o.id,
    buyer: o.buyer,
    listing: { id: o.listing.id, title: flatten(o.listing.title), priceAed: o.listing.priceAed },
    offerAed: o.offerAed,
    state: state as OfferState,
    createdAt: o.createdAt,
    expiresAt: o.expiresAt,
    relativeTime: relativeTime(o.createdAt),
  };
}

function toMessage(m: ApiMessage): Message {
  return {
    id: m.id,
    conversationId: m.conversationId,
    fromUserId: m.fromUserId,
    fromMe: m.fromMe,
    createdAt: m.createdAt,
    kind: m.kind === 'system' ? 'text' : m.kind,
    text: m.text ? flatten(m.text) : null,
    offer: m.offer
      ? {
          id: m.offer.id,
          priceAed: m.offer.priceAed,
          listedPriceAed: m.offer.listedPriceAed,
          pickupNote: null,
          state: m.offer.state as OfferState,
        }
      : null,
  };
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
  const { currentUser } = useAuthStub();
  const userId = currentUser?.id;
  return useQuery({
    queryKey: ['me', userId],
    queryFn: () => apiGet<Me>(`/api/me?userId=${userId}`),
    enabled: !!userId,
    initialData: currentUser ?? undefined,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useMyListings(status?: 'active' | 'paused' | 'sold') {
  const { currentUser } = useAuthStub();
  const sellerId = currentUser?.id;
  const path = sellerId
    ? `/api/listings?sellerId=${sellerId}${status ? `&status=${status}` : ''}`
    : null;
  return useQuery({
    queryKey: ['my-listings', sellerId, status ?? 'all'],
    queryFn: () => apiGet<ListingSummary[]>(path!),
    enabled: !!path,
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
  const { data: me } = useMe();
  return useQuery({
    queryKey: ['favorites', me?.id],
    queryFn: () => apiGet<FavoriteListing[]>(`/api/me/favorites?userId=${me!.id}`),
    enabled: !!me?.id,
  });
}

export function useFavoriteToggle() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const { data: favorites = [] } = useFavorites();
  const favKey = ['favorites', me?.id];
  const ids = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = (id: string) => ids.has(id);

  const toggle = (item: ListingSummary) => {
    if (!me) return;
    const has = ids.has(item.id);

    qc.setQueryData<FavoriteListing[]>(favKey, (current) => {
      const list = current ?? [];
      if (has) return list.filter((f) => f.id !== item.id);
      const entry: FavoriteListing = { ...item, favoritedAt: new Date().toISOString() };
      return [entry, ...list];
    });

    const url = `/api/listings/${item.id}/favorite?userId=${me.id}`;
    const promise = has ? apiDelete(url) : apiPost(url, undefined);
    promise.catch(() => {
      qc.invalidateQueries({ queryKey: favKey });
    });
  };

  return { isFavorite, toggle };
}

export function useConversations() {
  const { data: me } = useMe();
  return useQuery({
    queryKey: ['conversations', me?.id],
    queryFn: async () => {
      const rows = await apiGet<ApiConversation[]>(`/api/conversations?userId=${me!.id}`);
      return rows.map(toConversation);
    },
    enabled: !!me?.id,
    staleTime: Infinity,
  });
}

export function useMessages(conversationId: string | undefined) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: ['messages', conversationId, me?.id],
    queryFn: async () => {
      const rows = await apiGet<ApiMessage[]>(
        `/api/conversations/${conversationId}/messages?userId=${me!.id}`,
      );
      return rows.map(toMessage);
    },
    enabled: !!conversationId && !!me?.id,
    staleTime: Infinity,
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

  return async (input: StartConversationInput): Promise<string | null> => {
    if (!me) return null;
    const text = input.text.trim();
    if (!text) return null;

    try {
      const res = await apiPost<{ conversationId: string; messageId: string }>(
        '/api/conversations',
        { listingId: input.listingId, peerId: input.peerId, userId: me.id, text },
      );
      qc.invalidateQueries({ queryKey: ['conversations', me.id] });
      qc.invalidateQueries({ queryKey: ['messages', res.conversationId] });
      return res.conversationId;
    } catch {
      return null;
    }
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

  return async (input: MakeOfferInput): Promise<string | null> => {
    if (!me || input.offerPriceAed <= 0) return null;

    try {
      const res = await apiPost<{ conversationId: string; offerId: string }>(
        `/api/listings/${input.listingId}/offers`,
        { userId: me.id, peerId: input.peerId, amountAed: input.offerPriceAed },
      );
      qc.invalidateQueries({ queryKey: ['conversations', me.id] });
      qc.invalidateQueries({ queryKey: ['messages', res.conversationId] });
      qc.invalidateQueries({ queryKey: ['offers', me.id] });
      return res.conversationId;
    } catch {
      return null;
    }
  };
}

export function useSendMessage() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (conversationId: string, rawText: string) => {
    const text = rawText.trim();
    if (!text || !me) return;
    const now = new Date();

    const tempMessage: Message = {
      id: `msg_local_${now.getTime()}`,
      conversationId,
      fromUserId: me.id,
      fromMe: true,
      createdAt: now.toISOString(),
      kind: 'text',
      text,
      offer: null,
    };

    qc.setQueryData<Message[]>(['messages', conversationId, me.id], (current) => {
      const list = current ?? [];
      return [...list, tempMessage];
    });

    qc.setQueryData<Conversation[]>(['conversations', me.id], (current) => {
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

    apiPost(`/api/conversations/${conversationId}/messages`, { userId: me.id, text })
      .then(() => {
        qc.invalidateQueries({ queryKey: ['messages', conversationId, me.id] });
        qc.invalidateQueries({ queryKey: ['conversations', me.id] });
      })
      .catch(() => {
        qc.invalidateQueries({ queryKey: ['messages', conversationId, me.id] });
        qc.invalidateQueries({ queryKey: ['conversations', me.id] });
      });
  };
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  const { data: me } = useMe();
  const meId = me?.id;
  return useCallback(
    (conversationId: string) => {
      if (!meId) return;
      const conversations = qc.getQueryData<Conversation[]>(['conversations', meId]) ?? [];
      const target = conversations.find((c) => c.id === conversationId);
      if (!target?.unread) return;
      qc.setQueryData<Conversation[]>(['conversations', meId], (current) =>
        (current ?? []).map((c) => (c.id === conversationId ? { ...c, unread: false } : c)),
      );
      apiPatch(`/api/conversations/${conversationId}/read?userId=${meId}`).catch(() => {
        qc.invalidateQueries({ queryKey: ['conversations', meId] });
      });
    },
    [qc, meId],
  );
}

export function useOffers(state?: OfferState) {
  const { data: me } = useMe();
  return useQuery({
    queryKey: ['offers', me?.id, state ?? 'all'],
    queryFn: async () => {
      const params = new URLSearchParams({ userId: me!.id });
      if (state) params.set('status', state === 'expiring' ? 'new' : state);
      const rows = await apiGet<ApiOffer[]>(`/api/me/offers?${params.toString()}`);
      const mapped = rows.map(toOffer);
      return state ? mapped.filter((o) => o.state === state) : mapped;
    },
    enabled: !!me?.id,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return async (draft: ListingDraftBody): Promise<string | null> => {
    if (!me) return null;
    const title = draft.title.trim();
    if (!title || !draft.categoryId || !draft.conditionId) return null;
    const neighborhoodId = draft.neighborhoodId ?? me.homeNeighborhood?.id ?? null;
    if (!neighborhoodId) return null;
    const priceNum = parseInt(draft.priceAed, 10);
    if (!Number.isFinite(priceNum) || priceNum < 0) return null;

    const created = await apiPost<{ id: string; status: string }>('/api/listings', {
      userId: me.id,
      categoryId: draft.categoryId,
      conditionId: draft.conditionId,
      neighborhoodId,
      title,
      description: draft.description.trim(),
      priceAed: priceNum,
      acceptOffers: draft.acceptOffers,
      hasPickup: true,
      pickupNote: null,
    });

    if (draft.photos.length > 0) {
      const files: MultipartFile[] = draft.photos.map((p, i) => ({
        uri: p.uri,
        name: `photo_${i}.jpg`,
        type: p.mime || 'image/jpeg',
      }));
      await apiMultipartPost(`/api/listings/${created.id}/photos?userId=${me.id}`, files);
      await apiPost(`/api/listings/${created.id}/publish?userId=${me.id}`, undefined);
    }

    qc.invalidateQueries({ queryKey: ['listings'] });
    qc.invalidateQueries({ queryKey: ['my-listings'] });

    return created.id;
  };
}

type ListingStatusBucket = 'active' | 'paused' | 'sold';
const LISTING_BUCKETS: ListingStatusBucket[] = ['active', 'paused', 'sold'];

export function useUpdateListingStatus() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (id: string, newStatus: ListingStatusBucket) => {
    if (!me) return;

    qc.setQueryData<ListingDetail>(['listing', id], (current) =>
      current ? { ...current, status: newStatus } : current,
    );

    apiPatch(`/api/listings/${id}?userId=${me.id}`, { status: newStatus }).finally(() => {
      qc.invalidateQueries({ queryKey: ['my-listings'] });
      qc.invalidateQueries({ queryKey: ['listing', id] });
      qc.invalidateQueries({ queryKey: ['me', me.id] });
    });
  };
}

export function useUpdateListing() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return async (id: string, body: ListingUpdateBody): Promise<boolean> => {
    if (!me) return false;
    try {
      await apiPatch(`/api/listings/${id}?userId=${me.id}`, body);
      qc.invalidateQueries({ queryKey: ['listing', id] });
      qc.invalidateQueries({ queryKey: ['my-listings'] });
      return true;
    } catch {
      return false;
    }
  };
}

export function useUpdateListingPhotos() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return async (id: string, items: EditPhotoItem[]): Promise<boolean> => {
    if (!me) return false;

    const original = qc.getQueryData<ListingDetail>(['listing', id]);
    const originalPhotos = original?.photos ?? [];

    const keptIds = new Set(
      items.flatMap((it) => (it.kind === 'remote' ? [it.photo.id] : [])),
    );
    const removedIds = originalPhotos.filter((p) => !keptIds.has(p.id)).map((p) => p.id);
    const localPhotos = items.flatMap((it) => (it.kind === 'local' ? [it.photo] : []));

    try {
      for (const photoId of removedIds) {
        await apiDelete(`/api/listings/${id}/photos/${photoId}?userId=${me.id}`);
      }

      let uploaded: ListingPhoto[] = [];
      if (localPhotos.length > 0) {
        const stamp = Date.now();
        const files: MultipartFile[] = localPhotos.map((p, i) => ({
          uri: p.uri,
          name: `photo_${stamp}_${i}.jpg`,
          type: p.mime || 'image/jpeg',
        }));
        uploaded = await apiMultipartPost<ListingPhoto[]>(
          `/api/listings/${id}/photos?userId=${me.id}`,
          files,
        );
      }

      let uploadIdx = 0;
      const desiredOrder: string[] = items.map((it) =>
        it.kind === 'remote' ? it.photo.id : uploaded[uploadIdx++].id,
      );

      // After delete+upload, the server's natural order is: surviving remote photos by
      // their original sortOrder, then newly uploaded photos in upload order. If the
      // user's desired order matches that, no PATCH is needed.
      const naturalServerOrder: string[] = [
        ...items
          .flatMap((it) => (it.kind === 'remote' ? [it.photo] : []))
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((p) => p.id),
        ...uploaded.map((p) => p.id),
      ];
      const reorderNeeded =
        desiredOrder.length > 1 &&
        desiredOrder.some((id, i) => id !== naturalServerOrder[i]);

      if (reorderNeeded) {
        // The PATCH endpoint bumps every photo's SortOrder by +100, then sets values
        // from `order`. Photos NOT in `order` get stranded at sortOrder+100 — so the
        // request MUST list every surviving photo (existing + newly uploaded).
        await apiPatch(`/api/listings/${id}/photos?userId=${me.id}`, {
          order: desiredOrder.map((photoId, sortOrder) => ({ photoId, sortOrder })),
        });
      }

      qc.invalidateQueries({ queryKey: ['listing', id] });
      return true;
    } catch {
      qc.invalidateQueries({ queryKey: ['listing', id] });
      return false;
    }
  };
}

export function useDeleteListing() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (id: string) => {
    if (!me) return;

    apiDelete(`/api/listings/${id}?userId=${me.id}`).finally(() => {
      qc.removeQueries({ queryKey: ['listing', id] });
      qc.invalidateQueries({ queryKey: ['my-listings'] });
      qc.invalidateQueries({ queryKey: ['me', me.id] });
    });
  };
}

export function useBoostListing() {
  const qc = useQueryClient();

  return (id: string) => {
    const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    qc.setQueryData<ListingDetail>(['listing', id], (current) =>
      current ? { ...current, isBoosted: true, boostEndsAt: endsAt } : current,
    );
    for (const bucket of LISTING_BUCKETS) {
      qc.setQueryData<ListingSummary[]>(['my-listings', bucket], (current) =>
        (current ?? []).map((l) => (l.id === id ? { ...l, isBoosted: true } : l)),
      );
    }
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
      photoCount: draft.photos.length,
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

export function useCounterOffer() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (conversationId: string, originalOfferId: string, counterAed: number) => {
    if (!me || counterAed <= 0) return;

    qc.setQueryData<Message[]>(['messages', conversationId, me.id], (current) => {
      const list = current ?? [];
      return list.map((m) =>
        m.offer && m.offer.id === originalOfferId
          ? { ...m, offer: { ...m.offer, state: 'countered' as OfferState } }
          : m,
      );
    });

    apiPost(`/api/offers/${originalOfferId}/counter`, { userId: me.id, amountAed: counterAed })
      .finally(() => {
        qc.invalidateQueries({ queryKey: ['messages', conversationId, me.id] });
        qc.invalidateQueries({ queryKey: ['conversations', me.id] });
        qc.invalidateQueries({ queryKey: ['offers', me.id] });
      });
  };
}

export function useDecideOffer() {
  const qc = useQueryClient();
  const { data: me } = useMe();

  return (offerId: string, conversationId: string, decision: 'accepted' | 'declined') => {
    if (!me) return;

    qc.setQueryData<Message[]>(['messages', conversationId, me.id], (current) => {
      const list = current ?? [];
      return list.map((m) =>
        m.offer && m.offer.id === offerId
          ? { ...m, offer: { ...m.offer, state: decision } }
          : m,
      );
    });

    apiPatch(`/api/offers/${offerId}`, { userId: me.id, decision }).finally(() => {
      qc.invalidateQueries({ queryKey: ['messages', conversationId, me.id] });
      qc.invalidateQueries({ queryKey: ['offers', me.id] });
    });
  };
}
