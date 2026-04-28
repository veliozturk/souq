import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Me } from '../api/types';
import { logout as apiLogout } from '../api/auth';
import { getSessionId, setSessionId } from './sessionRef';
import { loadSession, saveSession, clearSession } from './sessionStorage';

export type SignupDraft = {
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  handle: string | null;
  neighborhoodId: string | null;
  neighborhoodName: string | null;
};

const EMPTY_DRAFT: SignupDraft = {
  phone: null,
  firstName: null,
  lastName: null,
  handle: null,
  neighborhoodId: null,
  neighborhoodName: null,
};

type AuthStubValue = {
  isAuthed: boolean;
  hydrating: boolean;
  currentUser: Me | null;
  pendingUser: Me | null;
  setPendingUser: (u: Me | null) => void;
  signupDraft: SignupDraft;
  setSignupDraft: (patch: Partial<SignupDraft>) => void;
  signIn: (user: Me, sessionId: string) => void;
  signOut: () => void;
  updateMe: (patch: Partial<Me>) => void;
};

const AuthStubCtx = createContext<AuthStubValue | null>(null);

export function AuthStubProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Me | null>(null);
  const [pendingUser, setPendingUser] = useState<Me | null>(null);
  const [signupDraft, setDraft] = useState<SignupDraft>(EMPTY_DRAFT);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadSession().then((stored) => {
      if (cancelled) return;
      if (stored) {
        setSessionId(stored.sessionId);
        setCurrentUser(stored.user);
      }
      setHydrating(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthStubCtx.Provider
      value={{
        isAuthed: currentUser !== null,
        hydrating,
        currentUser,
        pendingUser,
        setPendingUser,
        signupDraft,
        setSignupDraft: (patch) => setDraft((prev) => ({ ...prev, ...patch })),
        signIn: (user, sessionId) => {
          setSessionId(sessionId);
          setCurrentUser(user);
          setPendingUser(null);
          setDraft(EMPTY_DRAFT);
          saveSession({ user, sessionId });
        },
        signOut: () => {
          apiLogout().catch(() => {
            // best-effort; clear local state regardless
          });
          setSessionId(null);
          setCurrentUser(null);
          setPendingUser(null);
          setDraft(EMPTY_DRAFT);
          clearSession();
        },
        updateMe: (patch) =>
          setCurrentUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...patch };
            const sid = getSessionId();
            if (sid) saveSession({ user: next, sessionId: sid });
            return next;
          }),
      }}>
      {children}
    </AuthStubCtx.Provider>
  );
}

export function useAuthStub(): AuthStubValue {
  const v = useContext(AuthStubCtx);
  if (!v) throw new Error('useAuthStub used outside AuthStubProvider');
  return v;
}
