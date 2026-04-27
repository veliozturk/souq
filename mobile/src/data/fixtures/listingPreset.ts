export type ListingPreset = {
  title: string;
  description: string;
  categoryId: string;
  conditionLabel: string;
  priceAed: string;
  acceptOffers: boolean;
  photoTints: string[];
};

export const LISTING_PRESET: ListingPreset = {
  title: 'IKEA Strandmon armchair, beige',
  description:
    'Bought 2 years ago, used in a smoke-free apartment in JLT. Small scratch on the right leg (shown in photo 3). No rips, no stains. Pickup from Marina Promenade.',
  categoryId: 'cat_furniture',
  conditionLabel: 'Like new',
  priceAed: '850',
  acceptOffers: true,
  photoTints: ['#6B7A8C', '#D4B896', '#8FA4B8', '#B8C4D0'],
};
