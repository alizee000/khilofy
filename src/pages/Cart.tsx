import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Trash2, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Cart() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const totalRental = state.cart.reduce((sum, toy) => sum + toy.rentalRates.oneDay, 0);
  const totalDeposit = state.cart.reduce((sum, toy) => sum + toy.deposit, 0);
  const total = totalRental + totalDeposit + (state.cart.length > 0 ? 99 : 0); // Flat delivery

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-safe">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Your Cart</h1>
      </div>

      <div className="p-4 space-y-4">
        {state.cart.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-gray-500 mb-6">Looks like you haven't added any toys yet.</p>
            <Link to="/discover" className="bg-brand-500 text-white font-bold px-6 py-3 rounded-xl shadow-md">
              Discover Toys
            </Link>
          </div>
        ) : (
          <>
            {state.cart.map(toy => (
              <div key={toy.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm relative">
                <img src={toy.images[0]} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1">{toy.name}</h3>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <div className="text-xs text-gray-500">Rent: ₹{toy.rentalRates.oneDay}/day</div>
                      <div className="text-xs text-gray-500">Deposit: ₹{toy.deposit}</div>
                    </div>
                    <button 
                      onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: toy.id })}
                      className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-4 shadow-sm mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Rent (1 Day)</span>
                  <span className="font-semibold text-gray-900">₹{totalRental}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Refundable Deposit</span>
                  <span className="font-semibold text-gray-900">₹{totalDeposit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-gray-900">₹99</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="font-bold text-xl text-brand-600">₹{total}</span>
              </div>
            </div>

            <Link 
              to="/checkout/cart"
              className="block w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg mt-4 text-center hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout (₹{total})
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
