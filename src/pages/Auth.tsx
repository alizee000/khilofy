import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ChevronLeft } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const from = '/'; // Always navigate to home screen upon signin

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const demoEmail = 'test@khilofy.in';
    const demoPassword = 'testpassword123';
    
    let { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword });
    
    if (error) {
      const { error: signUpError } = await supabase.auth.signUp({ email: demoEmail, password: demoPassword });
      if (!signUpError) error = null;
      else error = signUpError;
    }

    if (error) {
      // If we hit a rate limit or another Supabase block during the demo login, fallback to local Guest Mode so they can still test the app!
      console.warn("Supabase Auth failed, falling back to Guest Mode:", error.message);
      localStorage.setItem('khilofy_guest', 'true');
      window.location.reload(); // Reload to let AuthContext pick up the guest session
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col relative">
      <div className="px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 text-gray-500">
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 pb-20">
        <div className="w-16 h-16 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
          <span className="text-3xl">🧸</span>
        </div>
        
        <h1 className="text-4xl font-display font-black text-brand-500 mb-1 tracking-tight">
          Khilofy
        </h1>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome back!' : 'Rent. Play. Return.'}
        </h2>
        <p className="text-gray-500 mb-8">
          {isLogin ? 'Sign in to access your rentals and earnings.' : 'Start renting, earning, and saving today.'}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              placeholder="parent@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium pt-1">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-md mt-4 flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {loading ? <Sparkles size={18} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-brand-50 text-brand-700 font-bold py-4 rounded-xl shadow-sm flex justify-center items-center gap-2 hover:bg-brand-100 transition-colors disabled:opacity-70 border border-brand-200"
          >
            🚀 One-Click Test Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-brand-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
