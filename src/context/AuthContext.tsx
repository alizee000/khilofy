import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AuthState {
  session: boolean;
  user: any | null;
  profile: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  session: false,
  user: null,
  profile: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const profile = useQuery(api.users.current);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isSignedIn && user) {
      storeUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "User",
        avatarUrl: user.imageUrl,
      });
    }
  }, [isSignedIn, user, storeUser]);

  const isLoading = !isLoaded || (isSignedIn && profile === undefined);

  return (
    <AuthContext.Provider value={{ 
      session: !!isSignedIn, 
      user: user, 
      profile: profile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
