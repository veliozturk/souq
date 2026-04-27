import type { Category } from '../../api/types';

export const CATEGORIES: Category[] = [
  { id: 'cat_furniture',   slug: 'furniture',   name: { en: 'Furniture',   ar: 'أثاث' },        iconName: 'cat-furniture',   parentId: null, sortOrder: 1 },
  { id: 'cat_electronics', slug: 'electronics', name: { en: 'Electronics', ar: 'إلكترونيات' }, iconName: 'cat-electronics', parentId: null, sortOrder: 2 },
  { id: 'cat_fashion',     slug: 'fashion',     name: { en: 'Fashion',     ar: 'أزياء' },       iconName: 'cat-fashion',     parentId: null, sortOrder: 3 },
  { id: 'cat_home',        slug: 'home',        name: { en: 'Home',        ar: 'منزل' },         iconName: 'cat-home',        parentId: null, sortOrder: 4 },
  { id: 'cat_sports',      slug: 'sports',      name: { en: 'Sports',      ar: 'رياضة' },       iconName: 'cat-sports',      parentId: null, sortOrder: 5 },
  { id: 'cat_kids',        slug: 'kids',        name: { en: 'Kids',        ar: 'أطفال' },       iconName: 'cat-kids',        parentId: null, sortOrder: 6 },
];
