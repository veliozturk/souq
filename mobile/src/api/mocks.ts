import { CATEGORIES } from '../data/fixtures/categories';
import { CONVERSATIONS } from '../data/fixtures/conversations';
import { DRAFTS } from '../data/fixtures/drafts';
import { FAVORITES } from '../data/fixtures/favorites';
import {
  HOME_LISTINGS,
  MY_ACTIVE_LISTINGS,
  SEARCH_LISTINGS_FURNITURE,
  SELLER_LISTINGS_AISHA,
} from '../data/fixtures/listings';
import { buildListingDetail } from '../data/fixtures/listingDetails';
import { LISTING_STATS_BY_ID } from '../data/fixtures/listingStats';
import { ME } from '../data/fixtures/me';
import { MESSAGES_BY_CONVERSATION } from '../data/fixtures/messages';
import { OFFERS } from '../data/fixtures/offers';
import { USERS_BY_ID } from '../data/fixtures/users';

type Handler = (path: string, query: URLSearchParams) => unknown;

const exact: Record<string, Handler> = {
  '/api/categories': () => CATEGORIES,
  '/api/me': () => ME,
  '/api/me/favorites': () => FAVORITES,
  '/api/me/offers': (_p, q) => {
    const status = q.get('status');
    return status ? OFFERS.filter((o) => o.state === status) : OFFERS;
  },
  '/api/listings/drafts': () => DRAFTS,
  '/api/conversations': () => CONVERSATIONS,
};

const prefix: { match: (p: string) => boolean; handle: Handler }[] = [
  {
    match: (p) => p.startsWith('/api/listings/') && p.endsWith('/stats'),
    handle: (path) => {
      const id = path.split('/')[3];
      return LISTING_STATS_BY_ID[id] ?? null;
    },
  },
  {
    match: (p) => /^\/api\/conversations\/[^/]+\/messages$/.test(p),
    handle: (path) => {
      const id = path.split('/')[3];
      return MESSAGES_BY_CONVERSATION[id] ?? [];
    },
  },
  {
    match: (p) => /^\/api\/users\/[^/]+$/.test(p),
    handle: (path) => {
      const id = path.split('/')[3];
      return USERS_BY_ID[id] ?? null;
    },
  },
  {
    match: (p) => /^\/api\/listings\/[^/]+$/.test(p),
    handle: (path) => {
      const id = path.split('/')[3];
      return buildListingDetail(id);
    },
  },
];

export function findMock(path: string): unknown | undefined {
  const [pathOnly, queryString = ''] = path.split('?');
  const query = new URLSearchParams(queryString);

  if (exact[pathOnly]) return exact[pathOnly](pathOnly, query);

  if (pathOnly === '/api/listings') return resolveListings(query);

  for (const route of prefix) {
    if (route.match(pathOnly)) return route.handle(pathOnly, query);
  }
  return undefined;
}

function resolveListings(q: URLSearchParams) {
  const sellerId = q.get('sellerId');
  const categoryId = q.get('categoryId');
  const search = q.get('q')?.toLowerCase();

  if (sellerId === 'me' || sellerId === ME.id) return MY_ACTIVE_LISTINGS;
  if (sellerId === 'usr_aisha') return SELLER_LISTINGS_AISHA;
  if (categoryId === 'cat_furniture' || search) return SEARCH_LISTINGS_FURNITURE;
  return HOME_LISTINGS;
}
