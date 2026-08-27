import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const { user } = useAuth();
  
  const toy = state.toys.find(t => t.id === id) || state.toys[0];
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase.from('rentals').insert([
      {
        toy_id: toy.id,
        renter_id: user.id,
        status: 'active'
      }
    ]);

    setLoading(false);
    if (!error) {
      setIsSuccess(true);
      // Wait a moment before fetching updated context if needed
    } else {
      console.error(error);
      alert('Checkout failed!');
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-brand-500 min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="bg-white p-4 rounded-full mb-6 relative z-10 animate-in zoom-in duration-500">
          <CheckCircle2 size={64} className="text-brand-500" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2 text-center relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-100">Toy Reserved!</h1>
        <p className="text-brand-100 text-center mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          Your kid is getting the <br/><strong>{toy.name}</strong> 🚀
        </p>
        
        {/* Viral Share Hook */}
        <div className="bg-white w-full rounded-3xl p-6 text-center text-gray-900 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <h3 className="font-bold text-lg mb-2">Want ₹100 Off?</h3>
          <p className="text-sm text-gray-500 mb-6">Share this toy with parents nearby. If they rent it, you both get ₹100.</p>
          
          <button className="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl shadow-md mb-3 flex justify-center items-center gap-2">
            Share on WhatsApp
          </button>
          <button onClick={() => navigate('/profile')} className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl">
            View My Rentals
          </button>
        </div>
      </div>
    );
  }

  const duration = 1;
  const rentalFee = toy.rentalRates.oneDay;
  const deliveryFee = 99;
  const deposit = toy.deposit;
  const total = rentalFee + deliveryFee + deposit;

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-safe">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Item Summary */}
        <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
          <img src={toy.images[0]} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 leading-tight mb-1">{toy.name}</h3>
            <p className="text-xs text-gray-500">Duration: {duration} Day</p>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-100 relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-5">
            <Truck size={100} />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Truck size={18} className="text-brand-500" />
            <h3 className="font-bold text-gray-900">Delivery Address</h3>
          </div>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2">
            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <span>{state.user.location.address}</span>
          </div>
          <p className="text-xs font-semibold text-brand-600 mt-3 text-right">~{toy.location.deliveryMinutes} min away</p>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Rental Fee ({duration} Day)</span>
              <span className="font-semibold text-gray-900">₹{rentalFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery & Pickup</span>
              <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-gray-800 font-semibold">Refundable Deposit</span>
                <ShieldCheck size={14} className="text-green-500" />
              </div>
              <span className="font-semibold text-gray-900">₹{deposit}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Payable</span>
            <span className="font-bold text-xl text-brand-600">₹{total}</span>
          </div>
          
          <div className="bg-green-50 text-green-700 text-xs font-bold p-3 rounded-xl mt-3 text-center border border-green-100">
            ₹{deposit} will be refunded upon return
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          {loading ? 'Processing...' : `Pay ₹${total} Securely`}
        </button>

      </div>
    </div>
  );
}
