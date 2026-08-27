import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isGuest = localStorage.getItem('khilofy_guest') === 'true';

    // Get initial session
    const checkAuth = async () => {
      if (isGuest) {
        const mockUser = { id: '00000000-0000-0000-0000-000000000000', email: 'guest@khilofy.in' } as User;
        setSession({ user: mockUser, access_token: 'mock', refresh_token: 'mock', expires_in: 9999, expires_at: 9999, token_type: 'bearer' });
        setUser(mockUser);
        setProfile({ id: '00000000-0000-0000-0000-000000000000', full_name: 'Guest User', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest' });
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setIsLoading(false);
    };
    
    checkAuth();

    if (isGuest) return; // Do not subscribe to real auth changes if in Guest Mode

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
