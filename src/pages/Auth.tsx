import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SignIn, SignUp, useUser } from '@clerk/react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image - Taller on desktop, proper fade on mobile */}
      <div className="absolute top-0 w-full h-72 md:h-96 z-0">
        <img src="/auth-banner.jpg" alt="Khelo N Dedo Flow" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/70 to-transparent"></div>
      </div>

      {/* Back Button */}
      <div className="px-4 py-4 flex items-center gap-4 absolute top-0 z-20 w-full">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-900 bg-white/90 rounded-full backdrop-blur-md shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={24} />
        </button>
      </div>
      
      {/* Scrollable Container for Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 pb-12 pt-28 md:pt-20 relative z-10 overflow-y-auto w-full">
        <div className="w-full max-w-md flex justify-center mb-6">
          {isLogin ? (
            <div className="w-full flex flex-col items-center">
              <SignIn routing="hash" />
              <button onClick={() => setIsLogin(false)} className="mt-4 text-brand-600 text-sm font-semibold hover:underline">
                Don't have an account? Sign up
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <SignUp routing="hash" />
              <button onClick={() => setIsLogin(true)} className="mt-4 text-brand-600 text-sm font-semibold hover:underline">
                Already have an account? Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
