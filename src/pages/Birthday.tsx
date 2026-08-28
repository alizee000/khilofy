import { useState } from 'react';
import { Gift, Users, IndianRupee, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../context/AuthContext';

export default function Birthday() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const reservePack = useMutation(api.party.reservePack);
  const { user } = useAuth();
  
  // Form State
  const [childName, setChildName] = useState('');
  const [ageTurning, setAgeTurning] = useState('');
  const [numberOfKids, setNumberOfKids] = useState('');
  const [budget, setBudget] = useState('');
  const [theme, setTheme] = useState('Space');
  const [errorMsg, setErrorMsg] = useState('');
  
  const generateBundle = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(3); // Show results
      setLoading(false);
    }, 1500);
  };

  if (step === 4) {
    return (
      <div className="w-full bg-blue-600 min-h-screen flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="bg-white p-4 rounded-full mb-6 relative z-10 animate-in zoom-in duration-500">
          <CheckCircle2 size={64} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2 text-center relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          Pack Reserved! 🎉
        </h1>
        <p className="text-blue-100 text-center mb-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          The Birthday Pack has been successfully reserved. We will contact you shortly for delivery details.
        </p>
        
        <div className="bg-white w-full rounded-3xl p-6 text-center text-gray-900 shadow-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700 delay-300">
          <h3 className="font-bold text-lg mb-2">Party Ready!</h3>
          <p className="text-sm text-gray-500 mb-6">A curated box of joy is coming your way.</p>
          
          <button onClick={() => navigate('/')} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md mb-3 flex justify-center items-center gap-2">
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
                  <input type="text" value={childName} onChange={e => setChildName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Ayaan" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age Turning</label>
                  <input type="number" value={ageTurning} onChange={e => setAgeTurning(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="7" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Kids</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="number" value={numberOfKids} onChange={e => setNumberOfKids(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="12" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Budget</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3000" />
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
              {['Space', 'Cars', 'Princess', 'Superheroes', 'Animals', 'Magic'].map(t => (
                <div key={t} onClick={() => setTheme(t)} className={`px-4 py-2 border rounded-full text-sm font-medium cursor-pointer transition-colors ${theme === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'}`}>
                  {t}
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
              <h2 className="text-2xl font-bold text-gray-900">{childName || 'Your Child'}'s {ageTurning || 'Birthday'} Pack</h2>
              <p className="text-gray-500 font-medium">Perfect for {numberOfKids || 10} kids • Indoor • {theme} Theme</p>
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

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl text-center">
                {errorMsg}
              </div>
            )}
            <button 
              onClick={async () => {
                if (!user) {
                  setErrorMsg("Please sign in to reserve a pack.");
                  return;
                }
                setLoading(true);
                setErrorMsg('');
                try {
                  const reservationId = await reservePack({
                    clerkId: user.id,
                    childName: childName || 'Ayaan',
                    ageTurning: parseInt(ageTurning) || 7,
                    numberOfKids: parseInt(numberOfKids) || 12,
                    theme: theme,
                    items: [
                      "Giant LEGO Space Station",
                      "STEM Robot Kit",
                      "RC Cars × 2",
                      "Giant Jenga & Board Games"
                    ],
                    totalAmount: 2849
                  });
                  
                  // Send Email Notification via Formspree
                  await fetch('https://formspree.io/f/xrpgzdor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      subject: `New Party Pack Reserved: ${childName}'s ${theme} Party`,
                      email: user.primaryEmailAddress?.emailAddress || 'customer@toyit.in',
                      message: `A new Party Pack was reserved for ₹2849. Kids: ${numberOfKids}, Age: ${ageTurning}. Items: Giant LEGO Space Station, STEM Robot Kit, RC Cars × 2, Giant Jenga & Board Games`,
                      reservationId: reservationId,
                    })
                  }).catch(e => console.error("Email failed to send", e));

                  setStep(4);
                } catch (e: any) {
                  console.error(e);
                  const msg = e?.message || '';
                  if (msg.includes('auth provider') || msg.includes('Unauthorized')) {
                    setErrorMsg("Authentication error. Please sign out and sign back in, or check your Clerk JWT template configuration.");
                  } else {
                    setErrorMsg("Failed to reserve pack. Please try again.");
                  }
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg mb-3 disabled:opacity-70"
            >
              {loading ? 'Processing Payment...' : 'Reserve Entire Pack'}
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("🔗 Link copied to clipboard! Share it with your co-host.");
              }}
              className="w-full bg-white text-blue-600 border border-blue-200 font-bold rounded-xl py-4 hover:bg-blue-50 transition-colors shadow-sm"
            >
              Share with Co-host
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
