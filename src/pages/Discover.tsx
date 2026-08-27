import { TrendingUp, Award, Clock } from 'lucide-react';
import ToyCard from '../components/ToyCard';
import { useAppContext } from '../context/AppContext';

export default function Discover() {
  const { state } = useAppContext();
  const { toys } = state;

  return (
    <div className="w-full bg-white min-h-screen pt-6 px-4">
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Discover</h1>
      
      {/* Toy Trends Concept */}
      <div className="bg-gray-900 rounded-3xl p-5 text-white mb-8 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500 rounded-full blur-2xl opacity-40"></div>
        <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-400" /> Trending in Bangalore
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-brand-400">#1</span>
              <span className="font-medium text-white">LEGO Space</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">+34% rentals</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-400">#2</span>
              <span className="font-medium text-white">RC Racing Cars</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">+27% rentals</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-400">#3</span>
              <span className="font-medium text-white">Montessori Kits</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">+19% rentals</span>
          </div>
        </div>
      </div>
      
      {/* Curated Categories */}
      <div className="space-y-8 pb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={20} className="text-yellow-500" /> Parent Favorites
          </h3>
          <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 -mx-4 px-4">
            {toys.map(toy => (
              <div key={toy.id} className="min-w-[160px] max-w-[160px]">
                <ToyCard toy={toy} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> Available Right Now
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {toys.map(toy => (
              <ToyCard key={`avail-${toy.id}`} toy={toy} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
