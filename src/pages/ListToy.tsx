import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, CheckCircle2, Sparkles, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function ListToy() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const addToy = useMutation(api.toys.add);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('LEGO City Space Station');
  const [category, setCategory] = useState('Building Blocks');
  const [ageRange, setAgeRange] = useState('6-12');
  const [rate, setRate] = useState(149);

  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 1500);
  };

  const handleListToy = async () => {
    if (!session) {
      navigate('/auth');
      return;
    }
    setLoading(true);

    try {
      await addToy({
        name: title,
        category: category,
        ageRange: ageRange,
        oneDayRate: rate,
        deposit: 1000,
        images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=800&q=80'],
        condition: 'Excellent',
        description: '',
      });

      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Failed to list toy');
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={64} className="text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Toy Listed Successfully!</h2>
        <p className="text-gray-500">Redirecting to marketplace...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">List a Toy</h1>
      </div>

      <div className="p-4">
        {/* Progress */}
        <div className="flex items-center mb-8 px-2">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-brand-500' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-1.5 rounded-full ml-2 ${step >= 2 ? 'bg-brand-500' : 'bg-gray-200'}`}></div>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Snap a Photo</h2>
              <p className="text-gray-500 text-sm">Clear photos get 3x more rentals!</p>
            </div>
            
            <div 
              className="border-2 border-dashed border-brand-200 bg-brand-50 rounded-3xl h-64 flex flex-col items-center justify-center gap-4 cursor-pointer"
              onClick={handleUpload}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-brand-600 font-medium">Scanning toy with AI...</span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-full shadow-sm text-brand-500">
                    <Camera size={32} />
                  </div>
                  <span className="font-semibold text-brand-700">Tap to Camera</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="bg-gradient-to-r from-brand-50 to-brand-100 p-4 rounded-2xl flex gap-4 items-center">
              <Sparkles className="text-brand-500" size={24} />
              <div>
                <h3 className="font-bold text-brand-900 text-sm">AI Auto-Filled Details</h3>
                <p className="text-brand-600 text-xs">We scanned your photo to save you time!</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Toy Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option>Building Blocks</option>
                    <option>Board Games</option>
                    <option>Vehicles</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-1 block">Age Range</label>
                  <select 
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option>3-5 Years</option>
                    <option>6-12 Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block flex items-center justify-between">
                  <span>Suggested 1-Day Rental</span>
                  <span className="text-trust-600 text-xs bg-trust-50 px-2 py-0.5 rounded-full">Highly Competitive</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <IndianRupee size={16} />
                  </div>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-9 pr-3 font-bold text-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleListToy}
              disabled={loading}
              className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl shadow-sm hover:bg-brand-600 transition-colors mt-8"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
