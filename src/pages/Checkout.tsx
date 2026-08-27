import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();
  const { user } = useAuth();
  
  const searchParams = new URLSearchParams(location.search);
  const urlDuration = parseInt(searchParams.get('duration') || '1');

  const isCartCheckout = id === 'cart';
  const checkoutToys = isCartCheckout ? state.cart : (state.toys.find(t => t.id === id) ? [{ ...state.toys.find(t => t.id === id)!, selectedDuration: urlDuration as any }] : [state.toys[0]]);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('cod');
  const [hasInsurance, setHasInsurance] = useState(true);

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
    if (!user || checkoutToys.length === 0) return;
    setLoading(true);
    
    // Check if in Guest Mode
    if (user.id === '00000000-0000-0000-0000-000000000000') {
      setTimeout(() => {
        setLoading(false);
        setIsSuccess(true);
        
        // Email Notification Logic via Formspree
        const toyNames = checkoutToys.map(t => t.name).join(', ');
        fetch('https://formspree.io/f/xrpgzdor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            subject: '🚀 New Khelo N Dedo Order (Guest)!',
            toys: toyNames,
            total: `₹${total}`,
            paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online',
            address: state.user?.location?.address || 'Bangalore',
            customerEmail: user.email,
            oopsieInsurance: hasInsurance ? 'Yes (+₹49)' : 'No',
          })
        }).catch(err => console.error("Email notification failed", err));
        
      }, 800);
      return;
    }

    // 1. Create the Order to track payment
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: user.id,
      payment_method: paymentMethod,
      total_amount: total,
      status: 'placed'
    }).select();

    if (orderError || !orderData || orderData.length === 0) {
      setLoading(false);
      alert('Failed to create order.');
      return;
    }

    const orderId = orderData[0].id;
    
    // 2. Insert all toys into rentals linked to the new order
    const insertData = checkoutToys.map(t => ({
      toy_id: t.id,
      renter_id: user.id,
      order_id: orderId,
      status: 'active'
    }));

    const { error } = await supabase.from('rentals').insert(insertData);

    setLoading(false);
    if (!error) {
      setIsSuccess(true);
      
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
          address: state.user?.location?.address || 'Bangalore',
          customerEmail: user.email,
          oopsieInsurance: hasInsurance ? 'Yes (+₹49)' : 'No',
        })
      }).catch(err => console.error("Email notification failed", err));
      
      if (isCartCheckout) {
        // We'd ideally clear cart here, assuming we added dispatch to this file
        // For now, it resets on reload or we can just leave it as is
      }
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
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2">
            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <span>{state.user.location.address}</span>
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
