import { useQuery } from '@tanstack/react-query';
import { apiGet } from './client';
import type {
  Category,
  Conversation,
  DraftListing,
  FavoriteListing,
  ListingDetail,
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

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => apiGet<FavoriteListing[]>('/api/me/favorites'),
  });
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

export function useOffers(state?: OfferState) {
  const path = state ? `/api/me/offers?status=${state}` : '/api/me/offers';
  return useQuery({
    queryKey: ['offers', state ?? 'all'],
    queryFn: () => apiGet<Offer[]>(path),
  });
}
