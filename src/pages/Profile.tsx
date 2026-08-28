import { Settings, Shield, Award, Share2, Gift, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useClerk } from '@clerk/react';
import ToyCard from '../components/ToyCard';

export default function Profile() {
  const { state } = useAppContext();
  const { user, profile } = useAuth();
  const { activeRentals, toys } = state;
  
  if (!user) return null;

  // Safe defaults if Convex profile hasn't synced yet
  const safeProfile = profile || {
    name: user.fullName || user.firstName,
    avatarUrl: user.imageUrl,
    toyLoopScore: 0,
    earnings: 0,
  };

  // Calculate dynamic stats based purely on user data
  const totalRented = activeRentals.length; 
  const myListings = toys.filter(t => t.ownerId === user.id);
  
  // Calculate savings mathematically based on toys rented (deposit roughly equals retail price)
  const savings = activeRentals.reduce((sum, toy) => sum + (toy.deposit - toy.rentalRates.sevenDays), 0);
  const formattedSavings = savings >= 1000 ? (savings / 1000).toFixed(1) + 'k' : savings;
  
  const wasteAvoided = activeRentals.length * 2; // Rough estimate: 2kg of plastic per toy avoided

  const { signOut } = useClerk();

  const handleSignOut = async () => {
    // Clear local guest mode flag if it exists
    localStorage.removeItem('khelondedo_guest');
    await signOut();
    window.location.reload(); // Force full app reset to throw user back to Auth screen
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-6">
      {/* Header Profile Section */}
      <div className="bg-white px-4 pt-10 pb-6 rounded-b-[30px] shadow-sm relative">
        <div className="absolute top-6 right-4 flex gap-4">
          <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
          <Settings size={22} className="text-gray-400" />
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <img src={safeProfile.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.primaryEmailAddress?.emailAddress}`} alt={safeProfile.name} className="w-20 h-20 rounded-full border-4 border-brand-50 shadow-sm bg-gray-100" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{safeProfile.name || user.firstName}</h1>
            <div className="flex items-center gap-1 text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mt-1 w-fit">
              <Award size={14} /> Score: {safeProfile.toyLoopScore || 0}
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
            <div className="text-xl font-bold text-trust-600">₹{formattedSavings}</div>
            <div className="text-xs text-gray-500 font-medium">Saved vs Buying</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">{wasteAvoided}kg</div>
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
            <span className="text-3xl font-bold">₹{(safeProfile.earnings || 0).toLocaleString('en-IN')}</span>
            <span className="text-trust-100 text-sm font-medium pb-1">earned this month</span>
          </div>
          <p className="text-sm text-trust-50 mb-4 max-w-[80%]">Your toys earned money while you were doing nothing.</p>
          <button className="bg-white text-trust-700 font-bold px-4 py-2 rounded-xl text-sm w-full shadow-sm">
            Manage Listings ({myListings.length} Active)
          </button>
        </div>

        {/* Share & Referral */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Give ₹100, Get ₹100</h3>
              <p className="text-xs text-gray-500 mt-1">Invite friends to Khelo N Dedo</p>
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
