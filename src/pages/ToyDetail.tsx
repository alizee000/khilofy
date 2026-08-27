import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Share2, Heart, ShieldCheck, MapPin, Star, Sparkles, ChevronLeft, Check } from 'lucide-react';
import { TOYS, OWNERS } from '../data/seedData';
import { useAppContext } from '../context/AppContext';

export default function ToyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [added, setAdded] = useState(false);
  
  // Find toy from global live state, fallback to mock if loading
  const toy = state.toys.find(t => t.id === id) || state.toys[0] || TOYS[0];
  const owner = OWNERS[toy.ownerId] || OWNERS['o1'];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Top Nav */}
      <div className="absolute top-0 w-full z-10 flex justify-between items-center p-4">
        <button onClick={() => navigate(-1)} className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <Link to="/cart" className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-gray-600 relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            {state.cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {state.cart.length}
              </span>
            )}
          </Link>
          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-gray-600">
            <Heart size={20} />
          </button>
          <button className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-gray-600">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="w-full aspect-square bg-gray-200 relative">
        <img src={toy.images[0]} alt={toy.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 flex items-center gap-1 shadow-sm">
          1 / {toy.images.length}
        </div>
      </div>

      <div className="px-4 py-6 bg-white rounded-t-3xl -mt-6 relative z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        
        {/* Title & Trust */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight pr-4">{toy.name}</h1>
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
              <Star size={14} className="fill-yellow-500 text-yellow-500" />
              {toy.rating}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {toy.recentRentalsCount > 10 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1">
                🔥 Trending nearby
              </span>
            )}
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              Age {toy.ageRange}
            </span>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Rental Duration</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white border border-brand-500 rounded-xl py-2 px-1 shadow-sm ring-1 ring-brand-100">
              <div className="text-[10px] font-semibold text-gray-500 uppercase">1 Day</div>
              <div className="text-sm font-bold text-brand-600">₹{toy.rentalRates.oneDay}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl py-2 px-1">
              <div className="text-[10px] font-semibold text-gray-500 uppercase">3 Days</div>
              <div className="text-sm font-bold text-gray-900">₹{toy.rentalRates.threeDays}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl py-2 px-1">
              <div className="text-[10px] font-semibold text-gray-500 uppercase">7 Days</div>
              <div className="text-sm font-bold text-gray-900">₹{toy.rentalRates.sevenDays}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl py-2 px-1">
              <div className="text-[10px] font-semibold text-gray-500 uppercase">30 Days</div>
              <div className="text-sm font-bold text-gray-900">₹{toy.rentalRates.thirtyDays}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-green-500" /> Fully refundable deposit: ₹{toy.deposit}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 p-3 bg-trust-50 rounded-xl border border-trust-100">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-trust-600">✨</div>
            <div>
              <div className="text-xs font-bold text-trust-900">Cleaning Checked</div>
              <div className="text-[10px] text-trust-700">Sanitized before delivery</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="bg-white p-1.5 rounded-lg shadow-sm text-blue-600">🛡</div>
            <div>
              <div className="text-xs font-bold text-blue-900">Condition Verified</div>
              <div className="text-[10px] text-blue-700">{toy.condition}</div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={owner.avatarUrl} alt={owner.name} className="w-12 h-12 rounded-full bg-gray-200" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 text-sm">{owner.name}</span>
                {owner.verified && <ShieldCheck size={14} className="text-blue-500 fill-blue-50" />}
              </div>
              <div className="text-xs text-gray-500">{owner.type} • {owner.trustScore}/100 Trust Score</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900 flex items-center justify-end gap-0.5">
              <MapPin size={14} className="text-brand-500" /> {toy.location.distanceKm}km
            </div>
            <div className="text-xs text-gray-500">~{toy.location.deliveryMinutes} min away</div>
          </div>
        </div>

        {/* Try before you buy hook */}
        <div className="bg-gradient-to-r from-purple-50 to-brand-50 rounded-2xl p-4 border border-purple-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1">
              <Sparkles size={16} /> Want to buy it?
            </h4>
            <p className="text-xs text-purple-700 mt-0.5">Rent it. If your kid loves it, buy it.</p>
          </div>
          <div className="text-[10px] font-bold text-brand-600 bg-white px-2 py-1 rounded-md shadow-sm border border-brand-100">
            8 parents did this
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={() => {
              dispatch({ type: 'ADD_TO_CART', payload: toy });
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }} 
            className={`flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3.5 rounded-xl text-center shadow-sm transition-all ${
              added ? 'bg-brand-50 border-brand-500 text-brand-600' : 'bg-white border-brand-500 text-brand-600 hover:bg-brand-50'
            }`}
          >
            {added ? <><Check size={18} /> Added</> : 'Add to Cart'}
          </button>
          <Link to={`/checkout/${toy.id}`} className="flex-1 bg-brand-500 text-white font-bold py-3.5 rounded-xl text-center shadow-lg hover:bg-brand-600 transition-colors flex items-center justify-center gap-1">
            Rent Now <span className="text-xs font-normal">₹{toy.rentalRates.oneDay}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
