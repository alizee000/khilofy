import { useState, useEffect } from 'react';
import { Search, Sparkles, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ToyCard from '../components/ToyCard';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { profile } = useAuth();
  const { toys, user, searchQuery } = state;
  
  const [locationName, setLocationName] = useState('Finding location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
            const data = await res.json();
            if (data && data.address) {
              setLocationName(data.address.suburb || data.address.city || data.address.town || 'Current Location');
            } else {
              setLocationName('Bangalore');
            }
          } catch (e) {
            setLocationName('Bangalore');
          }
        },
        () => {
          setLocationName('Bangalore'); // Fallback if permission denied
        }
      );
    } else {
      setLocationName('Bangalore');
    }
  }, []);

  // Filter toys based on search
  const displayedToys = toys.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingToys = displayedToys.filter(t => t.recentRentalsCount > 10).slice(0, 2);
  
  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="bg-white px-4 pt-6 pb-4 rounded-b-3xl shadow-sm z-10 sticky top-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-500 text-sm font-medium flex items-center gap-1 cursor-pointer hover:text-brand-600 transition-colors">
              <Navigation size={14} className="text-brand-500" /> {locationName}
            </h2>
            <h1 className="text-2xl font-display font-bold text-gray-900 mt-1">
              What are we <span className="text-brand-500">playing</span> today?
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div onClick={() => navigate('/cart')} className="relative cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {state.cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {state.cart.length}
                </span>
              )}
            </div>
            <img src={profile?.avatar_url || user.avatarUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-brand-100 bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')} />
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full bg-gray-100 text-gray-900 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow placeholder-gray-500"
            placeholder="Search toys, LEGO, board games..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-8">
        
        {/* Trending Categories Chips */}
        <div className="-mt-2">
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 no-scrollbar">
            {[
              { label: '🧲 Magnetic Tiles', search: 'Magnetic' },
              { label: '🧱 LEGO / Construction', search: 'LEGO' },
              { label: '🚗 RC Cars', search: 'RC' },
              { label: '🤖 STEM + Robotics', search: 'Robot' },
              { label: '🎂 Birthday/Party', search: 'Party' }
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  if (searchQuery === cat.search) {
                    dispatch({ type: 'SET_SEARCH', payload: '' }); // Clear filter if clicked twice
                  } else {
                    dispatch({ type: 'SET_SEARCH', payload: cat.search });
                    // Scroll down a bit to show results
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium shadow-sm border transition-all ${
                  searchQuery === cat.search 
                    ? 'bg-brand-500 text-white border-brand-500' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Actions / Modes */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            onClick={() => navigate('/discover')}
            className="bg-brand-50 rounded-2xl p-3 flex flex-col items-center text-center shadow-soft border border-brand-100 cursor-pointer hover:bg-brand-100 transition-colors"
          >
            <div className="bg-white p-2 rounded-full text-2xl mb-2">🧸</div>
            <span className="text-xs font-semibold text-brand-900">Rent a Toy</span>
          </div>
          <div 
            onClick={() => navigate('/birthday')}
            className="bg-blue-50 rounded-2xl p-3 flex flex-col items-center text-center shadow-soft border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <div className="bg-white p-2 rounded-full text-2xl mb-2">🎂</div>
            <span className="text-xs font-semibold text-blue-900">Birthday</span>
          </div>
          <div 
            onClick={() => navigate('/list')}
            className="bg-trust-50 rounded-2xl p-3 flex flex-col items-center text-center shadow-soft border border-trust-100 cursor-pointer hover:bg-trust-100 transition-colors"
          >
            <div className="bg-white p-2 rounded-full text-2xl mb-2">💰</div>
            <span className="text-xs font-semibold text-trust-900">List Toy</span>
          </div>
        </div>

        {/* Trending Section */}
        {trendingToys.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
                🔥 Trending near you
              </h3>
              <span onClick={() => navigate('/discover')} className="text-sm font-medium text-brand-600 cursor-pointer hover:underline">See all</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {trendingToys.map(toy => (
                <ToyCard key={toy.id} toy={toy} />
              ))}
            </div>
          </div>
        )}

        {/* Top Picks for Boys */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
              🏎️ Top Picks for Boys
            </h3>
            <span onClick={() => navigate('/discover')} className="text-sm font-medium text-brand-600 cursor-pointer hover:underline">See all</span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 mb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
            {displayedToys.filter(t => t.targetGender === 'Boy').map(toy => (
              <div key={toy.id} className="shrink-0 w-48 snap-start">
                <ToyCard toy={toy} />
              </div>
            ))}
            {/* Fallback if no specific boy toys fetched yet */}
            {displayedToys.filter(t => t.targetGender === 'Boy').length === 0 && displayedToys.slice(0, 4).map(toy => (
               <div key={toy.id} className="shrink-0 w-48 snap-start">
                 <ToyCard toy={toy} />
               </div>
            ))}
          </div>
        </div>

        {/* Top Picks for Girls */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-1">
              🎀 Top Picks for Girls
            </h3>
            <span onClick={() => navigate('/discover')} className="text-sm font-medium text-brand-600 cursor-pointer hover:underline">See all</span>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 mb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
            {displayedToys.filter(t => t.targetGender === 'Girl').map(toy => (
              <div key={toy.id} className="shrink-0 w-48 snap-start">
                <ToyCard toy={toy} />
              </div>
            ))}
            {/* Fallback if no specific girl toys fetched yet */}
            {displayedToys.filter(t => t.targetGender === 'Girl').length === 0 && displayedToys.slice(4, 8).map(toy => (
               <div key={toy.id} className="shrink-0 w-48 snap-start">
                 <ToyCard toy={toy} />
               </div>
            ))}
          </div>
        </div>
        
        {/* AI Recommendations Hook */}
        {!searchQuery && (
          <div className="bg-gradient-to-r from-purple-100 to-brand-100 rounded-3xl p-5 relative overflow-hidden shadow-inner">
            <div className="absolute right-0 bottom-0 opacity-10 text-9xl">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" /> Not sure what to get?
            </h3>
            <p className="text-sm text-gray-700 mb-4 max-w-[80%]">Tell us about your child and we'll suggest the perfect weekend toy.</p>
            <button className="bg-white text-brand-600 font-semibold px-4 py-2 rounded-xl text-sm shadow-sm hover:shadow-md transition-shadow">
              Ask AI Assistant
            </button>
          </div>
        )}

        {/* All Toys */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {searchQuery ? 'Search Results' : 'Available Today'}
          </h3>
          {displayedToys.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No toys found matching "{searchQuery}"
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 mb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
              {displayedToys.map(toy => (
                <div key={toy.id} className="shrink-0 w-48 snap-start">
                  <ToyCard toy={toy} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
