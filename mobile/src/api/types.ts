export type Bilingual = { en: string; ar: string };
export type BilingualUgc = { original: string; en: string; ar: string };

export type Category = {
  id: string;
  slug: string;
  name: Bilingual;
  iconName: string | null;
  parentId: string | null;
  sortOrder: number;
};

export type SellerSummary = {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string | null;
  avatarInitial: string | null;
  isVerified: boolean;
  joinedYear: number;
};

export type ListingPhoto = {
  id: string;
  url: string;
  thumbUrl: string | null;
  sortOrder: number;
  width: number | null;
  height: number | null;
};

export type Neighborhood = {
  id: string;
  slug: string;
  name: Bilingual;
  centerLat: number | null;
  centerLng: number | null;
};

export type ListingSellerStats = {
  viewsCount: number;
  messagesCount: number;
  pendingOffersCount: number;
};

export type ListingSummary = {
  id: string;
  title: BilingualUgc;
  priceAed: number;
  previousPriceAed: number | null;
  publishedAt: string | null;
  categoryId: string;
  neighborhood: { id: string; slug: string; name: Bilingual };
  seller: SellerSummary;
  coverPhoto: { url: string; thumbUrl: string | null } | null;
  isBoosted: boolean;
  sellerStats?: ListingSellerStats | null;
};

export type ListingDetail = {
  id: string;
  title: BilingualUgc;
  description: BilingualUgc;
  priceAed: number;
  previousPriceAed: number | null;
  acceptOffers: boolean;
  hasPickup: boolean;
  pickupNote: string | null;
  status: string;
  publishedAt: string | null;
  seller: SellerSummary;
  category: { id: string; slug: string; name: Bilingual };
  condition: { id: string; slug: string; name: Bilingual };
  neighborhood: Neighborhood;
  photos: ListingPhoto[];
  isBoosted: boolean;
  boostEndsAt: string | null;
};

export type ListingFilters = {
  categoryId?: string;
  sellerId?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

export type UserDetail = {
  id: string;
  handle: string;
  name: string;
  avatarUrl: string | null;
  avatarInitial: string | null;
  joinedYear: number;
  isVerified: boolean;
  homeNeighborhood: { id: string; slug: string; name: Bilingual } | null;
  ratingAvg: number | null;
  soldCount: number;
  replyTime: string | null;
};

export type Me = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  avatarInitial: string | null;
  isVerified: boolean;
  ratingAvg: number | null;
  soldCount: number;
  homeNeighborhood: { id: string; slug: string; name: Bilingual } | null;
  counts: {
    activeListings: number;
    inactiveListings: number;
    soldListings: number;
    unreadOffers: number;
    savedItems: number;
  };
  walletBalanceAed: number;
};

export type ConversationPeer = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  avatarInitial: string | null;
  isOnline: boolean;
};

export type Conversation = {
  id: string;
  peer: ConversationPeer;
  listing: { id: string; title: string; priceAed: number };
  lastMessage: {
    text: string;
    createdAt: string;
    fromMe: boolean;
    relativeTime: string;
  };
  unread: boolean;
  hasOffer: boolean;
};

export type OfferState = 'new' | 'countered' | 'expiring' | 'declined' | 'accepted';

export type Message = {
  id: string;
  conversationId: string;
  fromUserId: string;
  fromMe: boolean;
  createdAt: string;
  kind: 'text' | 'offer';
  text: string | null;
  offer: {
    id: string;
    priceAed: number;
    listedPriceAed: number;
    pickupNote: string | null;
    state: OfferState;
  } | null;
};

export type Offer = {
  id: string;
  buyer: { id: string; displayName: string; avatarInitial: string | null };
  listing: { id: string; title: string; priceAed: number };
  offerAed: number;
  state: OfferState;
  createdAt: string;
  expiresAt: string | null;
  relativeTime: string;
};

export type ListingStats = {
  listingId: string;
  totals: {
    views: number;
    viewsTodayDelta: number;
    saves: number;
    savesRatePct: number;
    messages: number;
    unreadMessages: number;
  };
  views7d: { dayLabel: string; count: number; isToday: boolean }[];
};

export type DraftListing = {
  id: string;
  title: string | null;
  photoCount: number;
  hasPrice: boolean;
  updatedAt: string;
};

export type ListingDraftBody = {
  photoTints: string[];
  title: string;
  description: string;
  categoryId: string | null;
  conditionLabel: string | null;
  priceAed: string;
  acceptOffers: boolean;
};

export type DraftListingDetail = DraftListing & ListingDraftBody;

export type FavoriteListing = ListingSummary & { favoritedAt: string };
