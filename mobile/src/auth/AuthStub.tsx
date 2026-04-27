import { createContext, useContext, useState, ReactNode } from 'react';

type AuthStubValue = {
  isAuthed: boolean;
  signIn: () => void;
  signOut: () => void;
  signupName: string;
  setSignupName: (n: string) => void;
  signupLocation: string | null;
  setSignupLocation: (l: string | null) => void;
};

const AuthStubCtx = createContext<AuthStubValue | null>(null);

export function AuthStubProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [signupName, setSignupName] = useState('Aisha Al Mansouri');
  const [signupLocation, setSignupLocation] = useState<string | null>(null);
  return (
    <AuthStubCtx.Provider
      value={{
        isAuthed,
        signIn: () => setIsAuthed(true),
        signOut: () => setIsAuthed(false),
        signupName,
        setSignupName,
        signupLocation,
        setSignupLocation,
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
