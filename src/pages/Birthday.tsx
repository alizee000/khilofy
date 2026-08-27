import { useState } from 'react';
import { Gift, Users, IndianRupee } from 'lucide-react';

export default function Birthday() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const generateBundle = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(3); // Show results
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="bg-blue-600 text-white px-4 pt-12 pb-8 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 text-9xl">🎂</div>
        <h1 className="text-3xl font-display font-bold mb-2 relative z-10">Birthday Mode</h1>
        <p className="text-blue-100 font-medium relative z-10">We curate the perfect toy bundles for parties, so you don't have to buy.</p>
      </div>

      <div className="px-4 py-8 -mt-6">
        {step === 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Plan a Party</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Child's Name</label>
                <div className="relative">
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Ayaan" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age Turning</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="7" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Kids</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="12" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Budget</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3000" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 mt-8 hover:bg-blue-700 transition-colors shadow-md flex justify-center items-center gap-2"
            >
              Continue <Gift size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 text-center py-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Any themes?</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['Space', 'Cars', 'Princess', 'Superheroes', 'Animals', 'Magic'].map(theme => (
                <div key={theme} className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                  {theme}
                </div>
              ))}
            </div>
            
            <button 
              onClick={generateBundle}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 flex justify-center items-center shadow-md disabled:opacity-70"
            >
              {loading ? 'Curating AI Party Pack...' : 'Generate Birthday Pack ✨'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Ayaan's 7th Birthday Pack</h2>
              <p className="text-gray-500 font-medium">Perfect for 12 kids • Indoor • Space Theme</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">5 Items Included</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-md">Save ₹12,400</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🚀</div>
                  <div className="flex-1"><h4 className="font-semibold text-gray-900">Giant LEGO Space Station</h4></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🤖</div>
                  <div className="flex-1"><h4 className="font-semibold text-gray-900">STEM Robot Kit</h4></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🏎</div>
                  <div className="flex-1"><h4 className="font-semibold text-gray-900">RC Cars × 2</h4></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1"><h4 className="font-semibold text-gray-900">Giant Jenga & Board Games</h4></div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 border-t border-blue-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Rental (2 days)</span>
                  <span className="font-semibold text-gray-900">₹2,650</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Delivery & Setup</span>
                  <span className="font-semibold text-gray-900">₹199</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-blue-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-700">₹2,849</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 hover:bg-blue-700 transition-colors shadow-lg mb-3">
              Reserve Entire Pack
            </button>
            <button className="w-full bg-white text-blue-600 border border-blue-200 font-bold rounded-xl py-4 hover:bg-blue-50 transition-colors shadow-sm">
              Share with Co-host
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
