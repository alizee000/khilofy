import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAppContext();
  const { user } = useAuth();
  
  const checkoutMutation = useMutation(api.rentals.checkout);
  
  const searchParams = new URLSearchParams(location.search);
  const urlDuration = parseInt(searchParams.get('duration') || '1');

  const isCartCheckout = id === 'cart';
  const checkoutToys = isCartCheckout ? state.cart : (state.toys.find(t => t.id === id) ? [{ ...state.toys.find(t => t.id === id)!, selectedDuration: urlDuration as any }] : [state.toys[0]]);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [address, setAddress] = useState({
    street: '',
    apartment: '',
    pincode: '',
    city: 'Bangalore'
  });

  const isAddressValid = address.street.trim().length > 0 && address.pincode.trim().length === 6;
  const fullAddress = `${address.apartment ? address.apartment + ', ' : ''}${address.street}, ${address.city} - ${address.pincode}`;

  const rentalFee = checkoutToys.reduce((sum, t) => {
    const dur = t.selectedDuration || 1;
    if (dur === 30) return sum + t.rentalRates.thirtyDays;
    if (dur === 7) return sum + t.rentalRates.sevenDays;
    if (dur === 3) return sum + t.rentalRates.threeDays;
    return sum + t.rentalRates.oneDay;
  }, 0);
  
  const deposit = checkoutToys.reduce((sum, t) => sum + t.deposit, 0);
  const deliveryFee = checkoutToys.length > 0 ? 99 : 0;
  const insuranceFee = hasInsurance ? 49 : 0;
  const total = rentalFee + deliveryFee + deposit + insuranceFee;

  const handlePay = async () => {
    if (!user) {
      alert("Please sign in to checkout.");
      return;
    }
    if (checkoutToys.length === 0) return;
    setLoading(true);

    try {
      await checkoutMutation({
        clerkId: user.id,
        toyIds: checkoutToys.map(t => t.id as any),
        paymentMethod: paymentMethod,
        totalAmount: total,
      });

      setIsSuccess(true);
      if (isCartCheckout) {
        dispatch({ type: 'CLEAR_CART' });
      }

      // Email Notification Logic via Formspree
      const toyNames = checkoutToys.map(t => t.name).join(', ');
      fetch('https://formspree.io/f/xrpgzdor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: '🚀 New Khelo N Dedo Order!',
          toys: toyNames,
          total: `₹${total}`,
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online',
          address: fullAddress,
          customerEmail: user.primaryEmailAddress?.emailAddress || "Guest",
          oopsieInsurance: hasInsurance ? 'Yes (+₹49)' : 'No',
        })
      }).catch(err => console.error("Email notification failed", err));

    } catch (error) {
      console.error(error);
      alert('Checkout failed!');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-brand-500 min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="bg-white p-4 rounded-full mb-6 relative z-10 animate-in zoom-in duration-500">
          <CheckCircle2 size={64} className="text-brand-500" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2 text-center relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          {paymentMethod === 'cod' ? 'Order Placed!' : 'Payment Successful!'}
        </h1>
        <p className="text-brand-100 text-center mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          Your kid is getting {checkoutToys.length > 1 ? `${checkoutToys.length} toys` : `the ${checkoutToys[0].name}`} 🚀
          {paymentMethod === 'cod' && <><br/><span className="text-yellow-300 font-semibold text-sm">Please keep cash ready at delivery</span></>}
        </p>
        
        {/* Viral Share Hook */}
        <div className="bg-white w-full rounded-3xl p-6 text-center text-gray-900 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <h3 className="font-bold text-lg mb-2">Want ₹100 Off?</h3>
          <p className="text-sm text-gray-500 mb-6">Share this app with parents nearby. If they rent, you both get ₹100.</p>
          
          <button onClick={() => navigate('/')} className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl shadow-md mb-3 flex justify-center items-center gap-2">
            Back to Home
          </button>
          <button onClick={() => navigate('/profile')} className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl">
            View My Rentals
          </button>
        </div>
      </div>
    );
  }

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
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-900">Order Summary ({checkoutToys.length} items)</h3>
          {checkoutToys.map((t, idx) => (
            <div key={idx} className="flex gap-4">
              <img src={t.images[0]} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 leading-tight text-sm mb-1">{t.name}</h4>
                <p className="text-xs text-gray-500">Rent: ₹{t.rentalRates.oneDay} | Dep: ₹{t.deposit}</p>
              </div>
            </div>
          ))}
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
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Street / Area Name" 
              value={address.street}
              onChange={e => setAddress({...address, street: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
            />
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Apt, Suite, etc (Optional)" 
                value={address.apartment}
                onChange={e => setAddress({...address, apartment: e.target.value})}
                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
              />
              <input 
                type="text" 
                placeholder="Pincode (6 digits)" 
                maxLength={6}
                value={address.pincode}
                onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})}
                className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            {!isAddressValid && <div className="text-xs text-red-500 px-1 mt-1">* Please enter a valid street and 6-digit pincode.</div>}
            {isAddressValid && <div className="text-xs text-green-600 font-medium px-1 mt-1 flex items-center gap-1"><MapPin size={12}/> Will be delivered to {address.city}</div>}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'online' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="text-brand-600 focus:ring-brand-500 h-4 w-4" />
              <div>
                <span className="block text-sm font-semibold text-gray-900">Pay Online (UPI/Cards)</span>
                <span className="block text-xs text-gray-500">Secure instant payment</span>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
              <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-brand-600 focus:ring-brand-500 h-4 w-4" />
              <div>
                <span className="block text-sm font-semibold text-gray-900">Cash on Delivery (COD)</span>
                <span className="block text-xs text-gray-500">Pay when your toys arrive</span>
              </div>
            </label>
          </div>
        </div>

        {/* Oopsie Insurance (Damage Waiver) */}
        <label className={`bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 border-2 cursor-pointer transition-all ${hasInsurance ? 'border-brand-500 bg-brand-50/50' : 'border-transparent'}`}>
          <div className="mt-0.5">
            <input 
              type="checkbox" 
              checked={hasInsurance} 
              onChange={() => setHasInsurance(!hasInsurance)} 
              className="text-brand-600 rounded focus:ring-brand-500 h-5 w-5" 
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-1">
                <ShieldCheck size={16} className="text-brand-500" />
                Oopsie Insurance
              </h3>
              <span className="font-bold text-brand-600">+₹49</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              Kids will be kids! Don't lose your deposit if the toy gets accidentally broken. Adds peace of mind for just ₹49.
            </p>
          </div>
        </label>

        {/* Payment Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Price Breakdown</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Rental Fee ({isCartCheckout ? 'Various' : urlDuration + ' Days'})</span>
              <span className="font-semibold text-gray-900">₹{rentalFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery & Pickup</span>
              <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
            </div>
            
            {hasInsurance && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-600 flex items-center gap-1"><ShieldCheck size={14}/> Oopsie Insurance</span>
                <span className="font-semibold text-gray-900">₹49</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm pt-3 border-t border-dashed border-gray-200">
              <div className="flex items-center gap-1">
                <span className="text-gray-800 font-semibold">Refundable Deposit</span>
                <ShieldCheck size={14} className="text-green-500" />
              </div>
              <span className="font-semibold text-gray-900">₹{deposit}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100">
            <span className="font-bold text-gray-900">Total Payable</span>
            <span className="font-bold text-xl text-brand-600">₹{total}</span>
          </div>
          
          <div className="bg-green-50 text-green-700 text-xs font-bold p-3 rounded-xl mt-3 text-center border border-green-100">
            ₹{deposit} will be refunded upon return
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={loading || checkoutToys.length === 0}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg mt-4 flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70 mb-6"
        >
          {loading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order • ₹${total}` : `Pay ₹${total} Securely`}
        </button>

      </div>
    </div>
  );
}
