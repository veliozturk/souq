import type { UserDetail } from '../../api/types';
import { DEMO_NEIGHBORHOODS, DEMO_SELLERS } from './_demoEntities';

const userDetail = (
  s: typeof DEMO_SELLERS[keyof typeof DEMO_SELLERS],
  ratingAvg: number | null,
  soldCount: number,
  homeNbh: { id: string; slug: string; name: { en: string; ar: string } } | null,
  replyTime: string | null,
): UserDetail => ({
  id: s.id,
  handle: s.handle,
  name: s.name,
  avatarUrl: s.avatarUrl,
  avatarInitial: s.avatarInitial,
  joinedYear: s.joinedYear,
  isVerified: s.isVerified,
  homeNeighborhood: homeNbh,
  ratingAvg,
  soldCount,
  replyTime,
});

export const USERS_BY_ID: Record<string, UserDetail> = {
  usr_aisha: userDetail(DEMO_SELLERS.aisha, 4.9, 11, DEMO_NEIGHBORHOODS.marina, '~2h'),
  usr_rami: userDetail(DEMO_SELLERS.rami, 4.7, 8, DEMO_NEIGHBORHOODS.downtown, '~3h'),
  usr_priya: userDetail(DEMO_SELLERS.priya, 5.0, 14, DEMO_NEIGHBORHOODS.jlt, '~1h'),
  usr_khalid: userDetail(DEMO_SELLERS.khalid, 4.8, 6, DEMO_NEIGHBORHOODS.jumeirah, '~4h'),
  usr_omar: userDetail(DEMO_SELLERS.omar, null, 0, DEMO_NEIGHBORHOODS.marina, null),
  usr_layla: userDetail(DEMO_SELLERS.layla, 4.6, 4, DEMO_NEIGHBORHOODS.marina, '~2h'),
  usr_ahmed: userDetail(DEMO_SELLERS.ahmed, null, 1, DEMO_NEIGHBORHOODS.jlt, null),
};
