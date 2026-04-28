import { apiPost } from './client';
import type { Me } from './types';

export type VerifyOtpResponse = { user: Me; sessionId: string };
export type RegisterRequest = {
  phone: string;
  firstName: string;
  lastName: string;
  handle: string;
  neighborhoodId: string;
};

export function verifyOtp(phone: string, code: string) {
  return apiPost<VerifyOtpResponse>('/api/auth/verify-otp', { phone, code });
}

export function register(req: RegisterRequest) {
  return apiPost<{ user: Me }>('/api/auth/register', req);
}

export function logout() {
  return apiPost<null>('/api/auth/logout', undefined);
}
