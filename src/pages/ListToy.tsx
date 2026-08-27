import { useState } from 'react';
import { Camera, Sparkles, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Toy } from '../data/types';

export default function ListToy() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  const handleListToy = () => {
    const newToy: Toy = {
      id: `t${Date.now()}`,
      name: 'LEGO City Space Station (My Toy)',
      description: 'Awesome LEGO City Space Station.',
      category: 'Building Blocks',
      images: [
        'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80'
      ],
      ownerId: state.user.id, // I am the owner
      ageRange: '6-12',
      condition: 'Excellent',
      isCleanedAndChecked: true,
      rentalRates: {
        oneDay: 149,
        threeDays: 299,
        sevenDays: 499,
        thirtyDays: 999,
      },
      deposit: 1000,
      location: state.user.location,
      isAvailableToday: true,
      rating: 5.0,
      reviewsCount: 0,
      recentRentalsCount: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TOY', payload: newToy });
    navigate('/');
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="bg-trust-600 text-white px-4 pt-12 pb-16 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-trust-400 rounded-full blur-3xl opacity-50"></div>
        <h1 className="text-3xl font-display font-bold mb-2 relative z-10">Earn from Toys</h1>
        <p className="text-trust-50 font-medium relative z-10">Your child's old toy could pay for their next one.</p>
      </div>

      <div className="px-4 py-8 -mt-12 relative z-20">
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-trust-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-trust-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Snap a Photo</h3>
            <p className="text-gray-500 text-sm mb-8">Take a picture of the toy. Our AI will automatically suggest the title, price, and category.</p>
            
            <button 
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-trust-600 text-white font-bold rounded-xl py-4 hover:bg-trust-700 transition-colors shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>Analyzing image <Sparkles size={18} className="animate-spin" /></>
              ) : (
                <>Upload Photo <Camera size={18} /></>
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-100 aspect-video relative">
              <img src="https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80" alt="Toy" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-trust-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <Sparkles size={12} /> AI Detected
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                <input type="text" defaultValue="LEGO City Space Station" className="w-full font-bold text-lg text-gray-900 border-b border-gray-200 pb-1 focus:border-brand-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none">
                    <option>Building Blocks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none">
                    <option>6-12 Years</option>
                  </select>
                </div>
              </div>

              <div className="bg-trust-50 border border-trust-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-trust-600" />
                  <h4 className="font-bold text-trust-900 text-sm">Suggested Pricing</h4>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-600 text-sm">Rental Price</span>
                  <span className="font-bold text-gray-900 flex items-center"><IndianRupee size={14}/>149/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Est. Monthly Earnings</span>
                  <span className="font-bold text-trust-700 flex items-center"><IndianRupee size={14}/>1,800 - 3,500</span>
                </div>
              </div>

              <button 
                onClick={handleListToy}
                className="w-full bg-trust-600 text-white font-bold rounded-xl py-4 shadow-md flex justify-center items-center gap-2"
              >
                List This Toy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
