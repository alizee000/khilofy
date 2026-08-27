import { Settings, Shield, Award, Share2, Gift } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ToyCard from '../components/ToyCard';

export default function Profile() {
  const { state } = useAppContext();
  const { user, activeRentals, toys } = state;
  
  // Calculate dynamic stats
  const totalRented = 12 + activeRentals.length; // Baseline 12 + newly rented
  const myListings = toys.filter(t => t.ownerId === user.id);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-6">
      {/* Header Profile Section */}
      <div className="bg-white px-4 pt-10 pb-6 rounded-b-[30px] shadow-sm relative">
        <div className="absolute top-6 right-4">
          <Settings size={24} className="text-gray-400" />
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full border-4 border-brand-50 shadow-sm" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex items-center gap-1 text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-1 w-fit">
              <Award size={14} /> Score: {user.toyLoopScore}
            </div>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900">{totalRented}</div>
            <div className="text-xs text-gray-500 font-medium">Toys Rented</div>
          </div>
          <div className="border-x border-gray-100">
            <div className="text-xl font-bold text-trust-600">₹{3.8 + (activeRentals.length * 1.2)}k</div>
            <div className="text-xs text-gray-500 font-medium">Saved vs Buying</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">{23 + (activeRentals.length * 2)}kg</div>
            <div className="text-xs text-gray-500 font-medium">Waste Avoided</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">

        {/* Active Rentals Hook */}
        {activeRentals.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Your Active Rentals</h3>
            <div className="flex flex-col gap-4">
              {activeRentals.map(toy => (
                <ToyCard key={`rental-${toy.id}`} toy={toy} />
              ))}
            </div>
          </div>
        )}
        
        {/* Owner Dashboard Hook */}
        <div className="bg-gradient-to-r from-trust-600 to-trust-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-20">
            <Shield size={100} />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-trust-100 mb-1">Owner Dashboard</h2>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold">₹{user.earnings.toLocaleString('en-IN')}</span>
            <span className="text-trust-100 text-sm font-medium pb-1">earned this month</span>
          </div>
          <p className="text-sm text-trust-50 mb-4 max-w-[80%]">Your toys earned money while you were doing nothing.</p>
          <button className="bg-white text-trust-700 font-bold px-4 py-2 rounded-xl text-sm w-full shadow-sm">
            Manage Listings ({myListings.length} Active)
          </button>
        </div>

        {/* Badges */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Your Badges</h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {user.badges.map(badge => (
              <div key={badge} className="bg-white border border-gray-200 rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-3xl mb-2">{badge.split(' ')[0]}</span>
                <span className="text-xs font-semibold text-gray-700">{badge.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
            {activeRentals.length > 0 && (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-3xl mb-2">🌟</span>
                <span className="text-xs font-semibold text-brand-700">Active Renter</span>
              </div>
            )}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 min-w-[120px] flex flex-col items-center justify-center text-center text-gray-400">
              <span className="text-2xl mb-2">🔒</span>
              <span className="text-[10px] font-semibold uppercase">Unlock Next</span>
            </div>
          </div>
        </div>

        {/* Share & Referral */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Give ₹100, Get ₹100</h3>
              <p className="text-xs text-gray-500 mt-1">Invite friends to ToyLoop</p>
            </div>
            <div className="bg-brand-50 p-2 rounded-full text-brand-500">
              <Gift size={20} />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-xl">
            <Share2 size={16} /> Share Link
          </button>
        </div>

      </div>
    </div>
  );
}
