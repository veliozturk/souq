import type { Bilingual, SellerSummary } from '../../api/types';

export const DEMO_ME_ID = 'usr_demo_me';
export const DEMO_NEIGHBORHOODS = {
  marina: { id: 'nbh_marina', slug: 'dubai-marina', name: { en: 'Dubai Marina', ar: 'دبي مارينا' } as Bilingual },
  downtown: { id: 'nbh_downtown', slug: 'downtown', name: { en: 'Downtown', ar: 'وسط المدينة' } as Bilingual },
  jbr: { id: 'nbh_jbr', slug: 'jbr', name: { en: 'JBR', ar: 'جي بي آر' } as Bilingual },
  jlt: { id: 'nbh_jlt', slug: 'jlt', name: { en: 'JLT', ar: 'جي إل تي' } as Bilingual },
  businessBay: { id: 'nbh_business_bay', slug: 'business-bay', name: { en: 'Business Bay', ar: 'الخليج التجاري' } as Bilingual },
  jumeirah: { id: 'nbh_jumeirah', slug: 'jumeirah', name: { en: 'Jumeirah', ar: 'جميرا' } as Bilingual },
};

export const DEMO_CATEGORIES = {
  furniture: { id: 'cat_furniture', slug: 'furniture', name: { en: 'Furniture', ar: 'أثاث' } as Bilingual },
  electronics: { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics', ar: 'إلكترونيات' } as Bilingual },
  fashion: { id: 'cat_fashion', slug: 'fashion', name: { en: 'Fashion', ar: 'أزياء' } as Bilingual },
  home: { id: 'cat_home', slug: 'home', name: { en: 'Home', ar: 'منزل' } as Bilingual },
  sports: { id: 'cat_sports', slug: 'sports', name: { en: 'Sports', ar: 'رياضة' } as Bilingual },
  kids: { id: 'cat_kids', slug: 'kids', name: { en: 'Kids', ar: 'أطفال' } as Bilingual },
};

export const DEMO_SELLERS: Record<string, SellerSummary> = {
  aisha: {
    id: 'usr_aisha', handle: 'aisha.m', name: 'Aisha Al Mansouri',
    avatarUrl: null, avatarInitial: 'A', isVerified: true, joinedYear: 2023,
  },
  rami: {
    id: 'usr_rami', handle: 'rami', name: 'Rami',
    avatarUrl: null, avatarInitial: 'R', isVerified: true, joinedYear: 2024,
  },
  priya: {
    id: 'usr_priya', handle: 'priya', name: 'Priya',
    avatarUrl: null, avatarInitial: 'P', isVerified: true, joinedYear: 2022,
  },
  khalid: {
    id: 'usr_khalid', handle: 'khalid', name: 'Khalid',
    avatarUrl: null, avatarInitial: 'K', isVerified: true, joinedYear: 2024,
  },
  omar: {
    id: 'usr_omar', handle: 'omar', name: 'Omar K.',
    avatarUrl: null, avatarInitial: 'O', isVerified: false, joinedYear: 2025,
  },
  layla: {
    id: 'usr_layla', handle: 'layla', name: 'Layla R.',
    avatarUrl: null, avatarInitial: 'L', isVerified: true, joinedYear: 2024,
  },
  ahmed: {
    id: 'usr_ahmed', handle: 'ahmed', name: 'Ahmed S.',
    avatarUrl: null, avatarInitial: 'A', isVerified: false, joinedYear: 2025,
  },
  hassan: {
    id: 'usr_hassan', handle: 'hassan', name: 'Hassan T.',
    avatarUrl: null, avatarInitial: 'H', isVerified: false, joinedYear: 2025,
  },
  noura: {
    id: 'usr_noura', handle: 'noura', name: 'Noura A.',
    avatarUrl: null, avatarInitial: 'N', isVerified: true, joinedYear: 2024,
  },
  sara: {
    id: 'usr_sara', handle: 'sara', name: 'Sara D.',
    avatarUrl: null, avatarInitial: 'S', isVerified: false, joinedYear: 2025,
  },
  rashid: {
    id: 'usr_rashid', handle: 'rashid', name: 'Rashid N.',
    avatarUrl: null, avatarInitial: 'R', isVerified: true, joinedYear: 2023,
  },
  fatima: {
    id: 'usr_fatima', handle: 'fatima', name: 'Fatima L.',
    avatarUrl: null, avatarInitial: 'F', isVerified: true, joinedYear: 2024,
  },
  yusuf: {
    id: 'usr_yusuf', handle: 'yusuf', name: 'Yusuf K.',
    avatarUrl: null, avatarInitial: 'Y', isVerified: false, joinedYear: 2025,
  },
};

export const ME_AS_SELLER: SellerSummary = {
  id: DEMO_ME_ID, handle: 'aisha.m', name: 'Aisha Al Mansouri',
  avatarUrl: null, avatarInitial: 'A', isVerified: true, joinedYear: 2023,
};
